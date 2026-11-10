<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    /**
     * The most tag chips a post can show.
     */
    private const MAX_TAGS = 6;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'body' => $this->body,
            'created_at' => $this->created_at,
            'tags' => $this->tags(),
            'likes' => $this->likes_count ?? 0,
            'liked' => (bool) ($this->liked ?? false),
            'saved' => (bool) ($this->saved ?? false),
            'flagged' => (bool) ($this->flagged ?? false),
            'is_mine' => $request->user()?->id === $this->user_id,
            'author' => new PublicUserResource($this->whenLoaded('user')),
            'comments' => CommentResource::collection($this->whenLoaded('comments')),
        ];
    }

    /**
     * Derive the tag chips from the #hashtags written in the body.
     *
     * Parsed at read time so the body stays the single source of truth —
     * no tags column to drift out of sync.
     *
     * @return array<int, string>
     */
    private function tags(): array
    {
        preg_match_all('/#(\w+)/u', (string) $this->body, $matches);

        return array_slice(array_values(array_unique($matches[1] ?? [])), 0, self::MAX_TAGS);
    }
}
