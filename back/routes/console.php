<?php

use App\Models\Cliente;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Str;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Provisional hasta implementar el inicio de sesión: la app usa este token en EXPO_PUBLIC_DEV_TOKEN.
Artisan::command('cota:token-demo', function () {
    $cliente = Cliente::firstOrCreate(
        ['Email' => 'demo@cota.cl'],
        ['Nom_Cli' => 'Cliente Demo', 'Clave_Cli' => Str::random(32)],
    );

    $cliente->tokens()->where('name', 'dev')->delete();
    $token = $cliente->createToken('dev')->plainTextToken;

    $this->info("Cliente demo: {$cliente->Email} (ID_Cli {$cliente->ID_Cli})");
    $this->line('Copia esta línea en app-hh1/.env.local y reinicia Expo con "npx expo start -c":');
    $this->line("EXPO_PUBLIC_DEV_TOKEN={$token}");
})->purpose('Crea el cliente de prueba y genera un token para la app');
