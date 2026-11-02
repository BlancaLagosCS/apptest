<?php

namespace Tests\Feature;

use App\Models\Cliente;
use App\Models\RegistroEmocion;
use App\Models\Tarea;
use Database\Seeders\TipEmoSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TareasTest extends TestCase
{
    use RefreshDatabase;

    private Cliente $cliente;

    protected function setUp(): void
    {
        parent::setUp();

        $this->cliente = $this->crearCliente('ana@example.com');
        Sanctum::actingAs($this->cliente);
    }

    private function crearCliente(string $email): Cliente
    {
        return Cliente::create(['Nom_Cli' => 'Cliente', 'Email' => $email, 'Clave_Cli' => 'secreto123']);
    }

    public function test_requiere_autenticacion(): void
    {
        $this->app['auth']->forgetGuards();

        $this->postJson('/api/tareas', ['Nom_Tar' => 'Estudiar', 'Dificultad' => 1])->assertUnauthorized();
    }

    public function test_crea_una_tarea_con_hora_de_registro_automatica(): void
    {
        Carbon::setTestNow('2026-11-02 15:45:10');

        $this->postJson('/api/tareas', [
            'Nom_Tar' => 'Estudiar cálculo',
            'Inicio' => '2026-11-03 09:00:00',
            'Deadline' => '2026-11-05 18:00:00',
            'Dificultad' => Tarea::DIFICULTAD_DIFICIL,
        ])
            ->assertCreated()
            ->assertJson([
                'Nom_Tar' => 'Estudiar cálculo',
                'ID_Cli' => $this->cliente->ID_Cli,
                'Hora_Reg' => '15:45:10',
                'Inicio' => '2026-11-03 09:00:00',
                'Deadline' => '2026-11-05 18:00:00',
                'Dificultad' => 3,
            ]);

        $this->assertDatabaseCount('tareas', 1);
    }

    public function test_inicio_y_deadline_pueden_ser_nulos(): void
    {
        $this->postJson('/api/tareas', ['Nom_Tar' => 'Leer', 'Dificultad' => 1])
            ->assertCreated()
            ->assertJson(['Inicio' => null, 'Deadline' => null]);
    }

    public function test_ignora_el_id_cliente_enviado_por_la_app(): void
    {
        $otro = $this->crearCliente('otro@example.com');

        $this->postJson('/api/tareas', ['Nom_Tar' => 'Leer', 'Dificultad' => 1, 'ID_Cli' => $otro->ID_Cli])
            ->assertCreated()
            ->assertJson(['ID_Cli' => $this->cliente->ID_Cli]);
    }

    public function test_asocia_la_emocion_registrada_hoy(): void
    {
        $this->seed(TipEmoSeeder::class);
        $registro = RegistroEmocion::create(['ID_Emo' => 2, 'ID_Usu' => $this->cliente->ID_Cli, 'Date_Reg_Emo' => now()]);

        $this->postJson('/api/tareas', ['Nom_Tar' => 'Leer', 'Dificultad' => 1])
            ->assertCreated()
            ->assertJson(['ID_Reg_Emo' => $registro->ID_Reg_Emo]);
    }

    public function test_valida_los_datos(): void
    {
        $this->postJson('/api/tareas', [
            'Nom_Tar' => '',
            'Inicio' => '2026-11-05 10:00:00',
            'Deadline' => '2026-11-04 10:00:00',
            'Dificultad' => 4,
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['Nom_Tar', 'Deadline', 'Dificultad']);
    }

    public function test_lista_actualiza_y_elimina_solo_tareas_propias(): void
    {
        $propia = $this->cliente->tareas()->create(['Nom_Tar' => 'Mía', 'Dificultad' => 1]);
        $ajena = $this->crearCliente('otro@example.com')->tareas()->create(['Nom_Tar' => 'Ajena', 'Dificultad' => 1]);

        $this->getJson('/api/tareas')->assertOk()->assertJsonCount(1)->assertJsonPath('0.Nom_Tar', 'Mía');

        $this->putJson("/api/tareas/{$propia->ID_Tar}", ['Dificultad' => 2])
            ->assertOk()
            ->assertJson(['Nom_Tar' => 'Mía', 'Dificultad' => 2]);

        $this->getJson("/api/tareas/{$ajena->ID_Tar}")->assertNotFound();
        $this->deleteJson("/api/tareas/{$ajena->ID_Tar}")->assertNotFound();

        $this->deleteJson("/api/tareas/{$propia->ID_Tar}")->assertNoContent();
        // El registro se conserva marcado como Eliminada.
        $this->assertDatabaseHas('tareas', ['ID_Tar' => $propia->ID_Tar, 'Est_Tar' => 'Eliminada']);
    }

    public function test_una_tarea_nueva_queda_pendiente(): void
    {
        $this->postJson('/api/tareas', ['Nom_Tar' => 'Leer', 'Dificultad' => 1])
            ->assertCreated()
            ->assertJson(['Est_Tar' => 'Pendiente', 'Fecha_Real' => null]);
    }

    public function test_marcar_realizada_guarda_la_fecha_de_realizacion(): void
    {
        Carbon::setTestNow('2026-11-02 16:20:00');
        $tarea = $this->cliente->tareas()->create(['Nom_Tar' => 'Leer', 'Dificultad' => 1]);

        $this->patchJson("/api/tareas/{$tarea->ID_Tar}/estado", ['Est_Tar' => 'Realizada'])
            ->assertOk()
            ->assertJson(['Est_Tar' => 'Realizada', 'Fecha_Real' => '2026-11-02 16:20:00']);
    }

    public function test_marcar_eliminada_la_oculta_de_todo(): void
    {
        $tarea = $this->cliente->tareas()->create(['Nom_Tar' => 'Leer', 'Dificultad' => 1]);

        $this->patchJson("/api/tareas/{$tarea->ID_Tar}/estado", ['Est_Tar' => 'Eliminada'])->assertOk();

        $this->assertDatabaseHas('tareas', ['ID_Tar' => $tarea->ID_Tar, 'Est_Tar' => 'Eliminada']);
        $this->getJson('/api/tareas')->assertOk()->assertJsonCount(0);
        $this->getJson("/api/tareas/{$tarea->ID_Tar}")->assertNotFound();
        $this->patchJson("/api/tareas/{$tarea->ID_Tar}/estado", ['Est_Tar' => 'Realizada'])->assertNotFound();
    }

    public function test_rechaza_estados_invalidos(): void
    {
        $tarea = $this->cliente->tareas()->create(['Nom_Tar' => 'Leer', 'Dificultad' => 1]);

        $this->patchJson("/api/tareas/{$tarea->ID_Tar}/estado", ['Est_Tar' => 'realizada'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('Est_Tar');
    }

    public function test_lista_pendientes_ordenadas_por_deadline(): void
    {
        $crear = fn (string $nombre, ?string $deadline, string $estado = 'Pendiente') => $this->cliente->tareas()
            ->create(['Nom_Tar' => $nombre, 'Dificultad' => 1, 'Deadline' => $deadline, 'Est_Tar' => $estado]);

        $crear('Sin fecha', null);
        $crear('Viernes', '2026-11-06 10:00:00');
        $crear('Martes', '2026-11-03 10:00:00');
        $crear('Hecha', '2026-11-01 10:00:00', 'Realizada');
        $crear('Borrada', '2026-11-01 10:00:00', 'Eliminada');

        $nombres = $this->getJson('/api/tareas?estado=Pendiente')->assertOk()->json('*.Nom_Tar');

        $this->assertSame(['Martes', 'Viernes', 'Sin fecha'], $nombres);
    }

    public function test_lista_solo_las_realizadas_hoy(): void
    {
        Carbon::setTestNow('2026-11-02 18:00:00');
        $crear = fn (string $nombre, string $estado, ?string $fechaReal) => $this->cliente->tareas()
            ->create(['Nom_Tar' => $nombre, 'Dificultad' => 1, 'Est_Tar' => $estado, 'Fecha_Real' => $fechaReal]);

        $crear('Hoy temprano', 'Realizada', '2026-11-02 08:00:00');
        $crear('Hoy tarde', 'Realizada', '2026-11-02 17:00:00');
        $crear('Ayer', 'Realizada', '2026-11-01 20:00:00');
        $crear('Pendiente', 'Pendiente', null);

        $nombres = $this->getJson('/api/tareas?estado=Realizada&fecha=hoy')->assertOk()->json('*.Nom_Tar');

        $this->assertSame(['Hoy tarde', 'Hoy temprano'], $nombres);
    }
}
