<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * The demo accounts the application ships with.
     *
     * @var array<int, array{username: string, email: string, password: string, role: UserRole, bio: string}>
     */
    private const ACCOUNTS = [
        [
            'username' => 'admin',
            'email' => 'admin@stardust.test',
            'password' => 'admin1234',
            'role' => UserRole::Admin,
            'bio' => 'Make Your Skills Soar Through the Sky',
        ],
        [
            'username' => 'member',
            'email' => 'member@stardust.test',
            'password' => 'member1234',
            'role' => UserRole::User,
            'bio' => 'Just arrived. Building things.',
        ],
    ];

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        foreach (self::ACCOUNTS as $account) {
            $user = User::query()->firstOrNew(['username' => $account['username']]);

            // "role" is not mass assignable, so it is applied explicitly here.
            $user->forceFill([
                'email' => $account['email'],
                'password' => $account['password'],
                'role' => $account['role'],
                'bio' => $account['bio'],
            ])->save();
        }
    }
}
