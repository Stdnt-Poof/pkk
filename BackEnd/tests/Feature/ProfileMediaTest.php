<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProfileMediaTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('local');
    }

    public function test_the_profile_update_needs_a_logged_in_account(): void
    {
        $this->postJson('/api/profile', ['bio' => 'Hi'])->assertUnauthorized();
    }

    public function test_a_user_can_update_their_bio(): void
    {
        $user = User::factory()->create();

        $this->withToken($this->tokenFor($user))
            ->postJson('/api/profile', ['bio' => 'Building things.'])
            ->assertOk()
            ->assertJsonPath('data.bio', 'Building things.')
            ->assertJsonPath('data.avatar_url', null)
            ->assertJsonPath('data.cover_url', null)
            ->assertJsonPath('data.cover_type', null);

        $this->assertDatabaseHas('users', ['id' => $user->id, 'bio' => 'Building things.']);
    }

    public function test_the_bio_cannot_exceed_five_hundred_characters(): void
    {
        $this->withToken($this->tokenFor(User::factory()->create()))
            ->postJson('/api/profile', ['bio' => str_repeat('a', 501)])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['bio']);
    }

    public function test_a_user_can_upload_a_profile_picture(): void
    {
        $user = User::factory()->create();

        $this->withToken($this->tokenFor($user))
            ->post('/api/profile', ['avatar' => UploadedFile::fake()->image('me.jpg', 400, 400)], ['Accept' => 'application/json'])
            ->assertOk()
            ->assertJsonPath('data.avatar_url', route('users.avatar', $user));

        $user->refresh();
        $this->assertNotNull($user->avatar_path);
        Storage::disk('local')->assertExists($user->avatar_path);

        $size = getimagesize(Storage::disk('local')->path($user->avatar_path));
        $this->assertSame([512, 512], [$size[0], $size[1]]);
    }

    public function test_the_profile_picture_is_cropped_to_a_square(): void
    {
        $user = User::factory()->create();

        $this->withToken($this->tokenFor($user))
            ->post('/api/profile', ['avatar' => UploadedFile::fake()->image('wide.jpg', 800, 400)], ['Accept' => 'application/json'])
            ->assertOk();

        $size = getimagesize(Storage::disk('local')->path($user->refresh()->avatar_path));

        $this->assertSame([512, 512], [$size[0], $size[1]]);
    }

    public function test_a_profile_picture_must_be_a_supported_image(): void
    {
        $this->withToken($this->tokenFor(User::factory()->create()))
            ->postJson('/api/profile', ['avatar' => UploadedFile::fake()->create('pic.gif', 10, 'image/gif')])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['avatar']);
    }

    public function test_a_profile_picture_must_be_at_least_sixty_four_pixels(): void
    {
        $this->withToken($this->tokenFor(User::factory()->create()))
            ->postJson('/api/profile', ['avatar' => UploadedFile::fake()->image('tiny.jpg', 10, 10)])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['avatar']);
    }

    public function test_a_profile_picture_cannot_exceed_two_megabytes(): void
    {
        $this->withToken($this->tokenFor(User::factory()->create()))
            ->postJson('/api/profile', ['avatar' => UploadedFile::fake()->image('big.jpg', 400, 400)->size(3000)])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['avatar']);
    }

    public function test_replacing_the_profile_picture_removes_the_previous_file(): void
    {
        $user = User::factory()->create();
        $token = $this->tokenFor($user);

        $this->withToken($token)
            ->post('/api/profile', ['avatar' => UploadedFile::fake()->image('first.jpg', 400, 400)], ['Accept' => 'application/json'])
            ->assertOk();

        $first = $user->refresh()->avatar_path;

        $this->withToken($token)
            ->post('/api/profile', ['avatar' => UploadedFile::fake()->image('second.jpg', 400, 400)], ['Accept' => 'application/json'])
            ->assertOk();

        Storage::disk('local')->assertMissing($first);
        Storage::disk('local')->assertExists($user->refresh()->avatar_path);
    }

    public function test_a_user_can_remove_their_profile_media(): void
    {
        $user = User::factory()->create();
        $token = $this->tokenFor($user);

        $this->withToken($token)
            ->post('/api/profile', [
                'avatar' => UploadedFile::fake()->image('me.jpg', 400, 400),
                'cover' => UploadedFile::fake()->create('clip.mp4', 500, 'video/mp4'),
            ], ['Accept' => 'application/json'])
            ->assertOk();

        $storedAvatar = $user->refresh()->avatar_path;
        $storedCover = $user->cover_path;

        // Multipart flags arrive as strings, which the boolean rule would
        // reject without the prepareForValidation normalization.
        $this->withToken($token)
            ->post('/api/profile', ['remove_avatar' => 'true', 'remove_cover' => 'true'], ['Accept' => 'application/json'])
            ->assertOk()
            ->assertJsonPath('data.avatar_url', null)
            ->assertJsonPath('data.cover_url', null)
            ->assertJsonPath('data.cover_type', null);

        Storage::disk('local')->assertMissing($storedAvatar);
        Storage::disk('local')->assertMissing($storedCover);
        $this->assertNull($user->refresh()->avatar_path);
        $this->assertNull($user->cover_path);
    }

    public function test_a_user_can_upload_an_image_background(): void
    {
        $user = User::factory()->create();

        $this->withToken($this->tokenFor($user))
            ->post('/api/profile', ['cover' => UploadedFile::fake()->image('bg.jpg', 2400, 1000)], ['Accept' => 'application/json'])
            ->assertOk()
            ->assertJsonPath('data.cover_type', 'image')
            ->assertJsonPath('data.cover_url', route('users.cover', $user));

        $size = getimagesize(Storage::disk('local')->path($user->refresh()->cover_path));

        $this->assertSame(1920, $size[0]);
        $this->assertSame(800, $size[1]);
    }

    public function test_a_user_can_upload_a_video_background(): void
    {
        $user = User::factory()->create();

        $this->withToken($this->tokenFor($user))
            ->post('/api/profile', ['cover' => UploadedFile::fake()->create('clip.mp4', 500, 'video/mp4')], ['Accept' => 'application/json'])
            ->assertOk()
            ->assertJsonPath('data.cover_type', 'video')
            ->assertJsonPath('data.cover_url', route('users.cover', $user));

        Storage::disk('local')->assertExists($user->refresh()->cover_path);
    }

    public function test_a_background_must_be_a_supported_file(): void
    {
        $this->withToken($this->tokenFor(User::factory()->create()))
            ->postJson('/api/profile', ['cover' => UploadedFile::fake()->create('notes.txt', 10, 'text/plain')])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['cover']);
    }

    public function test_the_background_cannot_exceed_fifty_megabytes(): void
    {
        $this->withToken($this->tokenFor(User::factory()->create()))
            ->postJson('/api/profile', ['cover' => UploadedFile::fake()->create('huge.mp4', 51201, 'video/mp4')])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['cover']);
    }

    public function test_the_profile_picture_is_served_without_a_token(): void
    {
        $user = User::factory()->create();

        $this->withToken($this->tokenFor($user))
            ->post('/api/profile', ['avatar' => UploadedFile::fake()->image('me.jpg', 400, 400)], ['Accept' => 'application/json'])
            ->assertOk();

        $this->get(route('users.avatar', $user))
            ->assertOk()
            ->assertHeader('content-type', 'image/jpeg');
    }

    public function test_the_background_video_is_served_without_a_token(): void
    {
        $user = User::factory()->create();

        $this->withToken($this->tokenFor($user))
            ->post('/api/profile', ['cover' => UploadedFile::fake()->create('clip.mp4', 500, 'video/mp4')], ['Accept' => 'application/json'])
            ->assertOk();

        $this->get(route('users.cover', $user))->assertOk();
    }

    public function test_the_media_endpoints_404_without_an_upload(): void
    {
        $user = User::factory()->create();

        $this->get(route('users.avatar', $user))->assertNotFound();
        $this->get(route('users.cover', $user))->assertNotFound();
    }

    private function tokenFor(User $user): string
    {
        return $user->createToken('auth')->plainTextToken;
    }
}
