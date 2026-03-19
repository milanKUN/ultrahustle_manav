<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserNotification;

class MeNotificationController extends Controller
{
    public function update(Request $request)
    {
        $user = auth()->user();

        $data = $request->only([
            'messages','order','reviews','payment','boost','listing','system',
            'project','comments','forum','team',
            'marketing','product'
        ]);

        $settings = UserNotification::updateOrCreate(
            ['user_id' => $user->id],
            $data
        );

        return response()->json([
            'message' => 'Settings saved successfully',
            'data' => $settings
        ]);
    }

    public function get()
    {
        $user = auth()->user();

        $settings = UserNotification::firstOrCreate(
            ['user_id' => $user->id]
        );

        return response()->json($settings);
    }
}
