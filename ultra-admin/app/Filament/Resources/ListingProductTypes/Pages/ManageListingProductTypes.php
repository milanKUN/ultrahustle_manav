<?php

namespace App\Filament\Resources\ListingProductTypes\Pages;

use App\Filament\Resources\ListingProductTypes\ListingProductTypeResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageListingProductTypes extends ManageRecords
{
    protected static string $resource = ListingProductTypeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
