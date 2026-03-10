<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CreatorSearchController extends Controller
{
    public function search(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'q' => ['required', 'string', 'min:2', 'max:100'],
        ]);

        $q = trim((string) $validated['q']);

        $users = User::query()
            ->select(['id', 'full_name', 'email'])
            ->where('role', 'freelancer')
            ->where(function ($query) use ($q) {
                $query
                    ->where('email', 'like', '%'.$q.'%')
                    ->orWhere('full_name', 'like', '%'.$q.'%');
            })
            ->orderBy('full_name')
            ->limit(10)
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Creators fetched.',
            'data' => [
                'creators' => $users,
            ],
        ]);
    }
}
