<?php

namespace App\Filament\Resources\ListingSubCategories;

use App\Filament\Resources\ListingSubCategories\Pages\ManageListingSubCategories;
use App\Models\ListingSubCategory;
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
use App\Models\ListingType;
use App\Models\ListingCategory;
use Filament\Forms\Components\Select;
use Filament\Schemas\Components\Utilities\Get;

class ListingSubCategoryResource extends Resource
{
    protected static ?string $model = ListingSubCategory::class;
    protected static string | UnitEnum | null $navigationGroup = 'Taxonomy';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'Listing SubCategory';

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
                    ->afterStateUpdated(fn ($set) => $set('listing_category_id', null))
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
                    ->required(),
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
                    ->label('Category'),
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
            ->recordTitleAttribute('Listing SubCategory')
            ->columns([
                TextColumn::make('listingType.name')
                    ->label('Listing Type')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('category.name')
                    ->label('Category')
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
            'index' => ManageListingSubCategories::route('/'),
        ];
    }
}
