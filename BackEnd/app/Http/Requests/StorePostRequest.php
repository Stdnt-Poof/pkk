<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    /**
     * The longest post body, matching the composer's 280 limit.
     */
    public const MAX_BODY_LENGTH = 280;

    /**
     * The most pictures one post can carry.
     */
    public const MAX_IMAGES = 4;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * A post is either text, pictures, or both — at least one of the two
     * has to be present. Multipart bodies only parse on POST, which is
     * what the create endpoint already uses.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'body' => ['required_without:images', 'nullable', 'string', 'max:'.self::MAX_BODY_LENGTH],
            'images' => ['sometimes', 'array', 'max:'.self::MAX_IMAGES],
            'images.*' => ['file', 'image', 'mimes:jpg,jpeg,png,gif,webp', 'max:5120'],
        ];
    }
}
