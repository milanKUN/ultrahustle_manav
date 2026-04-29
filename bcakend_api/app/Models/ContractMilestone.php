<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContractMilestone extends Model
{
    use HasFactory;

    protected $fillable = [
        'contract_record_id',
        'title',
        'amount',
        'deadline',
        'status',
    ];

    public function contract()
    {
        return $this->belongsTo(Contract::class, 'contract_record_id');
    }
}
