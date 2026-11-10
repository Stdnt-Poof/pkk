<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\URL;

/**
 * @property-read int $id
 * @property-read string $title
 * @property-read string $kind
 * @property-read string|null $external_url
 * @property-read string|null $file_path
 * @property-read string|null $file_name
 * @property-read string|null $preview_path
 */
class PortfolioResource extends JsonResource
{
    /**
     * URL of the fallback preview shown when a CV has no uploaded photo.
     */
    public const DEFAULT_CV_PREVIEW = '/img/default-cv.png';

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
            'kind' => $this->kind,
            'external_url' => $this->external_url,
            // The file stream is owner-only, so other members simply see
            // a null URL instead of a link that would 403.
            'file_url' => $this->resource->file_path
                && $request->user()?->id === $this->resource->user_id
                ? route('portfolios.file', $this->resource)
                : null,
            'file_name' => $this->file_name,
            'preview_url' => $this->previewUrl(),
            'created_at' => $this->created_at,
        ];
    }

    /**
     * Resolve the preview image for the card.
     *
     * Uploaded CVs fall back to the baked-in default preview so every
     * card always shows a photo.
     */
    private function previewUrl(): ?string
    {
        if ($this->preview_path) {
            return route('portfolios.preview', $this->resource);
        }

        return $this->resource->isCv() ? URL::to(self::DEFAULT_CV_PREVIEW) : null;
    }
}
