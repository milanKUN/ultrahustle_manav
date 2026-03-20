<?php

namespace App\Filament\Resources\Users\Pages;

use App\Filament\Resources\Users\UserResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class ViewUser extends ViewRecord
{
    protected static string $resource = UserResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
    public function infolist(Schema $schema): Schema
    {
        return $schema
            ->schema([
                TextEntry::make('full_name'),
                TextEntry::make('email'),

                TextEntry::make('freelancerOnboarding.onboarding_role')
                    ->label('Role'),

                TextEntry::make('freelancerOnboarding.work_type'),
                TextEntry::make('freelancerOnboarding.team_industry'),
                TextEntry::make('freelancerOnboarding.team_build_plan'),
                TextEntry::make('freelancerOnboarding.goals_json')
                    ->label('Goals')
                    ->formatStateUsing(fn ($state) => is_array($state) ? implode(', ', $state) : $state),

                TextEntry::make('freelancerOnboarding.service_categories_json')
                    ->label('Service Categories')
                    ->formatStateUsing(fn ($state) => is_array($state) ? implode(', ', $state) : $state),
                TextEntry::make('freelancerOnboarding.primary_skill'),
                TextEntry::make('freelancerOnboarding.experience_level'),
                TextEntry::make('freelancerOnboarding.rate_range'),
                TextEntry::make('freelancerOnboarding.has_portfolio'),
                TextEntry::make('freelancerOnboarding.portfolio_links'),
                TextEntry::make('freelancerOnboarding.current_step'),
                TextEntry::make('freelancerOnboarding.completed_at'),
            ]);
    }
}
