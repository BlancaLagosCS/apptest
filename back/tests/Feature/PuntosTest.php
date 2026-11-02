<?php

namespace Tests\Feature;

use App\Models\Cliente;
use App\Models\Punto;
use App\Models\Tarea;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PuntosTest extends TestCase
{
    use RefreshDatabase;

    private Cliente $cliente;

    protected function setUp(): void
    {
        parent::setUp();

        $this->cliente = Cliente::create(['Nom_Cli' => 'Cliente', 'Email' => 'ana@example.com', 'Clave_Cli' => 'secreto123']);
        Sanctum::actingAs($this->cliente);
    }

    private function tarea(int $dificultad, string $nombre = 'Tarea'): Tarea
    {
        return $this->cliente->tareas()->create(['Nom_Tar' => $nombre, 'Dificultad' => $dificultad]);
    }

    private function realizar(Tarea $tarea)
    {
        return $this->patchJson("/api/tareas/{$tarea->ID_Tar}/estado", ['Est_Tar' => 'Realizada']);
    }

    public function test_sin_movimientos_los_contadores_son_cero(): void
    {
        $this->getJson('/api/puntos')->assertOk()->assertExactJson(['Cont_Tot' => 0, 'Cont_Hist' => 0]);
    }

    public function test_realizar_suma_granos_segun_la_dificultad(): void
    {
        $this->realizar($this->tarea(Tarea::DIFICULTAD_FACIL))
            ->assertOk()
            ->assertJson(['Est_Tar' => 'Realizada', 'Cant_Pun' => 1, 'Cont_Tot' => 1]);

        $this->realizar($this->tarea(Tarea::DIFICULTAD_INTERMEDIO))->assertJson(['Cant_Pun' => 2, 'Cont_Tot' => 3]);

        $dificil = $this->tarea(Tarea::DIFICULTAD_DIFICIL);
        $this->realizar($dificil)->assertJson(['Cant_Pun' => 3, 'Cont_Tot' => 6]);

        $this->assertDatabaseHas('puntos', ['ID_Tar' => $dificil->ID_Tar, 'Cant_Pun' => 3, 'Cont_Tot' => 6, 'Cont_Hist' => 6]);
        $this->getJson('/api/puntos')->assertExactJson(['Cont_Tot' => 6, 'Cont_Hist' => 6]);
    }

    public function test_una_tarea_realizada_no_cambia_ni_suma_dos_veces(): void
    {
        $tarea = $this->tarea(Tarea::DIFICULTAD_DIFICIL);
        $this->realizar($tarea)->assertOk();

        $this->realizar($tarea)->assertUnprocessable()->assertJsonValidationErrors('Est_Tar');
        $this->patchJson("/api/tareas/{$tarea->ID_Tar}/estado", ['Est_Tar' => 'Pendiente'])->assertUnprocessable();
        $this->deleteJson("/api/tareas/{$tarea->ID_Tar}")->assertUnprocessable();

        $this->assertDatabaseHas('tareas', ['ID_Tar' => $tarea->ID_Tar, 'Est_Tar' => 'Realizada']);
        $this->assertDatabaseCount('puntos', 1);
    }

    public function test_eliminar_no_suma_granos(): void
    {
        $tarea = $this->tarea(Tarea::DIFICULTAD_DIFICIL);

        $this->patchJson("/api/tareas/{$tarea->ID_Tar}/estado", ['Est_Tar' => 'Eliminada'])
            ->assertOk()
            ->assertJsonMissing(['Cant_Pun' => 3]);

        $this->assertDatabaseCount('puntos', 0);
    }

    public function test_los_negativos_restan_del_total_pero_no_del_historico(): void
    {
        $this->realizar($this->tarea(Tarea::DIFICULTAD_DIFICIL))->assertOk();
        Punto::registrar($this->cliente, -2);

        $this->getJson('/api/puntos')->assertExactJson(['Cont_Tot' => 1, 'Cont_Hist' => 3]);
    }

    public function test_cada_cliente_tiene_sus_propios_granos(): void
    {
        $otro = Cliente::create(['Nom_Cli' => 'Otro', 'Email' => 'otro@example.com', 'Clave_Cli' => 'secreto123']);
        Punto::registrar($otro, 5);

        $this->realizar($this->tarea(Tarea::DIFICULTAD_FACIL))->assertJson(['Cont_Tot' => 1]);
        $this->getJson('/api/puntos')->assertExactJson(['Cont_Tot' => 1, 'Cont_Hist' => 1]);
    }

    public function test_limite_trae_las_tareas_mas_cercanas(): void
    {
        foreach (['2026-11-06', '2026-11-03', null, '2026-11-04', '2026-11-05'] as $fecha) {
            $this->cliente->tareas()->create([
                'Nom_Tar' => $fecha ?? 'Sin fecha',
                'Dificultad' => 1,
                'Deadline' => $fecha ? "$fecha 10:00:00" : null,
            ]);
        }

        $nombres = $this->getJson('/api/tareas?estado=Pendiente&limite=3')->assertOk()->json('*.Nom_Tar');

        $this->assertSame(['2026-11-03', '2026-11-04', '2026-11-05'], $nombres);
        $this->getJson('/api/tareas?limite=0')->assertUnprocessable()->assertJsonValidationErrors('limite');
    }
}
