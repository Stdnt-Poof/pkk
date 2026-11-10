<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AccountSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_user_can_read_their_account_information(): void
    {
        $user = User::factory()->create([
            'username' => 'shlofte',
            'email' => 'shlofte@mail.com',
            'role' => UserRole::Admin,
        ]);

        $token = $user->createToken('auth')->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/users/me')
            ->assertOk()
            ->assertJsonStructure([
                'data' => ['id', 'username', 'email', 'role', 'created_at'],
            ])
            ->assertJsonPath('data.id', $user->id)
            ->assertJsonPath('data.username', 'shlofte')
            ->assertJsonPath('data.email', 'shlofte@mail.com')
            ->assertJsonPath('data.role', UserRole::Admin->value);
    }

    public function test_the_account_information_needs_a_logged_in_account(): void
    {
        $this->getJson('/api/users/me')->assertUnauthorized();
    }

    public function test_the_account_information_never_leaks_the_password(): void
    {
        $token = User::factory()->create()->createToken('auth')->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/users/me')
            ->assertOk()
            ->assertJsonMissingPath('data.password')
            ->assertJsonMissingPath('data.remember_token');
    }

    public function test_the_account_information_includes_the_profile_fields(): void
    {
        $token = User::factory()->create(['bio' => 'Building things.'])
            ->createToken('auth')->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/users/me')
            ->assertOk()
            ->assertJsonPath('data.bio', 'Building things.')
            ->assertJsonPath('data.avatar_url', null)
            ->assertJsonPath('data.cover_url', null)
            ->assertJsonPath('data.cover_type', null);
    }
}
