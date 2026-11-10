<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthRoleTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_can_never_choose_an_admin_role(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'email' => 'shlofte@mail.com',
            'username' => 'shlofte',
            'password' => 'super-secret',
            'confirmpassword' => 'super-secret',
            'role' => UserRole::Admin->value,
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.user.role', UserRole::User->value);

        $this->assertSame(UserRole::User, User::firstOrFail()->role);
    }

    public function test_the_current_user_is_returned_with_their_role(): void
    {
        $token = User::factory()->admin()->create()->createToken('auth')->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/auth/me')
            ->assertOk()
            ->assertJsonPath('data.role', UserRole::Admin->value);
    }

    public function test_an_admin_can_read_the_admin_overview(): void
    {
        User::factory()->count(2)->create();
        User::factory()->admin()->create();

        $token = User::where('role', UserRole::Admin)->firstOrFail()
            ->createToken('auth')->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/admin/overview')
            ->assertOk()
            ->assertJsonPath('data.total_users', 3)
            ->assertJsonPath('data.admins', 1)
            ->assertJsonPath('data.members', 2);
    }

    public function test_a_member_cannot_read_the_admin_overview(): void
    {
        $token = User::factory()->create()->createToken('auth')->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/admin/overview')
            ->assertForbidden();
    }

    public function test_a_guest_cannot_read_the_admin_overview(): void
    {
        $this->getJson('/api/admin/overview')->assertUnauthorized();
    }

    public function test_the_demo_admin_and_member_accounts_are_seeded(): void
    {
        $this->seed(DatabaseSeeder::class);

        $admin = User::where('username', 'admin')->firstOrFail();
        $member = User::where('username', 'member')->firstOrFail();

        $this->assertTrue($admin->isAdmin());
        $this->assertFalse($member->isAdmin());
        $this->assertTrue(Hash::check('admin1234', $admin->password));
        $this->assertTrue(Hash::check('member1234', $member->password));

        // Re-seeding must not duplicate or reset the accounts.
        $this->seed(DatabaseSeeder::class);
        $this->assertDatabaseCount('users', 2);
    }
}
