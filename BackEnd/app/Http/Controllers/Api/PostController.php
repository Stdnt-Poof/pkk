<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCommentRequest;
use App\Http\Requests\StorePostRequest;
use App\Http\Resources\CommentResource;
use App\Http\Resources\PostResource;
use App\Models\Comment;
use App\Models\Post;
use App\Models\PostImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class PostController extends Controller
{
    /**
     * The feed page size (a profile tab and the home feed share it).
     */
    private const FEED_SIZE = 100;

    /**
     * The home feed — every member's posts, newest first.
     *
     * Pass `?user={username}` to scope the feed to one member's profile
     * tab. Per-viewer flags (liked/saved/flagged) come along as booleans so
     * the frontend can render the interactive state in a single round trip.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();

        $query = Post::query()
            ->with('user:id,username,avatar_path,rating,rating_count')
            ->with('images')
            ->withCount('likes')
            ->withExists(['likes as liked' => fn ($q) => $q->where('user_id', $user->id)])
            ->withExists(['saves as saved' => fn ($q) => $q->where('user_id', $user->id)])
            ->withExists(['reports as flagged' => fn ($q) => $q->where('reporter_id', $user->id)])
            ->with([
                'comments' => fn ($q) => $q
                    ->with('user:id,username,avatar_path,rating,rating_count')
                    ->withCount('likes')
                    ->withExists(['likes as liked' => fn ($l) => $l->where('user_id', $user->id)])
                    ->orderBy('id'),
            ])
            ->orderByDesc('id')
            ->take(self::FEED_SIZE);

        if ($username = $request->query('user')) {
            $query->whereHas('user', fn ($q) => $q->where('username', $username));
        }

        return PostResource::collection($query->get());
    }

    /**
     * Publish a new post to the feed.
     *
     * Text and pictures are optional in any combination (at least one of
     * the two), and the pictures land on disk with their paths recorded
     * on the post.
     */
    public function store(StorePostRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $images = $validated['images'] ?? [];
        unset($validated['images']);

        $validated['body'] = $validated['body'] ?? '';

        $post = $request->user()->posts()->make($validated);
        $post->save();

        foreach ($images as $file) {
            $post->images()->create(['path' => $file->store('posts', 'local')]);
        }

        $post->loadCount('likes');

        return (new PostResource($post->load('user')->load('comments')->load('images')))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Stream a post picture back to the feed.
     *
     * Public by design: <img> cannot carry a bearer token, and post
     * pictures are not private data — same rule as profile media.
     */
    public function image(Post $post, PostImage $image): BinaryFileResponse
    {
        abort_unless($image->post_id === $post->id, Response::HTTP_NOT_FOUND);

        $path = $image->path;

        abort_unless($path && Storage::disk('local')->exists($path), Response::HTTP_NOT_FOUND);

        return response()->file(Storage::disk('local')->path($path));
    }

    /**
     * Like or unlike a post.
     */
    public function toggleLike(Request $request, Post $post): JsonResponse
    {
        $like = $post->likes()->where('user_id', $request->user()->id)->first();

        if ($like) {
            $like->delete();
            $liked = false;
        } else {
            $post->likes()->create(['user_id' => $request->user()->id]);
            $liked = true;
        }

        return response()->json([
            'data' => ['liked' => $liked, 'likes' => $post->likes()->count()],
        ]);
    }

    /**
     * Save or unsave a post.
     */
    public function toggleSave(Request $request, Post $post): JsonResponse
    {
        $save = $post->saves()->where('user_id', $request->user()->id)->first();

        if ($save) {
            $save->delete();
            $saved = false;
        } else {
            $post->saves()->create(['user_id' => $request->user()->id]);
            $saved = true;
        }

        return response()->json(['data' => ['saved' => $saved]]);
    }

    /**
     * Flag a post for the admin queue.
     *
     * One open flag per member per post (the unique pair), so repeating
     * the call is a no-op: admins dismiss from the dashboard, and once
     * dismissed the member may flag again. The reason is a preset from
     * the overlay or the member's own typed text (both under 100 chars).
     */
    public function report(Request $request, Post $post): JsonResponse
    {
        $validated = $request->validate([
            'reason' => ['required', 'string', 'min:2', 'max:100'],
        ]);

        abort_if($post->user_id === $request->user()->id, 422, 'You cannot flag your own post.');

        $flag = $post->reports()->where('reporter_id', $request->user()->id)->first();

        if (! $flag) {
            $post->reports()->create([
                'reporter_id' => $request->user()->id,
                'reason' => $validated['reason'],
            ]);
        }

        return response()->json(['data' => ['flagged' => true]]);
    }

    /**
     * Comment on a post.
     */
    public function storeComment(StoreCommentRequest $request, Post $post): JsonResponse
    {
        $comment = $post->comments()->make($request->validated());
        $comment->user_id = $request->user()->id;
        $comment->save();

        $comment->loadCount('likes');

        return (new CommentResource($comment->load('user')))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Delete a post — the author's own, or any member's as an admin.
     *
     * Comments, likes, saves and flags cascade away with the row, and
     * the picture files are pulled off disk (the rows cascade too).
     */
    public function destroy(Request $request, Post $post): Response
    {
        $user = $request->user();

        abort_unless($post->user_id === $user->id || $user->isAdmin(), 403);

        self::discardImages($post);

        $post->delete();

        return response()->noContent();
    }

    /**
     * Like or unlike a comment.
     */
    public function toggleCommentLike(Request $request, Comment $comment): JsonResponse
    {
        $like = $comment->likes()->where('user_id', $request->user()->id)->first();

        if ($like) {
            $like->delete();
            $liked = false;
        } else {
            $comment->likes()->create(['user_id' => $request->user()->id]);
            $liked = true;
        }

        return response()->json([
            'data' => ['liked' => $liked, 'likes' => $comment->likes()->count()],
        ]);
    }

    /**
     * Remove a post's picture files from disk before the row goes.
     *
     * The post_images rows cascade with the post; the bytes do not.
     * Shared with the admin delete via the same public helper so both
     * paths leave no orphans.
     */
    public static function discardImages(Post $post): void
    {
        foreach ($post->images as $image) {
            $path = $image->path;

            if ($path && Storage::disk('local')->exists($path)) {
                Storage::disk('local')->delete($path);
            }
        }
    }
}
