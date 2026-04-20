<?php

namespace App\Filament\Resources\ListingCategories\Pages;

use App\Filament\Resources\ListingCategories\ListingCategoryResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageListingCategories extends ManageRecords
{
    protected static string $resource = ListingCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
