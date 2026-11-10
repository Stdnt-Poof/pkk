<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * The public profile of any member, opened from search or the feed.
 *
 * Everything a viewer is allowed to see — no email, no role internals.
 * Mirrors UserResource's shape so the profile page renders the same fields
 * for itself and for others.
 */
class PublicProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'username' => $this->username,
            'bio' => $this->bio,
            'rating' => $this->rating,
            'rating_count' => $this->rating_count,
            'avatar_url' => $this->avatar_path ? route('users.avatar', $this->resource) : null,
            'cover_url' => $this->cover_path ? route('users.cover', $this->resource) : null,
            'cover_type' => $this->coverType(),
            'created_at' => $this->created_at,
            // The follow graph: both counts are public profile stats, and
            // the flag mirrors `reported` — viewer-relative, so the
            // Follow button keeps its state after a reload. Checked on
            // the viewer's own relation: the profile owner's relation
            // already pins the pivot's follower column to themselves.
            'followers_count' => $this->resource->followers()->count(),
            'following_count' => $this->resource->following()->count(),
            'following' => $request->user()?->following()->whereKey($this->id)->exists() ?? false,
            // Whether the viewer already has an open flag on this member —
            // lets the profile page show the "Reported" state after a reload.
            'reported' => $this->resource->reportsReceived()
                ->where('reporter_id', $request->user()?->id)
                ->exists(),
        ];
    }

    /**
     * Tell the frontend whether the background is an image or a video.
     *
     * The public cover URL carries no file extension, so the type is
     * resolved from the stored path instead.
     */
    private function coverType(): ?string
    {
        if (! $this->cover_path) {
            return null;
        }

        $extension = strtolower(pathinfo((string) $this->cover_path, PATHINFO_EXTENSION));

        return in_array($extension, ['mp4', 'webm'], true) ? 'video' : 'image';
    }
}
