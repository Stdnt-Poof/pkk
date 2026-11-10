<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * One row of the admin flag queue: the flag itself, who raised it and
 * what it points at — either a post excerpt or the reported member.
 */
class ReportResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $isPost = $this->resource->post_id !== null;

        return [
            'id' => $this->id,
            'type' => $isPost ? 'post' : 'user',
            'reason' => $this->reason,
            'created_at' => $this->created_at,
            'reporter' => new PublicUserResource($this->whenLoaded('reporter')),
            'post' => $isPost ? [
                'id' => $this->post->id,
                'body' => $this->post->body,
                'created_at' => $this->post->created_at,
                'author' => new PublicUserResource($this->post->user),
            ] : null,
            'user' => $isPost ? null : new PublicUserResource($this->whenLoaded('reportedUser')),
        ];
    }
}
