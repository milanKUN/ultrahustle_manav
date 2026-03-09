<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Portfolio extends Model
{
	protected $fillable = [
		'user_id',
	];

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function projects()
	{
		return $this->hasMany(PortfolioProject::class);
	}
}
