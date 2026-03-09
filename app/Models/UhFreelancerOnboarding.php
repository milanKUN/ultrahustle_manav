<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UhFreelancerOnboarding extends Model
{
    use HasFactory;

    protected $table = 'uh_freelancer_onboarding';

    protected $fillable = [
        'uh_user_id',
        'onboarding_role',
        'work_type',
        'team_industry',
        'team_build_plan',
        'goals_json',
        'service_categories_json',
        'primary_skill',
        'experience_level',
        'rate_range',
        'has_portfolio',
        'portfolio_links',
        'current_step',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'goals_json' => 'array',
            'service_categories_json' => 'array',
            'current_step' => 'integer',
            'completed_at' => 'datetime',
        ];
    }
}
