<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contract extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'contract_id',
        'title',
        'type',
        'client_username',
        'client_full_name',
        'client_email',
        'client_company',
        'provider_username',
        'provider_full_name',
        'provider_email',
        'provider_company',
        'project_summary',
        'out_of_scope',
        'initial_delivery_deadline',
        'client_review_window',
        'revision_rounds',
        'revision_turnaround_time',
        'late_delivery_consequence',
        'delivery_sla',
        'communication_sla',
        'revision_sla',
        'quality_standards',
        'client_responsibilities',
        'provider_responsibilities',
        'payment_type',
        'project_cost',
        'client_id',
        'status',
        'review_turn',
        'created_by',
    ];

    public function deliverables()
    {
        return $this->hasMany(ContractDeliverable::class, 'contract_record_id');
    }

    public function milestones()
    {
        return $this->hasMany(ContractMilestone::class, 'contract_record_id');
    }

    public function activities()
    {
        return $this->hasMany(ContractActivity::class, 'contract_record_id');
    }
}
