<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthChangePasswordTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_user_can_change_their_password(): void
    {
        $user = User::factory()->create(['password' => 'super-secret']);
        $token = $user->createToken('auth')->plainTextToken;

        $this->withToken($token)
            ->postJson('/api/auth/password', [
                'current' => 'super-secret',
                'next' => 'even-more-secret',
                'confirm' => 'even-more-secret',
            ])
            ->assertOk();

        $this->assertTrue(Hash::check('even-more-secret', $user->fresh()->password));

        $this->postJson('/api/auth/login', [
            'identifier' => $user->username,
            'password' => 'even-more-secret',
        ])->assertOk();
    }

    public function test_the_current_password_must_match(): void
    {
        $token = User::factory()->create(['password' => 'super-secret'])
            ->createToken('auth')->plainTextToken;

        $this->withToken($token)
            ->postJson('/api/auth/password', [
                'current' => 'wrong-password',
                'next' => 'even-more-secret',
                'confirm' => 'even-more-secret',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['current']);
    }

    public function test_the_new_password_must_be_at_least_eight_characters(): void
    {
        $token = User::factory()->create(['password' => 'super-secret'])
            ->createToken('auth')->plainTextToken;

        $this->withToken($token)
            ->postJson('/api/auth/password', [
                'current' => 'super-secret',
                'next' => 'short',
                'confirm' => 'short',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['next']);
    }

    public function test_the_new_password_confirmation_must_match(): void
    {
        $token = User::factory()->create(['password' => 'super-secret'])
            ->createToken('auth')->plainTextToken;

        $this->withToken($token)
            ->postJson('/api/auth/password', [
                'current' => 'super-secret',
                'next' => 'even-more-secret',
                'confirm' => 'different-password',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['confirm']);
    }

    public function test_a_guest_cannot_change_a_password(): void
    {
        $this->postJson('/api/auth/password', [
            'current' => 'super-secret',
            'next' => 'even-more-secret',
            'confirm' => 'even-more-secret',
        ])->assertUnauthorized();
    }
}
