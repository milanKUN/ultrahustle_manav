<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Me\UploadPortfolioMediaRequest;
use App\Models\PortfolioMedia;
use App\Models\PortfolioProject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class MePortfolioMediaController extends Controller
{
	public function store(UploadPortfolioMediaRequest $request, int $projectId): JsonResponse
	{
		$user = $request->user();
		if (! $user) {
			return response()->json(['message' => 'Unauthenticated.'], 401);
		}

		$project = PortfolioProject::query()
			->whereKey($projectId)
			->whereHas('portfolio', fn ($q) => $q->where('user_id', $user->id))
			->withCount('media')
			->first();

		if (! $project) {
			return response()->json(['message' => 'Not found.'], 404);
		}

		/** @var list<UploadedFile> $files */
		$files = $request->file('files', []);
		$incomingCount = count($files);
		$maxAllowed = 9;
		if ($project->media_count + $incomingCount > $maxAllowed) {
			return response()->json([
				'errors' => [
					'files' => ["Maximum {$maxAllowed} media items allowed per project."],
				],
			], 422);
		}

		$coverIndex = $request->input('cover_index');
		if ($coverIndex !== null && ((int) $coverIndex < 0 || (int) $coverIndex >= $incomingCount)) {
			return response()->json([
				'errors' => [
					'cover_index' => ['The selected cover_index is invalid.'],
				],
			], 422);
		}

		$sortOrders = $request->input('sort_orders', []);
		if (! is_array($sortOrders)) {
			$sortOrders = [];
		}

		$disk = 'public';
		$baseSort = (int) PortfolioMedia::query()->where('project_id', $project->id)->max('sort_order');
		$baseSort = max(0, $baseSort);

		$newMedia = [];
		DB::transaction(function () use ($files, $disk, $project, $baseSort, $sortOrders, &$newMedia): void {
			foreach ($files as $i => $file) {
				$path = $file->storePublicly("portfolio/{$project->portfolio_id}/{$project->id}", $disk);
				$mime = $file->getClientMimeType();
				$type = (is_string($mime) && str_starts_with($mime, 'video/')) ? 'video' : 'image';
				$sortOrder = array_key_exists($i, $sortOrders) ? (int) $sortOrders[$i] : ($baseSort + $i + 1);

				$media = PortfolioMedia::create([
					'project_id' => $project->id,
					'type' => $type,
					'disk' => $disk,
					'path' => $path,
					'url' => null,
					'mime' => $mime,
					'size_bytes' => $file->getSize(),
					'is_cover' => false,
					'sort_order' => max(0, $sortOrder),
				]);

				$newMedia[] = $media;
			}
		});

		if ($coverIndex !== null) {
			$coverMedia = $newMedia[(int) $coverIndex] ?? null;
			if ($coverMedia) {
				PortfolioMedia::query()->where('project_id', $project->id)->update(['is_cover' => false]);
				$coverMedia->forceFill(['is_cover' => true])->save();
				$project->forceFill(['cover_media_id' => $coverMedia->id])->save();
			}
		}

		return response()->json([
			'message' => 'Media uploaded.',
			'media' => collect($newMedia)->map(function (PortfolioMedia $media): array {
				return [
					'id' => $media->id,
					'project_id' => $media->project_id,
					'type' => $media->type,
					'disk' => $media->disk,
					'path' => $media->path,
					'url' => Storage::disk($media->disk)->url($media->path),
					'mime' => $media->mime,
					'size_bytes' => $media->size_bytes,
					'is_cover' => (bool) $media->is_cover,
					'sort_order' => $media->sort_order,
					'created_at' => $media->created_at,
					'updated_at' => $media->updated_at,
				];
			})->values()->all(),
		]);
	}

	public function destroy(int $mediaId): JsonResponse
	{
		$user = request()->user();
		if (! $user) {
			return response()->json(['message' => 'Unauthenticated.'], 401);
		}

		$media = PortfolioMedia::query()
			->whereKey($mediaId)
			->whereHas('project.portfolio', fn ($q) => $q->where('user_id', $user->id))
			->first();

		if (! $media) {
			return response()->json(['message' => 'Not found.'], 404);
		}

		$project = $media->project;
		if ($media->disk && $media->path) {
			Storage::disk($media->disk)->delete($media->path);
		}

		$media->delete();

		if ($project && $project->cover_media_id === $mediaId) {
			$project->forceFill(['cover_media_id' => null])->save();
		}

		return response()->json([
			'message' => 'Media deleted.',
		]);
	}
}
