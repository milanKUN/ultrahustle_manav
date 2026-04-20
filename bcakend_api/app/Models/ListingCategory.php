<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListingCategory extends Model
{
    protected $fillable = [
        'listing_type_id',
        'name',
        'slug',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function subCategories(): HasMany
    {
        return $this->hasMany(ListingSubCategory::class, 'listing_category_id');
    }

    public function productTypes(): HasMany
    {
        return $this->hasMany(ListingProductType::class, 'listing_category_id');
    }

    public function listingType()
    {
        return $this->belongsTo(\App\Models\ListingType::class, 'listing_type_id');
    }
}
