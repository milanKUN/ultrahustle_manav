<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserActivityCalendar;

class UserActivityController extends Controller
{
    public function myActivity(Request $request)
    {
        $user = $request->user();

        $rows = UserActivityCalendar::where('user_id', $user->id)
            ->orderBy('year', 'asc')
            ->orderBy('month', 'asc')
            ->get(['year', 'month', 'active_days']);

        $activity_dates = [];

        foreach ($rows as $row) {
            $days = is_array($row->active_days) ? $row->active_days : [];

            foreach ($days as $day) {
                $activity_dates[] = sprintf(
                    '%04d-%02d-%02d',
                    $row->year,
                    $row->month,
                    (int) $day
                );
            }
        }

        $currentMonth = now()->month;
        $currentYear = now()->year;

        $currentMonthRow = $rows->first(function ($row) use ($currentMonth, $currentYear) {
            return (int) $row->month === (int) $currentMonth && (int) $row->year === (int) $currentYear;
        });

        return response()->json([
            'activity_dates' => $activity_dates, // for easy frontend usage
            'calendar' => $rows,                 // optional structured format
            'current_month_count' => count($currentMonthRow?->active_days ?? []),
            'current_year' => $currentYear,
            'current_month' => $currentMonth,
        ]);
    }
}
