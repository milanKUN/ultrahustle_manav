<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserActivityCalendar extends Model
{
    protected $fillable = [
        'user_id',
        'year',
        'month',
        'active_days',
    ];

    protected $casts = [
        'active_days' => 'array',
    ];
}
