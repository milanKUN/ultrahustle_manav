<?php

namespace App\Filament\Resources\Users\Pages;

use App\Filament\Resources\Users\UserResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;

class ViewUser extends ViewRecord
{
    protected static string $resource = UserResource::class;

    protected function getHeaderActions(): array
    {
        return [
            // EditAction::make(),
        ];
    }
    public function infolist(Schema $schema): Schema
    {
        return $schema
            ->schema([
                // USER DATA
                Section::make('User Details')
                    ->schema([
                        TextEntry::make('full_name'),
                        TextEntry::make('email'),
                        TextEntry::make('username'),
                        TextEntry::make('created_at')->dateTime()->label('User Created At'),
                        TextEntry::make('role')
                            ->label('Role')->formatStateUsing(fn ($state) => $state === 'freelancer' ? 'Creator' : ucfirst($state))->badge(),
                    ])
                    ->columns(2),
                    // Creator ONBOARDING DATA
                Section::make('Onboarding Info')
                    ->schema([
                        TextEntry::make('freelancerOnboarding.onboarding_role')
                            ->label('Role')->formatStateUsing(fn ($state) => $state ? ucfirst($state) : '')->badge(),
                        TextEntry::make('freelancerOnboarding.work_type')->formatStateUsing(fn ($state) => $state ? ucfirst($state) : ''),
                        TextEntry::make('freelancerOnboarding.team_industry')->formatStateUsing(fn ($state) => $state ? ucfirst($state) : ''),
                        TextEntry::make('freelancerOnboarding.team_build_plan')->formatStateUsing(fn ($state) => $state ? ucfirst($state) : ''),
                        TextEntry::make('freelancerOnboarding.goals_json')
                            ->label('Goals')
                            ->formatStateUsing(fn ($state) => is_array($state) ? implode(', ', $state) : $state),

                        TextEntry::make('freelancerOnboarding.service_categories_json')
                            ->label('Service Categories')
                            ->formatStateUsing(fn ($state) => is_array($state) ? implode(', ', $state) : $state),
                        TextEntry::make('freelancerOnboarding.primary_skill')->formatStateUsing(fn ($state) => $state ? ucfirst($state) : ''),
                        TextEntry::make('freelancerOnboarding.experience_level')->formatStateUsing(fn ($state) => $state ? ucfirst($state) : ''),
                        TextEntry::make('freelancerOnboarding.rate_range'),
                        TextEntry::make('freelancerOnboarding.has_portfolio'),
                        TextEntry::make('freelancerOnboarding.portfolio_links'),
                        TextEntry::make('freelancerOnboarding.current_step'),
                        TextEntry::make('freelancerOnboarding.completed_at'),
                    ])
                    ->visible(fn ($record) => $record->role === 'freelancer')
                    ->columns(2),
                // 🏢 CLIENT ONBOARDING
                Section::make('Client Onboarding')
                    ->schema([
                        TextEntry::make('clientOnboarding.company_name')->formatStateUsing(fn ($state) => $state ? ucfirst($state) : ''),
                        TextEntry::make('clientOnboarding.industry')->formatStateUsing(fn ($state) => $state ? ucfirst($state) : ''),
                    ])
                    ->visible(fn ($record) => $record->role === 'client'),
                    
                // 📄 PERSONAL INFO
                Section::make('Personal Info')
                    ->schema([
                        TextEntry::make('personalInfo.phone_number'),
                        TextEntry::make('address')
                            ->label('Address')
                            ->state(function ($record) {
                                return collect([
                                    $record->personalInfo->street ?? null,
                                    $record->personalInfo->city ?? null,
                                    $record->personalInfo->state ?? null,
                                    $record->personalInfo->country ?? null,
                                    $record->personalInfo->pincode ?? null,
                                ])->filter()->map(fn ($item) => ucfirst($item))->implode(', ');
                            }),
                    ])
                    ->columns(2),
            ]);
    }
}
