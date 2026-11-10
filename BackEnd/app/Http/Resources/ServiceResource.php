<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
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
            'title' => $this->title,
            'description' => $this->description,
            'tags' => $this->tags,
            'price' => $this->price,
            'currency' => $this->currency,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'is_mine' => $request->user()?->id === $this->user_id,
            'provider' => new PublicUserResource($this->whenLoaded('user')),
        ];
    }
}
