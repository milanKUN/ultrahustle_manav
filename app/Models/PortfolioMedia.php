<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioMedia extends Model
{
	protected $table = 'portfolio_media';

	protected $fillable = [
		'project_id',
		'type',
		'disk',
		'path',
		'url',
		'mime',
		'size_bytes',
		'is_cover',
		'sort_order',
	];

	protected function casts(): array
	{
		return [
			'is_cover' => 'boolean',
		];
	}

	public function project()
	{
		return $this->belongsTo(PortfolioProject::class, 'project_id');
	}
}
