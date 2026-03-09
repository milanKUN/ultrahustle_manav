<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected static function booted(): void
    {
        static::creating(function (self $user): void {
            if (empty($user->uh_user_id)) {
                $user->uh_user_id = self::generateUniqueUhUserId();
            }
        });
    }

    public static function generateUniqueUhUserId(): string
    {
        $date = now()->format('Ymd');

        for ($attempt = 0; $attempt < 20; $attempt++) {
            $random = str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT);
            $candidate = "uh-{$random}-{$date}";

            if (! self::where('uh_user_id', $candidate)->exists()) {
                return $candidate;
            }
        }

        throw new \RuntimeException('Unable to generate a unique uh_user_id.');
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'uh_user_id',
        'full_name',
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
            'agreed_to_terms' => 'boolean',
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function personalInfo()
    {
        return $this->hasOne(UserPersonalInfo::class, 'uh_user_id', 'uh_user_id');
    }

    public function portfolio()
    {
        return $this->hasOne(Portfolio::class);
    }
}
