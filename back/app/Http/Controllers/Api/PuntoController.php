<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PuntoController extends Controller
{
    /**
     * Contadores actuales del cliente: el último movimiento los tiene; sin movimientos son 0.
     */
    public function show(Request $request): JsonResponse
    {
        $ultimo = $request->user()->puntos()->latest('ID_Punt')->first();

        return response()->json([
            'Cont_Tot' => $ultimo->Cont_Tot ?? 0,
            'Cont_Hist' => $ultimo->Cont_Hist ?? 0,
        ]);
    }
}
