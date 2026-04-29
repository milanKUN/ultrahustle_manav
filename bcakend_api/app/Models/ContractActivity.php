<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContractActivity extends Model
{
    protected $fillable = [
        'contract_record_id',
        'actor_id',
        'action',
        'details',
    ];

    protected $casts = [
        'details' => 'array',
    ];

    public function contract()
    {
        return $this->belongsTo(Contract::class, 'contract_record_id');
    }

    public function actor()
    {
        return $this->belongsTo(User::class, 'actor_id');
    }
}
