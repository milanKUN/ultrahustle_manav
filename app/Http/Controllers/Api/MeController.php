<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MeController extends Controller
{
    public function destroy(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        DB::transaction(function () use ($user): void {
            $user->tokens()->delete();

            $user->personalInfo()->delete();

            $user->delete();
        });

        return response()->json([
            'status' => true,
            'message' => 'Account deleted.',
            'data' => [
                'uh_user_id' => $user->uh_user_id,
            ],
        ]);
    }
}
