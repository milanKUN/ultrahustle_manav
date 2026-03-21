<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserPersonalInfo extends Model
{
    use SoftDeletes;

    protected $table = 'user_personal_info';

    protected $primaryKey = 'uh_user_id';

    public $incrementing = false;

    protected $keyType = 'string';

    /** @var list<string> */
    protected $fillable = [
        'uh_user_id',
        'first_name',
        'last_name',
        'username',
        'date_of_birth',
        'contact_email',
        'phone_country',
        'phone_country_code',
        'phone_number',
        'gender',
        'street',
        'city',
        'state',
        'country',
        'pincode',
        'title',
        'short_bio',
        'about',
        'availability',
        'hashtags',
        'skills',
        'tools',
        'languages',

        'avatar_filename',
        'avatar_path',
        'avatar_mime',
        'avatar_size',
        'avatar_updated_at',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date:Y-m-d',
            'hashtags' => 'array',
            'skills' => 'array',
            'tools' => 'array',
            'languages' => 'array',
            'avatar_size' => 'integer',
            'avatar_updated_at' => 'datetime',
        ];
    }

    public function getAvatarUrlAttribute(): ?string
    {
        if (! $this->avatar_path) {
            return null;
        }

        return url('/storage/'.ltrim($this->avatar_path, '/'));
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'uh_user_id', 'uh_user_id');
    }
}
