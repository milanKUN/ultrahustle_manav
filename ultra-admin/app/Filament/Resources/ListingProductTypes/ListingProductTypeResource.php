<?php

namespace App\Filament\Resources\ListingProductTypes;

use App\Filament\Resources\ListingProductTypes\Pages\ManageListingProductTypes;
use App\Models\ListingProductType;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use UnitEnum;
use App\Models\ListingCategory;
use App\Models\ListingSubCategory;
use App\Models\ListingType;
use Filament\Forms\Components\Select;
use Filament\Schemas\Components\Utilities\Get;

class ListingProductTypeResource extends Resource
{
    protected static ?string $model = ListingProductType::class;
    protected static string | UnitEnum | null $navigationGroup = 'Taxonomy';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'Listing Product Type';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('listing_type_id')
                    ->label('Listing Type')
                    ->options(
                        ListingType::query()
                            ->where('is_active', true)
                            ->orderBy('sort_order')
                            ->orderBy('name')
                            ->pluck('name', 'id')
                    )
                    ->searchable()
                    ->live()
                    ->afterStateUpdated(fn (callable $set) => [
                        $set('listing_category_id', null),
                        $set('listing_sub_category_id', null),
                    ])
                    ->required(),

                Select::make('listing_category_id')
                    ->label('Listing Category')
                    ->options(fn (Get $get) =>
                        ListingCategory::query()
                            ->where('listing_type_id', $get('listing_type_id'))
                            ->where('is_active', true)
                            ->orderBy('sort_order')
                            ->orderBy('name')
                            ->pluck('name', 'id')
                    )
                    ->searchable()
                    ->live()
                    ->afterStateUpdated(fn (callable $set) => $set('listing_sub_category_id', null))
                    ->default(null),

                Select::make('listing_sub_category_id')
                    ->label('Listing Sub Category')
                    ->options(fn (Get $get) =>
                        ListingSubCategory::query()
                            ->where('listing_type_id', $get('listing_type_id'))
                            ->when(
                                $get('listing_category_id'),
                                fn ($query) => $query->where('listing_category_id', $get('listing_category_id'))
                            )
                            ->where('is_active', true)
                            ->orderBy('sort_order')
                            ->orderBy('name')
                            ->pluck('name', 'id')
                    )
                    ->searchable()
                    ->default(null),
                TextInput::make('name')
                    ->required(),
                TextInput::make('slug')
                    ->required(),
                Toggle::make('is_active')
                    ->required(),
                TextInput::make('sort_order')
                    ->required()
                    ->numeric()
                    ->default(0),
            ]);
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('listingType.name')
                    ->label('Listing Type'),

                TextEntry::make('category.name')
                    ->label('Listing Category')
                    ->placeholder('-'),

                TextEntry::make('subCategory.name')
                    ->label('Listing Sub Category')
                    ->placeholder('-'),
                TextEntry::make('name'),
                TextEntry::make('slug'),
                IconEntry::make('is_active')
                    ->boolean(),
                TextEntry::make('sort_order')
                    ->numeric(),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('Listing Product Type')
            ->columns([
                TextColumn::make('listingType.name')
                    ->label('Listing Type')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('category.name')
                    ->label('Listing Category')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('subCategory.name')
                    ->label('Listing Sub Category')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('name')
                    ->searchable(),
                TextColumn::make('slug')
                    ->searchable(),
                IconColumn::make('is_active')
                    ->boolean(),
                TextColumn::make('sort_order')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageListingProductTypes::route('/'),
        ];
    }
}
