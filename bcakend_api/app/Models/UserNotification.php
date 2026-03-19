<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserNotification extends Model
{
    protected $table = 'user_notification';
    protected $fillable = [
        'user_id',
        'messages','order','reviews','payment','boost','listing','system',
        'project','comments','forum','team',
        'marketing','product'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
