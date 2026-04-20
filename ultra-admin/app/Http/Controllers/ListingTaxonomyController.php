<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ListingCategory;
use App\Models\ListingProductType;
use App\Models\ListingSubCategory;
use App\Models\ListingType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ListingTaxonomyController extends Controller
{
    public function listingTypes(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => ListingType::orderBy('sort_order')->orderBy('name')->get(),
        ]);
    }

    public function categories(Request $request): JsonResponse
    {
        $query = ListingCategory::with('listingType')
            ->orderBy('sort_order')
            ->orderBy('name');

        if ($request->filled('listing_type_id')) {
            $query->where('listing_type_id', $request->integer('listing_type_id'));
        }

        return response()->json([
            'success' => true,
            'data' => $query->get(),
        ]);
    }

    public function storeCategory(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'listing_type_id' => ['required', 'exists:listing_types,id'],
            'name' => ['required', 'string', 'max:150'],
            'slug' => ['nullable', 'string', 'max:180'],
            'is_active' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $slug = Str::slug($validated['slug'] ?: $validated['name']);

        $item = ListingCategory::create([
            'listing_type_id' => $validated['listing_type_id'],
            'name' => $validated['name'],
            'slug' => $slug,
            'is_active' => $validated['is_active'] ?? true,
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Category created successfully.',
            'data' => $item->load('listingType'),
        ]);
    }

    public function updateCategory(Request $request, int $id): JsonResponse
    {
        $item = ListingCategory::findOrFail($id);

        $validated = $request->validate([
            'listing_type_id' => ['required', 'exists:listing_types,id'],
            'name' => ['required', 'string', 'max:150'],
            'slug' => ['nullable', 'string', 'max:180'],
            'is_active' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $slug = Str::slug($validated['slug'] ?: $validated['name']);

        $item->update([
            'listing_type_id' => $validated['listing_type_id'],
            'name' => $validated['name'],
            'slug' => $slug,
            'is_active' => $validated['is_active'] ?? true,
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Category updated successfully.',
            'data' => $item->load('listingType'),
        ]);
    }

    public function deleteCategory(int $id): JsonResponse
    {
        $item = ListingCategory::findOrFail($id);
        $item->delete();

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully.',
        ]);
    }

    public function subCategories(Request $request): JsonResponse
    {
        $query = ListingSubCategory::with(['listingType', 'category'])
            ->orderBy('sort_order')
            ->orderBy('name');

        if ($request->filled('listing_type_id')) {
            $query->where('listing_type_id', $request->integer('listing_type_id'));
        }

        if ($request->filled('listing_category_id')) {
            $query->where('listing_category_id', $request->integer('listing_category_id'));
        }

        return response()->json([
            'success' => true,
            'data' => $query->get(),
        ]);
    }

    public function storeSubCategory(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'listing_type_id' => ['required', 'exists:listing_types,id'],
            'listing_category_id' => ['required', 'exists:listing_categories,id'],
            'name' => ['required', 'string', 'max:150'],
            'slug' => ['nullable', 'string', 'max:180'],
            'is_active' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $slug = Str::slug($validated['slug'] ?: $validated['name']);

        $item = ListingSubCategory::create([
            'listing_type_id' => $validated['listing_type_id'],
            'listing_category_id' => $validated['listing_category_id'],
            'name' => $validated['name'],
            'slug' => $slug,
            'is_active' => $validated['is_active'] ?? true,
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Sub-category created successfully.',
            'data' => $item->load(['listingType', 'category']),
        ]);
    }

    public function updateSubCategory(Request $request, int $id): JsonResponse
    {
        $item = ListingSubCategory::findOrFail($id);

        $validated = $request->validate([
            'listing_type_id' => ['required', 'exists:listing_types,id'],
            'listing_category_id' => ['required', 'exists:listing_categories,id'],
            'name' => ['required', 'string', 'max:150'],
            'slug' => ['nullable', 'string', 'max:180'],
            'is_active' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $slug = Str::slug($validated['slug'] ?: $validated['name']);

        $item->update([
            'listing_type_id' => $validated['listing_type_id'],
            'listing_category_id' => $validated['listing_category_id'],
            'name' => $validated['name'],
            'slug' => $slug,
            'is_active' => $validated['is_active'] ?? true,
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Sub-category updated successfully.',
            'data' => $item->load(['listingType', 'category']),
        ]);
    }

    public function deleteSubCategory(int $id): JsonResponse
    {
        $item = ListingSubCategory::findOrFail($id);
        $item->delete();

        return response()->json([
            'success' => true,
            'message' => 'Sub-category deleted successfully.',
        ]);
    }

    public function productTypes(Request $request): JsonResponse
    {
        $query = ListingProductType::with(['listingType', 'category', 'subCategory'])
            ->orderBy('sort_order')
            ->orderBy('name');

        if ($request->filled('listing_type_id')) {
            $query->where('listing_type_id', $request->integer('listing_type_id'));
        }

        if ($request->filled('listing_category_id')) {
            $query->where('listing_category_id', $request->integer('listing_category_id'));
        }

        if ($request->filled('listing_sub_category_id')) {
            $query->where('listing_sub_category_id', $request->integer('listing_sub_category_id'));
        }

        return response()->json([
            'success' => true,
            'data' => $query->get(),
        ]);
    }

    public function storeProductType(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'listing_type_id' => ['required', 'exists:listing_types,id'],
            'listing_category_id' => ['nullable', 'exists:listing_categories,id'],
            'listing_sub_category_id' => ['nullable', 'exists:listing_sub_categories,id'],
            'name' => ['required', 'string', 'max:150'],
            'slug' => ['nullable', 'string', 'max:180'],
            'is_active' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $slug = Str::slug($validated['slug'] ?: $validated['name']);

        $item = ListingProductType::create([
            'listing_type_id' => $validated['listing_type_id'],
            'listing_category_id' => $validated['listing_category_id'] ?? null,
            'listing_sub_category_id' => $validated['listing_sub_category_id'] ?? null,
            'name' => $validated['name'],
            'slug' => $slug,
            'is_active' => $validated['is_active'] ?? true,
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Product type created successfully.',
            'data' => $item->load(['listingType', 'category', 'subCategory']),
        ]);
    }

    public function updateProductType(Request $request, int $id): JsonResponse
    {
        $item = ListingProductType::findOrFail($id);

        $validated = $request->validate([
            'listing_type_id' => ['required', 'exists:listing_types,id'],
            'listing_category_id' => ['nullable', 'exists:listing_categories,id'],
            'listing_sub_category_id' => ['nullable', 'exists:listing_sub_categories,id'],
            'name' => ['required', 'string', 'max:150'],
            'slug' => ['nullable', 'string', 'max:180'],
            'is_active' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $slug = Str::slug($validated['slug'] ?: $validated['name']);

        $item->update([
            'listing_type_id' => $validated['listing_type_id'],
            'listing_category_id' => $validated['listing_category_id'] ?? null,
            'listing_sub_category_id' => $validated['listing_sub_category_id'] ?? null,
            'name' => $validated['name'],
            'slug' => $slug,
            'is_active' => $validated['is_active'] ?? true,
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Product type updated successfully.',
            'data' => $item->load(['listingType', 'category', 'subCategory']),
        ]);
    }

    public function deleteProductType(int $id): JsonResponse
    {
        $item = ListingProductType::findOrFail($id);
        $item->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product type deleted successfully.',
        ]);
    }
}