<?php

namespace Tests\Feature;

use App\Models\Portfolio;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PortfolioTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('local');
    }

    public function test_listing_a_portfolio_needs_a_logged_in_account(): void
    {
        $this->getJson('/api/portfolios')->assertUnauthorized();
    }

    public function test_a_user_only_sees_their_own_portfolio_items(): void
    {
        Portfolio::factory()->for(User::factory())->create();

        $token = User::factory()->create()->createToken('auth')->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/portfolios')
            ->assertOk()
            ->assertJsonCount(0, 'data');
    }

    public function test_a_user_can_add_a_portfolio_link_with_a_preview_photo(): void
    {
        $token = User::factory()->create()->createToken('auth')->plainTextToken;

        $response = $this->withToken($token)->post('/api/portfolios', [
            'title' => 'SaaS landing page',
            'kind' => 'portfolio',
            'external_url' => 'https://example.com/saas-landing',
            'preview' => UploadedFile::fake()->image('preview.jpg', 400, 300),
        ], ['Accept' => 'application/json']);

        $response->assertCreated()
            ->assertJsonPath('data.title', 'SaaS landing page')
            ->assertJsonPath('data.kind', 'portfolio')
            ->assertJsonPath('data.external_url', 'https://example.com/saas-landing')
            ->assertJsonPath('data.file_url', null)
            ->assertJsonPath('data.preview_url', route('portfolios.preview', $response->json('data.id')));

        $this->assertDatabaseHas('portfolios', [
            'title' => 'SaaS landing page',
            'kind' => 'portfolio',
            'external_url' => 'https://example.com/saas-landing',
        ]);

        Storage::disk('local')->assertExists(Portfolio::first()->preview_path);
    }

    public function test_a_portfolio_link_requires_a_preview_photo(): void
    {
        $token = User::factory()->create()->createToken('auth')->plainTextToken;

        $this->withToken($token)
            ->postJson('/api/portfolios', [
                'title' => 'Coffee shop brand kit',
                'kind' => 'portfolio',
                'external_url' => 'https://example.com/coffee-brand-kit',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['preview']);

        $this->assertDatabaseCount('portfolios', 0);
    }

    public function test_a_portfolio_link_must_use_https(): void
    {
        $token = User::factory()->create()->createToken('auth')->plainTextToken;

        $this->withToken($token)
            ->postJson('/api/portfolios', [
                'title' => 'Motion reel',
                'kind' => 'portfolio',
                'external_url' => 'http://example.com/motion-reel',
                'preview' => UploadedFile::fake()->image('preview.png'),
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['external_url']);
    }

    public function test_a_user_can_upload_a_cv_without_picking_a_preview_photo(): void
    {
        $token = User::factory()->create()->createToken('auth')->plainTextToken;

        $this->withToken($token)
            ->post('/api/portfolios', [
                'title' => 'My CV',
                'kind' => 'cv',
                'file' => UploadedFile::fake()->create('my-cv.pdf', 64, 'application/pdf'),
            ], ['Accept' => 'application/json'])
            ->assertCreated()
            ->assertJsonPath('data.kind', 'cv')
            ->assertJsonPath('data.file_name', 'my-cv.pdf')
            ->assertJsonPath('data.preview_url', url('/img/default-cv.png'))
            ->assertJsonPath('data.file_url', route('portfolios.file', Portfolio::first()));

        Storage::disk('local')->assertExists(Portfolio::first()->file_path);
    }

    public function test_uploading_a_cv_requires_a_pdf_file(): void
    {
        $token = User::factory()->create()->createToken('auth')->plainTextToken;

        $this->withToken($token)
            ->postJson('/api/portfolios', [
                'title' => 'My CV',
                'kind' => 'cv',
                'file' => UploadedFile::fake()->create('notes.txt', 8, 'text/plain'),
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['file']);
    }

    public function test_a_cv_cannot_be_uploaded_without_a_file(): void
    {
        $token = User::factory()->create()->createToken('auth')->plainTextToken;

        $this->withToken($token)
            ->postJson('/api/portfolios', [
                'title' => 'My CV',
                'kind' => 'cv',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['file']);
    }

    public function test_a_project_can_link_a_github_repository(): void
    {
        $token = User::factory()->create()->createToken('auth')->plainTextToken;

        $this->withToken($token)
            ->postJson('/api/portfolios', [
                'title' => 'Hello world repo',
                'kind' => 'project',
                'external_url' => 'https://github.com/octocat/hello-world',
            ])
            ->assertCreated()
            ->assertJsonPath('data.kind', 'project')
            ->assertJsonPath('data.external_url', 'https://github.com/octocat/hello-world')
            ->assertJsonPath('data.file_url', null)
            ->assertJsonPath('data.preview_url', null);
    }

    public function test_a_project_can_link_a_gitlab_repository(): void
    {
        $token = User::factory()->create()->createToken('auth')->plainTextToken;

        $this->withToken($token)
            ->postJson('/api/portfolios', [
                'title' => 'GitLab project',
                'kind' => 'project',
                'external_url' => 'https://gitlab.com/group/project',
                'preview' => UploadedFile::fake()->image('preview.png'),
            ])
            ->assertCreated()
            ->assertJsonPath('data.kind', 'project')
            ->assertJsonPath('data.preview_url', route('portfolios.preview', 1));
    }

    public function test_a_project_rejects_any_other_host(): void
    {
        $token = User::factory()->create()->createToken('auth')->plainTextToken;

        $this->withToken($token)
            ->postJson('/api/portfolios', [
                'title' => 'Not a repo',
                'kind' => 'project',
                'external_url' => 'https://example.com/not-a-repo',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['external_url']);
    }

    public function test_a_project_link_must_point_at_a_repository_path(): void
    {
        $token = User::factory()->create()->createToken('auth')->plainTextToken;

        $this->withToken($token)
            ->postJson('/api/portfolios', [
                'title' => 'Bare host',
                'kind' => 'project',
                'external_url' => 'https://github.com',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['external_url']);
    }

    public function test_a_project_requires_a_link(): void
    {
        $token = User::factory()->create()->createToken('auth')->plainTextToken;

        $this->withToken($token)
            ->postJson('/api/portfolios', [
                'title' => 'No link yet',
                'kind' => 'project',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['external_url']);
    }

    public function test_a_user_can_stream_their_own_cv(): void
    {
        $token = User::factory()->create()->createToken('auth')->plainTextToken;

        $portfolioId = $this->withToken($token)
            ->post('/api/portfolios', [
                'title' => 'My CV',
                'kind' => 'cv',
                'file' => UploadedFile::fake()->create('my-cv.pdf', 64, 'application/pdf'),
            ], ['Accept' => 'application/json'])
            ->assertCreated()
            ->json('data.id');

        $this->withToken($token)
            ->get("/api/portfolios/{$portfolioId}/file")
            ->assertOk()
            ->assertHeader('content-type', 'application/pdf')
            ->assertHeader('content-disposition', 'inline; filename=my-cv.pdf');
    }

    public function test_a_user_cannot_stream_another_users_cv(): void
    {
        $portfolio = Portfolio::factory()->cv()->create();

        $token = User::factory()->create()->createToken('auth')->plainTextToken;

        $this->withToken($token)
            ->get("/api/portfolios/{$portfolio->id}/file")
            ->assertForbidden();
    }

    public function test_streaming_a_cv_needs_a_logged_in_account(): void
    {
        $portfolio = Portfolio::factory()->cv()->create();

        $this->getJson("/api/portfolios/{$portfolio->id}/file")->assertUnauthorized();
    }

    public function test_a_preview_photo_is_served_without_a_token(): void
    {
        $portfolio = Portfolio::factory()->create([
            'preview_path' => UploadedFile::fake()->image('preview.png')->store('portfolios', 'local'),
        ]);

        $this->get("/api/portfolios/{$portfolio->id}/preview")
            ->assertOk()
            ->assertHeader('content-type', 'image/png');
    }
}
