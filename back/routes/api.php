<?php

use App\Http\Controllers\Api\EmocionController;
use App\Http\Controllers\Api\RegistroEmocionController;
use App\Http\Controllers\Api\TareaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/emociones', [EmocionController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/registro-emociones', [RegistroEmocionController::class, 'store']);
    Route::apiResource('tareas', TareaController::class);
});
