<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin = 'admin';

    case User = 'user';

    /**
     * Determine whether the role may access admin-only areas.
     */
    public function isAdmin(): bool
    {
        return $this === self::Admin;
    }
}
