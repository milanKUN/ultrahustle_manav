<?php

use Illuminate\Support\Facades\Route;

require __DIR__.'/api_routes.php';

Route::prefix('api')->group(function (): void {
	require __DIR__.'/api_routes.php';
});
