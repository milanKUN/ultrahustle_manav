<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserActivityCalendar;
use Carbon\Carbon;

class UserActivityService
{
    public static function markLogin(User $user, ?Carbon $date = null): void
    {
        $date = $date ?: now();

        $day = (int) $date->day;
        $month = (int) $date->month;
        $year = (int) $date->year;

        $activity = UserActivityCalendar::firstOrCreate(
            [
                'user_id' => $user->id,
                'year' => $year,
                'month' => $month,
            ],
            [
                'active_days' => [],
            ]
        );

        $days = $activity->active_days ?? [];

        if (!in_array($day, $days)) {
            $days[] = $day;
            sort($days);

            $activity->active_days = array_values(array_unique($days));
            $activity->save();
        }

        $user->forceFill([
            'last_login_at' => now(),
        ])->save();
    }
}