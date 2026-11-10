<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\PersonalAccessToken;
use Tests\TestCase;

class AuthLoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_user_can_log_in_with_their_username(): void
    {
        $user = User::factory()->create([
            'username' => 'shlofte',
            'email' => 'shlofte@mail.com',
            'password' => 'super-secret',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'identifier' => 'shlofte',
            'password' => 'super-secret',
        ]);

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'user' => ['id', 'username', 'email', 'created_at'],
                    'token',
                ],
            ])
            ->assertJsonPath('data.user.id', $user->id);

        $this->assertNotNull(PersonalAccessToken::findToken($response->json('data.token')));
    }

    public function test_a_user_can_log_in_with_their_email(): void
    {
        User::factory()->create([
            'username' => 'shlofte',
            'email' => 'shlofte@mail.com',
            'password' => 'super-secret',
        ]);

        $this->postJson('/api/auth/login', [
            'identifier' => 'shlofte@mail.com',
            'password' => 'super-secret',
        ])->assertOk();
    }

    public function test_login_is_case_insensitive(): void
    {
        User::factory()->create([
            'username' => 'Shlofte',
            'email' => 'Shlofte@Mail.com',
            'password' => 'super-secret',
        ]);

        $this->postJson('/api/auth/login', [
            'identifier' => 'shlofte',
            'password' => 'super-secret',
        ])->assertOk();
    }

    public function test_login_rejects_an_incorrect_password(): void
    {
        User::factory()->create([
            'username' => 'shlofte',
            'password' => 'super-secret',
        ]);

        $this->postJson('/api/auth/login', [
            'identifier' => 'shlofte',
            'password' => 'wrong-password',
        ])->assertUnauthorized();
    }

    public function test_login_rejects_an_unknown_identifier(): void
    {
        $this->postJson('/api/auth/login', [
            'identifier' => 'nobody',
            'password' => 'super-secret',
        ])->assertUnauthorized();
    }

    public function test_login_requires_an_identifier_and_password(): void
    {
        $this->postJson('/api/auth/login', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['identifier', 'password']);
    }
}
