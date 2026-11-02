<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tarea;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TareaController extends Controller
{
    /**
     * Filtros opcionales: estado=Pendiente|Realizada, fecha=hoy (realizadas hoy)
     * y limite=N (las primeras N según el orden). Las tareas eliminadas nunca se listan.
     */
    public function index(Request $request): JsonResponse
    {
        $filtros = $request->validate([
            'estado' => ['sometimes', Rule::in([Tarea::ESTADO_PENDIENTE, Tarea::ESTADO_REALIZADA])],
            'fecha' => ['sometimes', Rule::in(['hoy'])],
            'limite' => ['sometimes', 'integer', 'min:1', 'max:50'],
        ]);

        $consulta = $request->user()->tareas()->where('Est_Tar', '!=', Tarea::ESTADO_ELIMINADA);

        if (isset($filtros['estado'])) {
            $consulta->where('Est_Tar', $filtros['estado']);
        }

        if (isset($filtros['fecha'])) {
            $consulta->whereDate('Fecha_Real', today());
        }

        if (($filtros['estado'] ?? null) === Tarea::ESTADO_REALIZADA) {
            $consulta->latest('Fecha_Real');
        } else {
            // Las de deadline más cercano primero; las sin fecha al final.
            $consulta->orderByRaw('Deadline IS NULL')->orderBy('Deadline')->orderBy('ID_Tar');
        }

        if (isset($filtros['limite'])) {
            $consulta->limit((int) $filtros['limite']);
        }

        return response()->json($consulta->get());
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

    public function estado(Request $request, int $tarea): JsonResponse
    {
        $data = $request->validate([
            'Est_Tar' => ['required', Rule::in(Tarea::ESTADOS)],
        ], [
            'Est_Tar.in' => 'El estado debe ser Pendiente, Realizada o Eliminada.',
        ]);

        $modelo = $this->buscar($request, $tarea);
        $punto = $modelo->cambiarEstado($data['Est_Tar']);

        // Si la tarea sumó granos, la app recibe cuántos y el nuevo total.
        return response()->json($punto
            ? [...$modelo->toArray(), 'Cant_Pun' => $punto->Cant_Pun, 'Cont_Tot' => $punto->Cont_Tot]
            : $modelo);
    }

    /**
     * No borra el registro: lo marca como Eliminada.
     */
    public function destroy(Request $request, int $tarea): JsonResponse
    {
        $this->buscar($request, $tarea)->cambiarEstado(Tarea::ESTADO_ELIMINADA);

        return response()->json(null, 204);
    }

    /**
     * Solo se encuentran las tareas del cliente autenticado que no estén eliminadas;
     * el resto responde 404.
     */
    private function buscar(Request $request, int $id): Tarea
    {
        return $request->user()->tareas()
            ->where('Est_Tar', '!=', Tarea::ESTADO_ELIMINADA)
            ->findOrFail($id);
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
