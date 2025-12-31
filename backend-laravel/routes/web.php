<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

Route::get('/', function () {
    return view('welcome');
});

// TEMPORARY: Manual database reset route
// DELETE THIS AFTER USING IT ONCE!
Route::get('/nuclear-reset-db', function () {
    try {
        // Set maximum execution time
        set_time_limit(300);
        
        // Run the wipe and seed command programmatically
        Artisan::call('migrate:fresh --seed --force');
        $output = Artisan::output();
        
        return response()->json([
            'success' => true,
            'message' => '✅ Database has been successfully wiped and seeded with 10 articles!',
            'output' => $output,
            'timestamp' => now()
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => '❌ Error: ' . $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
});
