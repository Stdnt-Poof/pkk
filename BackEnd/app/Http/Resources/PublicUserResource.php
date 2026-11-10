<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * The member info other people are allowed to see: enough to render a
 * service card, a DM header and the profile stars — nothing private.
 */
class PublicUserResource extends JsonResource
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
            'avatar_url' => $this->avatar_path ? route('users.avatar', $this->resource) : null,
            'rating' => $this->rating,
            'rating_count' => $this->rating_count,
        ];
    }
}
