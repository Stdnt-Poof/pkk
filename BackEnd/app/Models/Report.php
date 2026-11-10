<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Report extends Model
{
    /**
     * The preset reasons the report overlay offers (mirrors the frontend).
     *
     * A flagger may also type their own reason instead, so the column
     * accepts any string up to 100 characters — these are suggestions,
     * not an enum.
     *
     * @var array<int, string>
     */
    public const REASONS = [
        'Spam',
        'Harassment',
        'Sexual content',
        'Scam',
        'Impersonation',
        'Copyright',
        'Other',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'post_id',
        'reported_user_id',
        'reporter_id',
        'reason',
    ];

    /**
     * Get the flagged post (null for flags aimed at a member).
     *
     * @return BelongsTo<Post, $this>
     */
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    /**
     * Get the reported member (null for flags aimed at a post).
     *
     * @return BelongsTo<User, $this>
     */
    public function reportedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reported_user_id');
    }

    /**
     * Get the member or admin who raised the flag.
     *
     * @return BelongsTo<User, $this>
     */
    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }
}
