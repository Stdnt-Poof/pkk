<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\UserRole;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * The "role" column is intentionally left out of the fillable list so a
 * request can never promote itself to an administrator on registration.
 */
#[Fillable(['username', 'email', 'password'])]
#[Hidden(['password', 'remember_token', 'ratings'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
            'rating' => 'float',
            'ratings' => 'array',
            'settings' => 'array',
        ];
    }

    /**
     * Determine whether the account belongs to an administrator.
     */
    public function isAdmin(): bool
    {
        return $this->role?->isAdmin() ?? false;
    }

    /**
     * Get the portfolio items uploaded by the account.
     *
     * @return HasMany<Portfolio, $this>
     */
    public function portfolios(): HasMany
    {
        return $this->hasMany(Portfolio::class);
    }

    /**
     * Get the services offered by the account.
     *
     * @return HasMany<Service, $this>
     */
    public function services(): HasMany
    {
        return $this->hasMany(Service::class);
    }

    /**
     * Get the direct messages sent by the account.
     *
     * @return HasMany<Message, $this>
     */
    public function sentMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    /**
     * Get the direct messages received by the account.
     *
     * @return HasMany<Message, $this>
     */
    public function receivedMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'recipient_id');
    }

    /**
     * Get the feed posts written by the account.
     *
     * @return HasMany<Post, $this>
     */
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    /**
     * Get the post likes given by the account.
     *
     * @return HasMany<Like, $this>
     */
    public function likes(): HasMany
    {
        return $this->hasMany(Like::class);
    }

    /**
     * Get the posts bookmarked by the account.
     *
     * @return HasMany<Save, $this>
     */
    public function saves(): HasMany
    {
        return $this->hasMany(Save::class);
    }

    /**
     * Get the comments written by the account.
     *
     * @return HasMany<Comment, $this>
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Get the flags raised by the account (members and admins both flag
     * through the same flow — the admin queue only cares who raised it).
     *
     * @return HasMany<Report, $this>
     */
    public function reports(): HasMany
    {
        return $this->hasMany(Report::class, 'reporter_id');
    }

    /**
     * Get the flags filed directly against the account.
     *
     * @return HasMany<Report, $this>
     */
    public function reportsReceived(): HasMany
    {
        return $this->hasMany(Report::class, 'reported_user_id');
    }

    /**
     * Get the flags filed against the account's posts.
     *
     * @return HasManyThrough<Report, Post, $this>
     */
    public function reportsOnPosts(): HasManyThrough
    {
        return $this->hasManyThrough(Report::class, Post::class);
    }

    /**
     * Get the members this account follows.
     *
     * @return BelongsToMany<User, $this>
     */
    public function following(): BelongsToMany
    {
        return $this->belongsToMany(self::class, 'follows', 'follower_id', 'following_id')->withTimestamps();
    }

    /**
     * Get the members following this account.
     *
     * @return BelongsToMany<User, $this>
     */
    public function followers(): BelongsToMany
    {
        return $this->belongsToMany(self::class, 'follows', 'following_id', 'follower_id')->withTimestamps();
    }

    /**
     * Get the average of the raw per-rater votes.
     *
     * Computed in PHP so the logic behaves identically on every driver.
     */
    public function recalculateRating(): void
    {
        $votes = array_map('intval', array_values($this->ratings ?? []));

        $this->rating = $votes === [] ? null : round(array_sum($votes) / count($votes), 2);
        $this->rating_count = count($votes);
    }
}
