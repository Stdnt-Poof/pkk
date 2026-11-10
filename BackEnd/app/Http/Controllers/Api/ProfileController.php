<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Resources\PublicProfileResource;
use App\Http\Resources\PublicUserResource;
use App\Http\Resources\UserResource;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ProfileController extends Controller
{
    /**
     * The edge length the stored profile picture is normalized to.
     */
    private const AVATAR_SIZE = 512;

    /**
     * The width background images are scaled down to.
     */
    private const COVER_WIDTH = 1920;

    /**
     * How many members the home search bar offers.
     */
    private const SEARCH_LIMIT = 8;

    /**
     * The full public profile of any member, by username.
     *
     * Backs /Profile/:username from search results and feed authors.
     * Deliberately email- and role-free — it renders for members who are
     * not the profile owner.
     */
    public function profile(string $username): PublicProfileResource
    {
        $user = User::query()->where('username', $username)->firstOrFail();

        return new PublicProfileResource($user);
    }

    /**
     * Typeahead search over other members' usernames.
     *
     * The home bar searches people, never yourself — you already know who
     * you are. Empty terms return nothing so the dropdown collapses.
     */
    public function search(Request $request): AnonymousResourceCollection
    {
        $term = trim((string) $request->query('q', ''));

        if ($term === '') {
            return PublicUserResource::collection(collect());
        }

        $members = User::query()
            ->where('id', '!=', $request->user()->id)
            ->where('username', 'like', '%'.$term.'%')
            ->orderBy('username')
            ->take(self::SEARCH_LIMIT)
            ->get();

        return PublicUserResource::collection($members);
    }

    /**
     * Show the public profile card of any member.
     *
     * The Messages page needs it to open a chat that has no messages yet
     * (a DM started straight from a Hire service card).
     */
    public function show(User $user): PublicUserResource
    {
        return new PublicUserResource($user);
    }

    /**
     * Report a member for the admin queue.
     *
     * The mirror image of flagging a post: one open flag per member per
     * reported account (the unique pair), so repeating the call is a
     * no-op, and dismissing from the dashboard frees the reporter to
     * flag again. The reason is a preset from the shared overlay or the
     * reporter's own typed text (both under 100 characters).
     */
    public function report(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'reason' => ['required', 'string', 'min:2', 'max:100'],
        ]);

        abort_if($user->id === $request->user()->id, 422, 'You cannot report yourself.');

        Report::query()->firstOrCreate(
            [
                'reported_user_id' => $user->id,
                'reporter_id' => $request->user()->id,
            ],
            ['reason' => $validated['reason']],
        );

        return response()->json(['data' => ['reported' => true]]);
    }

    /**
     * Follow or unfollow a member.
     *
     * The same contract as the like toggles: one row per follower pair,
     * so repeating the call flips the state, and self-following is
     * rejected. The response carries the fresh state and the target's
     * follower count so the button and the stats update in place.
     */
    public function toggleFollow(Request $request, User $user): JsonResponse
    {
        $me = $request->user();

        abort_if($user->id === $me->id, 422, 'You cannot follow yourself.');

        $result = $me->following()->toggle($user->id);

        return response()->json([
            'data' => [
                'following' => count($result['attached']) > 0,
                'followers_count' => $user->followers()->count(),
            ],
        ]);
    }

    /**
     * The members following a profile — the list behind the Followers
     * stat on the own and member profile headers.
     */
    public function followers(User $user): AnonymousResourceCollection
    {
        return PublicUserResource::collection(
            $user->followers()->orderBy('username')->get()
        );
    }

    /**
     * The members a profile follows — the list behind the Following stat.
     */
    public function following(User $user): AnonymousResourceCollection
    {
        return PublicUserResource::collection(
            $user->following()->orderBy('username')->get()
        );
    }

    /**
     * Update the current account's profile fields and media.
     *
     * Uploading a new file replaces the stored one; the remove flags delete
     * it so the frontend falls back to its defaults.
     */
    public function update(UpdateProfileRequest $request): UserResource
    {
        $user = $request->user();

        if ($request->has('bio')) {
            $user->bio = $request->validated('bio');
        }

        if ($request->hasFile('avatar')) {
            $this->discard($user->avatar_path);
            $user->avatar_path = $this->storeAvatar($request->file('avatar'));
        } elseif ($request->boolean('remove_avatar')) {
            $this->discard($user->avatar_path);
            $user->avatar_path = null;
        }

        if ($request->hasFile('cover')) {
            $this->discard($user->cover_path);
            $user->cover_path = $this->storeCover($request->file('cover'));
        } elseif ($request->boolean('remove_cover')) {
            $this->discard($user->cover_path);
            $user->cover_path = null;
        }

        $user->save();

        return new UserResource($user);
    }

    /**
     * Stream the account's profile picture.
     */
    public function avatar(User $user): BinaryFileResponse
    {
        $path = $user->avatar_path;

        abort_unless($path && Storage::disk('local')->exists($path), 404);

        return response()->file(Storage::disk('local')->path($path));
    }

    /**
     * Stream the account's background image or video.
     */
    public function cover(User $user): BinaryFileResponse
    {
        $path = $user->cover_path;

        abort_unless($path && Storage::disk('local')->exists($path), 404);

        return response()->file(Storage::disk('local')->path($path));
    }

    /**
     * Crop the upload to a square, normalize it and store it as the avatar.
     */
    private function storeAvatar(UploadedFile $file): string
    {
        $image = $this->openImage($file);
        $size = min(imagesx($image), imagesy($image));

        $square = $this->newCanvas(self::AVATAR_SIZE, self::AVATAR_SIZE);
        imagecopyresampled(
            $square,
            $image,
            0,
            0,
            (int) (($size === imagesx($image) ? 0 : (imagesx($image) - $size) / 2)),
            (int) (($size === imagesy($image) ? 0 : (imagesy($image) - $size) / 2)),
            self::AVATAR_SIZE,
            self::AVATAR_SIZE,
            $size,
            $size,
        );

        imagedestroy($image);

        return $this->saveImage($square, (string) $file->getMimeType(), 'avatars');
    }

    /**
     * Store the background: videos untouched, images scaled down.
     */
    private function storeCover(UploadedFile $file): string
    {
        $mime = (string) $file->getMimeType();

        if (Str::startsWith($mime, 'video/')) {
            $extension = $mime === 'video/webm' ? 'webm' : 'mp4';
            $name = Str::uuid().'.'.$extension;

            $file->storeAs('covers', $name, 'local');

            return 'covers/'.$name;
        }

        $image = $this->openImage($file);
        $width = imagesx($image);
        $height = imagesy($image);

        if ($width > self::COVER_WIDTH) {
            $scaledHeight = (int) round($height * self::COVER_WIDTH / $width);
            $scaled = $this->newCanvas(self::COVER_WIDTH, $scaledHeight);

            imagecopyresampled($scaled, $image, 0, 0, 0, 0, self::COVER_WIDTH, $scaledHeight, $width, $height);

            imagedestroy($image);
            $image = $scaled;
        }

        return $this->saveImage($image, $mime, 'covers');
    }

    /**
     * Decode an upload, applying the EXIF rotation phones bake in.
     */
    private function openImage(UploadedFile $file): \GdImage
    {
        $mime = (string) $file->getMimeType();

        $image = match ($mime) {
            'image/png' => imagecreatefrompng($file->getRealPath()),
            'image/webp' => imagecreatefromwebp($file->getRealPath()),
            default => imagecreatefromjpeg($file->getRealPath()),
        };

        abort_unless($image instanceof \GdImage, 422, 'The image could not be processed.');

        if ($mime === 'image/jpeg' && function_exists('exif_read_data')) {
            $orientation = (int) (@exif_read_data($file->getRealPath())['Orientation'] ?? 1);
            $degrees = match ($orientation) {
                3 => 180, 6 => -90, 8 => 90, default => 0
            };

            if ($degrees !== 0) {
                $rotated = imagerotate($image, $degrees, 0);

                if ($rotated instanceof \GdImage) {
                    imagedestroy($image);
                    $image = $rotated;
                }
            }
        }

        imagealphablending($image, false);
        imagesavealpha($image, true);

        return $image;
    }

    /**
     * Create a transparent truecolor canvas.
     */
    private function newCanvas(int $width, int $height): \GdImage
    {
        $canvas = imagecreatetruecolor($width, $height);

        imagealphablending($canvas, false);
        imagesavealpha($canvas, true);

        $transparent = imagecolorallocatealpha($canvas, 0, 0, 0, 127);
        imagefilledrectangle($canvas, 0, 0, $width - 1, $height - 1, $transparent);

        return $canvas;
    }

    /**
     * Encode the image in its source format and store it on disk.
     */
    private function saveImage(\GdImage $image, string $mime, string $directory): string
    {
        $extension = match ($mime) {
            'image/png' => 'png',
            'image/webp' => 'webp',
            default => 'jpg',
        };

        ob_start();

        match ($extension) {
            'png' => imagepng($image, null, 85),
            'webp' => imagewebp($image, null, 88),
            default => imagejpeg($image, null, 88),
        };

        $binary = (string) ob_get_clean();

        imagedestroy($image);

        $path = $directory.'/'.Str::uuid().'.'.$extension;

        Storage::disk('local')->put($path, $binary);

        return $path;
    }

    /**
     * Remove a replaced or deleted media file from disk.
     */
    private function discard(?string $path): void
    {
        if ($path && Storage::disk('local')->exists($path)) {
            Storage::disk('local')->delete($path);
        }
    }
}
