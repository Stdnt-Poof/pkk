<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateServiceRequest extends FormRequest
{
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
     * A partial update: every field is optional and only the keys that
     * were actually sent end up on the service.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'min:3', 'max:120'],
            'description' => ['sometimes', 'string', 'min:10', 'max:2000'],
            'tags' => ['sometimes', 'array', 'min:1', 'max:5'],
            'tags.*' => ['string', 'max:30', 'distinct'],
            'price' => ['sometimes', 'integer', 'min:0', 'max:99999999999'],
            'currency' => ['sometimes', 'in:'.implode(',', StoreServiceRequest::CURRENCIES)],
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
            'description' => 'service description',
            'tags.*' => 'tag',
            'currency' => 'price currency',
        ];
    }

    /**
     * Get only the validated fields that were present in the request.
     *
     * @return array<string, mixed>
     */
    public function serviceData(): array
    {
        $data = $this->safe()->only(['title', 'description', 'price', 'currency']);

        if ($this->has('tags')) {
            $data['tags'] = array_values($this->safe()->tags ?? []);
        }

        return $data;
    }
}
