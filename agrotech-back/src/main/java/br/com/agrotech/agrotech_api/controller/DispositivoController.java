package br.com.agrotech.agrotech_api.controller;

import br.com.agrotech.agrotech_api.model.Dispositivo;
import br.com.agrotech.agrotech_api.service.DispositivoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST responsável por expor os endpoints HTTP referentes à entidade {@link Dispositivo}.
 * <p>
 * Provê rotas para criação, consulta, atualização e remoção de equipamentos IoT.
 * </p>
 */
@RestController
@RequestMapping("/api/dispositivos")
public class DispositivoController {

    @Autowired
    private DispositivoService dispositivoService;

    /**
     * Endpoint para listar todos os dispositivos cadastrados.
     * Rota de acesso: GET /api/dispositivos
     *
     * @return {@link ResponseEntity} com a lista de {@link Dispositivo} e status HTTP 200 (OK).
     */
    @GetMapping
    public ResponseEntity<List<Dispositivo>> listarTodos() {
        List<Dispositivo> dispositivos = dispositivoService.buscarTodos();
        return ResponseEntity.ok(dispositivos);
    }

    /**
     * Endpoint para buscar um dispositivo específico pelo seu ID.
     * Rota de acesso: GET /api/dispositivos/{id}
     *
     * @param id Identificador único do dispositivo na URL.
     * @return {@link ResponseEntity} com o {@link Dispositivo} e status 200 (OK), ou 404 (Not Found).
     */
    @GetMapping("/{id}")
    public ResponseEntity<Dispositivo> buscarPorId(@PathVariable Long id) {
        return dispositivoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Endpoint para cadastrar um novo dispositivo IoT.
     * Rota de acesso: POST /api/dispositivos
     *
     * @param dispositivo Dados do equipamento no corpo da requisição.
     * @return {@link ResponseEntity} com o dispositivo cadastrado e status 201 (Created).
     */
    @PostMapping
    public ResponseEntity<Dispositivo> cadastrar(@RequestBody Dispositivo dispositivo) {
        Dispositivo novoDispositivo = dispositivoService.salvar(dispositivo);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoDispositivo);
    }

    /**
     * Endpoint para atualizar dados ou status de um dispositivo existente.
     * Rota de acesso: PUT /api/dispositivos/{id}
     *
     * @param id Identificador único do dispositivo a ser atualizado.
     * @param dispositivo Novos dados do equipamento.
     * @return {@link ResponseEntity} com o {@link Dispositivo} atualizado e status 200 (OK), ou 404 (Not Found).
     */
    @PutMapping("/{id}")
    public ResponseEntity<Dispositivo> atualizar(@PathVariable Long id, @RequestBody Dispositivo dispositivo) {
        try {
            Dispositivo dispositivoAtualizado = dispositivoService.atualizar(id, dispositivo);
            return ResponseEntity.ok(dispositivoAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Endpoint para remover um dispositivo IoT pelo seu ID.
     * Rota de acesso: DELETE /api/dispositivos/{id}
     *
     * @param id Identificador único do dispositivo a ser excluído.
     * @return {@link ResponseEntity} sem conteúdo e status 204 (No Content), ou 404 (Not Found).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        try {
            dispositivoService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}