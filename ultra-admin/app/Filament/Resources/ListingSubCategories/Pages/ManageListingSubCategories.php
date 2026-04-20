<?php

namespace App\Filament\Resources\ListingSubCategories\Pages;

use App\Filament\Resources\ListingSubCategories\ListingSubCategoryResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageListingSubCategories extends ManageRecords
{
    protected static string $resource = ListingSubCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
