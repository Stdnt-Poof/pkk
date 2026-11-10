<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    /**
     * The largest background video accepted, in kilobytes.
     */
    public const MAX_COVER_KILOBYTES = 51200;

    /**
     * The largest profile picture accepted, in kilobytes.
     */
    public const MAX_AVATAR_KILOBYTES = 2048;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Multipart bodies (FormData, curl -F) can only send strings, so the
     * remove flags arrive as "true"/"false" — which the boolean rule
     * rejects. Normalize them before validation runs.
     */
    protected function prepareForValidation(): void
    {
        $flags = [];

        foreach (['remove_avatar', 'remove_cover'] as $flag) {
            if ($this->has($flag)) {
                $flags[$flag] = filter_var(
                    $this->input($flag),
                    FILTER_VALIDATE_BOOLEAN,
                    FILTER_NULL_ON_FAILURE,
                );
            }
        }

        if ($flags !== []) {
            $this->merge($flags);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * The background accepts images and short videos; the profile picture
     * is images only. Uploading a new file replaces the stored one, while
     * the remove_* flags delete it and fall back to the defaults.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'bio' => ['nullable', 'string', 'max:500'],
            'avatar' => [
                'sometimes',
                'file',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'dimensions:min_width=64,min_height=64',
                'max:'.self::MAX_AVATAR_KILOBYTES,
            ],
            'cover' => ['sometimes', 'file', 'mimes:jpg,jpeg,png,webp,mp4,webm', 'max:'.self::MAX_COVER_KILOBYTES],
            'remove_avatar' => ['sometimes', 'boolean'],
            'remove_cover' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * Get the attributes to use when validating.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'avatar' => 'profile picture',
            'cover' => 'background',
            'remove_avatar' => 'remove profile picture',
            'remove_cover' => 'remove background',
        ];
    }
}
