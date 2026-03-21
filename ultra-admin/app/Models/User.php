<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'uh_user_id',
        'full_name',
        'username',
        'email',
        'password',
        'role',
        'provider',
        'provider_id',
        'agreed_to_terms',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function freelancerOnboarding()
    {
        return $this->hasOne(
            \App\Models\UhFreelancerOnboarding::class,
            'uh_user_id',   // foreign key on onboarding table
            'uh_user_id'    // local key on users table
        );
    }

    public function clientOnboarding()
    {
        return $this->hasOne(
            \App\Models\UhClientOnboarding::class,
            'uh_user_id',   // foreign key on onboarding table
            'uh_user_id'    // local key on users table
        );
    }

    public function followers()
    {
        return $this->belongsToMany(
            self::class,
            'user_follows',
            'following_id',
            'follower_id'
        )->withTimestamps();
    }

    public function following()
    {
        return $this->belongsToMany(
            self::class,
            'user_follows',
            'follower_id',
            'following_id'
        )->withTimestamps();
    }
    public function userNotification()
    {
        return $this->hasOne(UserNotification::class);
    }

    public function personalInfo()
    {
        return $this->hasOne(UserPersonalInfo::class, 'uh_user_id', 'uh_user_id');
    }
}
