<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Team extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'owner_user_id',
        'name',
        'username',
        'title',
        'bio',
        'about',
        'what_we_do',
        'category',
        'availability',
        'terms',
        'hashtags',
        'skills',
        'tools',
        'languages',
        'rules',
        'avatar_path',
        'avatar_filename',
        'avatar_mime',
        'avatar_size',
        'avatar_updated_at',
    ];

    protected function casts(): array
    {
        return [
            'hashtags' => 'array',
            'skills' => 'array',
            'tools' => 'array',
            'languages' => 'array',
            'rules' => 'array',

            'avatar_updated_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_user_id');
    }

    public function memberships(): HasMany
    {
        return $this->hasMany(TeamMembership::class, 'team_id');
    }

    public function invitations(): HasMany
    {
        return $this->hasMany(TeamInvitation::class, 'team_id');
    }

    
}
