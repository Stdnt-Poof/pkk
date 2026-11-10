<?php

namespace App\Http\Resources;

use App\Enums\UserRole;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'email' => $this->email,
            'role' => $this->role?->value ?? UserRole::User->value,
            'bio' => $this->bio,
            'rating' => $this->rating,
            'rating_count' => $this->rating_count,
            'avatar_url' => $this->avatar_path ? route('users.avatar', $this->resource) : null,
            'cover_url' => $this->cover_path ? route('users.cover', $this->resource) : null,
            'cover_type' => $this->coverType(),
            'created_at' => $this->created_at,
            // Own-account only: settings are private, so other members'
            // payloads (profiles, admin list) never carry them; the
            // unauthenticated self-issue at register/login counts as own.
            'settings' => $this->when(
                $request->user() === null || $request->user()->id === $this->id,
                fn () => $this->settings ?? []
            ),
            // Follow counts are public, but only the own profile page
            // renders them from this resource — other members' counts
            // travel via PublicProfileResource, so this stays own-payload
            // (and keeps the admin list query free of extra joins).
            'followers_count' => $this->when(
                $request->user() === null || $request->user()->id === $this->id,
                fn () => $this->resource->followers()->count()
            ),
            'following_count' => $this->when(
                $request->user() === null || $request->user()->id === $this->id,
                fn () => $this->resource->following()->count()
            ),
            // Only present when the query loaded it (admin member list);
            // keeps /auth/me and profile payloads unchanged.
            'posts_count' => $this->when(isset($this->posts_count), fn () => (int) $this->posts_count),
            // Moderation heat on the member: direct flags plus flags on
            // their posts (both counts loaded by the admin users query).
            'reports_count' => $this->when(
                isset($this->direct_reports_count) || isset($this->post_reports_count),
                fn () => (int) ($this->direct_reports_count ?? 0) + (int) ($this->post_reports_count ?? 0)
            ),
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
