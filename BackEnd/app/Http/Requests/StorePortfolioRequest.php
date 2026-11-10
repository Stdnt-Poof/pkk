<?php

namespace App\Http\Requests;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePortfolioRequest extends FormRequest
{
    /**
     * The portfolio item kinds the application supports.
     *
     * @var array<int, string>
     */
    public const KINDS = ['portfolio', 'cv', 'project'];

    /**
     * The hosts a project link may point at.
     *
     * @var array<int, string>
     */
    public const PROJECT_HOSTS = ['github.com', 'www.github.com', 'gitlab.com', 'www.gitlab.com'];

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
     * A portfolio item is an https link, an uploaded PDF (CV) or a
     * GitHub/GitLab repository link. The preview photo is required for
     * portfolio links — CVs and projects fall back to a default image.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'min:3', 'max:120'],
            'kind' => ['required', 'in:'.implode(',', self::KINDS)],
            'external_url' => [
                'required_unless:kind,cv',
                'nullable',
                'url:https',
                'max:500',
                $this->projectLinkRule(),
            ],
            'file' => ['required_if:kind,cv', 'nullable', 'file', 'mimes:pdf', 'max:10240'],
            'preview' => ['required_if:kind,portfolio', 'nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
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
            'external_url' => 'portfolio link',
            'file' => 'CV file',
            'preview' => 'preview photo',
        ];
    }

    /**
     * Get the data needed to create the portfolio item.
     *
     * @return array<string, mixed>
     */
    public function portfolioData(): array
    {
        return [
            'title' => $this->safe()->title,
            'kind' => $this->safe()->kind,
            'external_url' => $this->safe()->kind === 'cv' ? null : $this->safe()->external_url,
        ];
    }

    /**
     * Restrict project links to a GitHub or GitLab repository.
     */
    private function projectLinkRule(): Closure
    {
        return function (string $attribute, mixed $value, Closure $fail): void {
            if ($this->input('kind') !== 'project' || ! is_string($value)) {
                return;
            }

            $host = strtolower((string) parse_url($value, PHP_URL_HOST));
            $path = trim((string) parse_url($value, PHP_URL_PATH), '/');

            if (! in_array($host, self::PROJECT_HOSTS, true) || $path === '') {
                $fail('The project link must point to a GitHub or GitLab repository.');
            }
        };
    }
}
