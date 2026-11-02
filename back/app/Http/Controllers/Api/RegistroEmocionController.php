<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RegistroEmocion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RegistroEmocionController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'ID_Emo' => ['required', 'integer', 'exists:tip_emo,ID_Emo'],
            // La app guarda la emoción sin conexión/sesión y la envía después,
            // por eso acepta la fecha en que el cliente la eligió.
            'Date_Reg_Emo' => ['nullable', 'date', 'before_or_equal:'.now()->addMinutes(5)->toDateTimeString()],
        ]);

        $registro = RegistroEmocion::create([
            'ID_Emo' => $data['ID_Emo'],
            'ID_Usu' => $request->user()->ID_Cli,
            'Date_Reg_Emo' => $data['Date_Reg_Emo'] ?? now(),
        ]);

        return response()->json($registro, 201);
    }
}
