<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListingProductType extends Model
{
    protected $fillable = [
        'listing_type_id',
        'listing_category_id',
        'listing_sub_category_id',
        'name',
        'slug',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function listingType()
    {
        return $this->belongsTo(\App\Models\ListingType::class, 'listing_type_id');
    }

    public function category()
    {
        return $this->belongsTo(\App\Models\ListingCategory::class, 'listing_category_id');
    }

    public function subCategory()
    {
        return $this->belongsTo(\App\Models\ListingSubCategory::class, 'listing_sub_category_id');
    }
}
