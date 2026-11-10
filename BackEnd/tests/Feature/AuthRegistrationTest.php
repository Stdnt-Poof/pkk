<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\PersonalAccessToken;
use Tests\TestCase;

class AuthRegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_guest_can_register(): void
    {
        $response = $this->postJson('/api/auth/register', $this->validPayload());

        $response->assertCreated()
            ->assertJsonStructure([
                'data' => [
                    'user' => ['id', 'username', 'email', 'created_at'],
                    'token',
                ],
            ])
            ->assertJsonPath('data.user.username', 'shlofte')
            ->assertJsonPath('data.user.email', 'shlofte@mail.com');

        $this->assertDatabaseHas('users', [
            'username' => 'shlofte',
            'email' => 'shlofte@mail.com',
        ]);

        $this->assertTrue(Hash::check('super-secret', User::firstOrFail()->password));
        $this->assertNotNull(PersonalAccessToken::findToken($response->json('data.token')));
    }

    public function test_registration_requires_every_field(): void
    {
        $this->postJson('/api/auth/register', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email', 'username', 'password', 'confirmpassword']);
    }

    public function test_registration_rejects_an_email_that_is_already_taken(): void
    {
        User::factory()->create(['email' => 'shlofte@mail.com']);

        $this->postJson('/api/auth/register', $this->validPayload())
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    }

    public function test_registration_rejects_a_username_that_is_already_taken(): void
    {
        User::factory()->create(['username' => 'shlofte']);

        $this->postJson('/api/auth/register', $this->validPayload())
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['username']);
    }

    public function test_registration_rejects_a_password_that_is_too_short(): void
    {
        $this->postJson('/api/auth/register', $this->validPayload([
            'password' => 'short',
            'confirmpassword' => 'short',
        ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['password']);
    }

    public function test_registration_rejects_a_mismatched_password_confirmation(): void
    {
        $this->postJson('/api/auth/register', $this->validPayload([
            'confirmpassword' => 'different-password',
        ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['confirmpassword']);
    }

    /**
     * Build a valid registration payload.
     *
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'email' => 'shlofte@mail.com',
            'username' => 'shlofte',
            'password' => 'super-secret',
            'confirmpassword' => 'super-secret',
        ], $overrides);
    }
}
