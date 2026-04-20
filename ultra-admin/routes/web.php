<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

use App\Http\Controllers\ListingTaxonomyController;


Route::get('/listing-types', [ListingTaxonomyController::class, 'listingTypes']);

    Route::get('/listing-categories', [ListingTaxonomyController::class, 'categories']);
    Route::post('/listing-categories', [ListingTaxonomyController::class, 'storeCategory']);
    Route::put('/listing-categories/{id}', [ListingTaxonomyController::class, 'updateCategory']);
    Route::delete('/listing-categories/{id}', [ListingTaxonomyController::class, 'deleteCategory']);

    Route::get('/listing-sub-categories', [ListingTaxonomyController::class, 'subCategories']);
    Route::post('/listing-sub-categories', [ListingTaxonomyController::class, 'storeSubCategory']);
    Route::put('/listing-sub-categories/{id}', [ListingTaxonomyController::class, 'updateSubCategory']);
    Route::delete('/listing-sub-categories/{id}', [ListingTaxonomyController::class, 'deleteSubCategory']);

    Route::get('/listing-product-types', [ListingTaxonomyController::class, 'productTypes']);
    Route::post('/listing-product-types', [ListingTaxonomyController::class, 'storeProductType']);
    Route::put('/listing-product-types/{id}', [ListingTaxonomyController::class, 'updateProductType']);
    Route::delete('/listing-product-types/{id}', [ListingTaxonomyController::class, 'deleteProductType']);
    
Route::prefix('admin')->middleware(['auth:sanctum'])->group(function () {
    
});