package br.com.agrotech.agrotech_api.controller;

import br.com.agrotech.agrotech_api.model.Alerta;
import br.com.agrotech.agrotech_api.service.AlertaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST responsável por expor os endpoints HTTP referentes à entidade {@link Alerta}.
 * <p>
 * Provê rotas para consulta, disparo, resolução e exclusão de alertas do sistema.
 * </p>
 */
@RestController
@RequestMapping("/api/alertas")
public class AlertaController {

    @Autowired
    private AlertaService alertaService;

    /**
     * Endpoint para listar todas as ocorrências de alertas.
     * Rota de acesso: GET /api/alertas
     *
     * @return {@link ResponseEntity} com a lista de {@link Alerta} e status 200 (OK).
     */
    @GetMapping
    public ResponseEntity<List<Alerta>> listarTodos() {
        List<Alerta> alertas = alertaService.buscarTodos();
        return ResponseEntity.ok(alertas);
    }

    /**
     * Endpoint para consultar um alerta específico pelo seu ID.
     * Rota de acesso: GET /api/alertas/{id}
     *
     * @param id Identificador único do alerta.
     * @return {@link ResponseEntity} com o {@link Alerta} e status 200 (OK), ou 404 (Not Found).
     */
    @GetMapping("/{id}")
    public ResponseEntity<Alerta> buscarPorId(@PathVariable Long id) {
        return alertaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Endpoint para registrar um novo alerta no sistema.
     * Rota de acesso: POST /api/alertas
     *
     * @param alerta Objeto do alerta enviado no corpo da requisição.
     * @return {@link ResponseEntity} com o alerta salvo e status 201 (Created).
     */
    @PostMapping
    public ResponseEntity<Alerta> dispararAlerta(@RequestBody Alerta alerta) {
        Alerta novoAlerta = alertaService.salvar(alerta);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoAlerta);
    }

    /**
     * Endpoint para atualizar um alerta (ex: alterar severidade ou marcar como resolvido).
     * Rota de acesso: PUT /api/alertas/{id}
     *
     * @param id Identificador do alerta a ser alterado.
     * @param alerta Novos dados da ocorrência.
     * @return {@link ResponseEntity} com o {@link Alerta} atualizado e status 200 (OK), ou 404 (Not Found).
     */
    @PutMapping("/{id}")
    public ResponseEntity<Alerta> atualizar(@PathVariable Long id, @RequestBody Alerta alerta) {
        try {
            Alerta alertaAtualizado = alertaService.atualizar(id, alerta);
            return ResponseEntity.ok(alertaAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Endpoint para remover um registro de alerta pelo ID.
     * Rota de acesso: DELETE /api/alertas/{id}
     *
     * @param id Identificador do alerta a ser removido.
     * @return {@link ResponseEntity} sem conteúdo e status 204 (No Content), ou 404 (Not Found).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        try {
            alertaService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}