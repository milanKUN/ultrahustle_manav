<?php

namespace App\Filament\Resources\ListingTypes\Pages;

use App\Filament\Resources\ListingTypes\ListingTypeResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageListingTypes extends ManageRecords
{
    protected static string $resource = ListingTypeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
