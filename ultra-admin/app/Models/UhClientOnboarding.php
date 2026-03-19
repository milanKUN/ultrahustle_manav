<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UhClientOnboarding extends Model
{
    use HasFactory;

    protected $table = 'uh_client_onboarding';

    protected $fillable = [
        'uh_user_id',
        'onboarding_role',
        'work_type',
        'team_industry',
        'team_build_plan',
        'goals_json',
        'needs_categories_json',
        'avg_project_budget',
        'expected_frequency',
        'hiring_for_team',
        'hiring_business_name',
        'hiring_role',
        'is_personal_account',
        'business_name',
        'employees',
        'business_industry',
        'other_industry',
        'website',
        'tax_id',
        'country',
        'state',
        'city',
        'current_step',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'goals_json' => 'array',
            'needs_categories_json' => 'array',
            'is_personal_account' => 'boolean',
            'employees' => 'integer',
            'current_step' => 'integer',
            'completed_at' => 'datetime',
        ];
    }
}
