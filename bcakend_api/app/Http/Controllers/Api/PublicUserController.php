<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\PortfolioProject;
use App\Models\PortfolioMedia;
use Illuminate\Http\JsonResponse;

class PublicUserController extends Controller
{
    public function profile(string $username): JsonResponse
    {
        $user = User::with('personalInfo')
            ->whereRaw('LOWER(username) = ?', [strtolower($username)])
            ->firstOrFail();

        $info = $user->personalInfo;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'full_name' => $user->full_name,
                'display_name' => $user->full_name,
                'created_at' => $user->created_at,

                'title' => $info?->title,
                'bio' => $info?->bio,
                'short_bio' => $info?->short_bio,
                'about' => $info?->about,
                'availability' => $info?->availability,

                'country' => $info?->country,
                'state' => $info?->state,
                'city' => $info?->city,

                'avatar_url' => $info?->avatar_url,
                'avatar' => $info?->avatar_url,

                'hashtags' => is_array($info?->hashtags)
                    ? $info->hashtags
                    : (json_decode($info?->hashtags ?? '[]', true) ?: []),

                'skills' => is_array($info?->skills)
                    ? $info->skills
                    : (json_decode($info?->skills ?? '[]', true) ?: []),

                'tools' => is_array($info?->tools)
                    ? $info->tools
                    : (json_decode($info?->tools ?? '[]', true) ?: []),

                'languages' => is_array($info?->languages)
                    ? $info->languages
                    : (json_decode($info?->languages ?? '[]', true) ?: []),

                'badges' => [],
                'karma' => 0,
                'average_rating' => 0,
            ],
        ]);
    }

    public function portfolio(string $username): JsonResponse
    {
        $user = User::whereRaw('LOWER(username) = ?', [strtolower($username)])
            ->firstOrFail();

        $projects = PortfolioProject::where('owner_type', 'user')
            ->where('owner_id', $user->id)
            ->orderBy('sort_order')
            ->get()
            ->map(function ($project) {
                return [
                    'id' => $project->id,
                    'title' => $project->title,
                    'description' => $project->description,
                    'cover_media' => $project->cover_media,
                    'media' => $project->media,
                ];
            });

        return response()->json([
            'projects' => $projects,
        ]);
    }

    public function followCounts(string $username): JsonResponse
    {
        $user = User::whereRaw('LOWER(username) = ?', [strtolower($username)])
            ->firstOrFail();

        return response()->json([
            'followers' => $user->followers()->count(),
            'following' => $user->following()->count(),
        ]);
    }
}