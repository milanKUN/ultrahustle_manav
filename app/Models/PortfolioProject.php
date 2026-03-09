<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioProject extends Model
{
	protected $fillable = [
		'portfolio_id',
		'title',
		'description',
		'cost_cents',
		'currency',
		'cover_media_id',
		'sort_order',
	];

	public function portfolio()
	{
		return $this->belongsTo(Portfolio::class);
	}

	public function media()
	{
		return $this->hasMany(PortfolioMedia::class, 'project_id');
	}

	public function coverMedia()
	{
		return $this->belongsTo(PortfolioMedia::class, 'cover_media_id');
	}
}
