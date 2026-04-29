<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContractDeliverable extends Model
{
    use HasFactory;

    protected $fillable = [
        'contract_record_id',
        'title',
        'format',
        'quantity',
        'acceptance_criteria',
    ];

    public function contract()
    {
        return $this->belongsTo(Contract::class, 'contract_record_id');
    }
}
