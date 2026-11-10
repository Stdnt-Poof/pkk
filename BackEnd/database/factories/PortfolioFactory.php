<?php

namespace Database\Factories;

use App\Models\Portfolio;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Portfolio>
 */
class PortfolioFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(3),
            'kind' => 'portfolio',
            'external_url' => 'https://'.fake()->domainName().'/'.fake()->slug(2),
            'file_path' => null,
            'file_name' => null,
            'preview_path' => 'portfolios/'.fake()->lexify('preview_????????.png'),
        ];
    }

    /**
     * Indicate that the item is an uploaded CV instead of a link.
     */
    public function cv(): static
    {
        return $this->state(fn (array $attributes) => [
            'kind' => 'cv',
            'external_url' => null,
            'file_path' => 'portfolios/'.fake()->lexify('cv_????????.pdf'),
            'file_name' => 'cv.pdf',
        ]);
    }
}
