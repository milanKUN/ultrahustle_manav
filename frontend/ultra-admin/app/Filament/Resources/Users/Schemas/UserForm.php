<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('uh_user_id')
                    ->required(),
                TextInput::make('full_name')
                    ->required(),
                TextInput::make('name')
                    ->default(null),
                TextInput::make('username')
                    ->default(null),
                TextInput::make('email')
                    ->label('Email address')
                    ->email()
                    ->required(),
                DateTimePicker::make('email_verified_at'),
                TextInput::make('password')
                    ->password()
                    ->default(null),
                Select::make('role')
                    ->options(['freelancer' => 'Freelancer', 'client' => 'Client'])
                    ->required(),
                TextInput::make('provider')
                    ->default(null),
                TextInput::make('provider_id')
                    ->default(null),
                Toggle::make('agreed_to_terms')
                    ->required(),
            ]);
    }
}
