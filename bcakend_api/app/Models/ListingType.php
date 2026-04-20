<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListingType extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'code',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function categories(): HasMany
    {
        return $this->hasMany(ListingCategory::class);
    }

    public function subCategories(): HasMany
    {
        return $this->hasMany(ListingSubCategory::class);
    }

    public function productTypes(): HasMany
    {
        return $this->hasMany(ListingProductType::class);
    }
}
