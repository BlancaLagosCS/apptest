<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TipEmo;
use Illuminate\Http\JsonResponse;

class EmocionController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            TipEmo::orderBy('ID_Emo')->get(['ID_Emo', 'Nom_Emo', 'Dificultad'])
        );
    }
}
