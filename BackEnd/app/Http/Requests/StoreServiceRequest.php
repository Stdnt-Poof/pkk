<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequest extends FormRequest
{
    /**
     * The currencies a service price may be listed in.
     *
     * @var array<int, string>
     */
    public const CURRENCIES = ['USD', 'IDR'];

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
     * A service says "I am free and willing to do <tags> for <price>,
     * just DM me" — so it needs a craft tag list, a price and a currency.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'min:3', 'max:120'],
            'description' => ['required', 'string', 'min:10', 'max:2000'],
            'tags' => ['required', 'array', 'min:1', 'max:5'],
            'tags.*' => ['string', 'max:30', 'distinct'],
            'price' => ['required', 'integer', 'min:0', 'max:99999999999'],
            'currency' => ['required', 'in:'.implode(',', self::CURRENCIES)],
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
     * Get the data needed to create the service.
     *
     * @return array<string, mixed>
     */
    public function serviceData(): array
    {
        return [
            'title' => $this->safe()->title,
            'description' => $this->safe()->description,
            'tags' => array_values($this->safe()->tags ?? []),
            'price' => $this->safe()->price,
            'currency' => $this->safe()->currency,
        ];
    }
}
