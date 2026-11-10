<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePortfolioRequest;
use App\Http\Resources\PortfolioResource;
use App\Models\Portfolio;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;

class PortfolioController extends Controller
{
    /**
     * List portfolio items — your own, or another member's when
     * `?user={username}` is passed (the read-only profile tabs).
     *
     * Note the CV files themselves stay owner-only (see file()), so a
     * viewer can browse the list but only the owner can open the PDF.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();

        if ($username = $request->query('user')) {
            $user = User::query()->where('username', $username)->firstOrFail();
        }

        return PortfolioResource::collection(
            $user->portfolios()->latest('id')->get()
        );
    }

    /**
     * Store a newly created portfolio item.
     */
    public function store(StorePortfolioRequest $request): JsonResponse
    {
        $user = $request->user();
        $portfolio = $user->portfolios()->make($request->portfolioData());

        if ($request->hasFile('file')) {
            $file = $request->file('file');

            $portfolio->file_path = $file->store('portfolios', 'local');
            $portfolio->file_name = $this->safeFileName($file->getClientOriginalName());
        }

        if ($request->hasFile('preview')) {
            $portfolio->preview_path = $request->file('preview')->store('portfolios', 'local');
        }

        $portfolio->save();

        return (new PortfolioResource($portfolio))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Stream the uploaded PDF back to its owner.
     *
     * The SPA fetches this with the bearer token and renders the bytes
     * through a blob URL, so the file never needs a public path.
     */
    public function file(Request $request, Portfolio $portfolio): BinaryFileResponse
    {
        $this->authorizeOwner($request, $portfolio);

        $path = $portfolio->file_path;

        if (! $path || ! Storage::disk('local')->exists($path)) {
            abort(Response::HTTP_NOT_FOUND, 'This portfolio item has no file.');
        }

        return response()
            ->file(Storage::disk('local')->path($path), ['Content-Type' => 'application/pdf'])
            ->setContentDisposition(ResponseHeaderBag::DISPOSITION_INLINE, $this->downloadName($portfolio));
    }

    /**
     * Stream the preview photo shown on the portfolio card.
     */
    public function preview(Portfolio $portfolio): BinaryFileResponse
    {
        $path = $portfolio->preview_path;

        if (! $path || ! Storage::disk('local')->exists($path)) {
            abort(Response::HTTP_NOT_FOUND, 'This portfolio item has no preview.');
        }

        return response()->file(Storage::disk('local')->path($path));
    }

    /**
     * Ensure the current account owns the portfolio item.
     */
    private function authorizeOwner(Request $request, Portfolio $portfolio): void
    {
        abort_unless($portfolio->user_id === $request->user()->id, Response::HTTP_FORBIDDEN);
    }

    /**
     * Build a filesystem-safe name for an uploaded file.
     */
    private function safeFileName(string $name): string
    {
        $name = trim((string) preg_replace('/[^A-Za-z0-9._ -]/', '', basename($name)));

        return $name === '' ? 'upload.pdf' : $name;
    }

    /**
     * Build a filesystem-safe download name for the PDF.
     */
    private function downloadName(Portfolio $portfolio): string
    {
        $name = $this->safeFileName((string) $portfolio->file_name);

        if (Str::endsWith(Str::lower($name), '.pdf') === false) {
            $name .= '.pdf';
        }

        return $name;
    }
}
