<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tarea;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TareaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json(
            $request->user()->tareas()->latest('ID_Tar')->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validar($request);
        $cliente = $request->user();

        // Asocia la tarea al ánimo que el cliente registró hoy, si lo hizo.
        $registroHoy = $cliente->registrosEmociones()
            ->whereDate('Date_Reg_Emo', today())
            ->latest('Date_Reg_Emo')
            ->first();

        $tarea = $cliente->tareas()->create([
            ...$data,
            'ID_Reg_Emo' => $registroHoy?->ID_Reg_Emo,
            'Hora_Reg' => now()->format('H:i:s'),
        ]);

        return response()->json($tarea->refresh(), 201);
    }

    public function show(Request $request, int $tarea): JsonResponse
    {
        return response()->json($this->buscar($request, $tarea));
    }

    public function update(Request $request, int $tarea): JsonResponse
    {
        $modelo = $this->buscar($request, $tarea);
        $modelo->update($this->validar($request, parcial: true));

        return response()->json($modelo);
    }

    public function destroy(Request $request, int $tarea): JsonResponse
    {
        $this->buscar($request, $tarea)->delete();

        return response()->json(null, 204);
    }

    /**
     * Solo se encuentran las tareas del cliente autenticado; las ajenas responden 404.
     */
    private function buscar(Request $request, int $id): Tarea
    {
        return $request->user()->tareas()->findOrFail($id);
    }

    private function validar(Request $request, bool $parcial = false): array
    {
        $requerido = $parcial ? 'sometimes' : 'required';

        return $request->validate([
            'Nom_Tar' => [$requerido, 'string', 'max:150'],
            'Inicio' => ['nullable', 'date'],
            'Deadline' => ['nullable', 'date', Rule::when($request->filled('Inicio'), 'after_or_equal:Inicio')],
            'Dificultad' => [$requerido, 'integer', Rule::in([
                Tarea::DIFICULTAD_FACIL,
                Tarea::DIFICULTAD_INTERMEDIO,
                Tarea::DIFICULTAD_DIFICIL,
            ])],
        ], [
            'Nom_Tar.required' => 'Ponle un nombre a la tarea.',
            'Nom_Tar.max' => 'El nombre puede tener hasta 150 caracteres.',
            'Deadline.after_or_equal' => 'El deadline no puede ser antes del inicio.',
            'Dificultad.in' => 'Elige una dificultad válida.',
        ]);
    }
}
