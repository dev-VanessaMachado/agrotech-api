package br.com.agrotech.agrotech_api.controller;

import br.com.agrotech.agrotech_api.model.Leitura;
import br.com.agrotech.agrotech_api.service.LeituraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST responsável por expor os endpoints HTTP referentes à entidade {@link Leitura}.
 * <p>
 * Gerencia o recebimento, consulta, alteração e exclusão de dados de telemetria dos sensores.
 * </p>
 */
@RestController
@RequestMapping("/api/leituras")
@CrossOrigin(origins = "*")
public class LeituraController {

    @Autowired
    private LeituraService leituraService;

    /**
     * Endpoint para consultar o histórico completo de telemetria.
     * Rota de acesso: GET /api/leituras
     *
     * @return {@link ResponseEntity} com a lista de {@link Leitura} e status 200 (OK).
     */
    @GetMapping
    public ResponseEntity<List<Leitura>> listarTodas() {
        List<Leitura> leituras = leituraService.buscarTodas();
        return ResponseEntity.ok(leituras);
    }

    /**
     * Endpoint para buscar um registro de leitura específico pelo seu ID.
     * Rota de acesso: GET /api/leituras/{id}
     *
     * @param id Identificador único do registro de telemetria.
     * @return {@link ResponseEntity} com a {@link Leitura} e status 200 (OK), ou 404 (Not Found).
     */
    @GetMapping("/{id}")
    public ResponseEntity<Leitura> buscarPorId(@PathVariable Long id) {
        return leituraService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Endpoint para registrar uma nova medição de telemetria.
     * Rota de acesso: POST /api/leituras
     *
     * @param leitura Objeto contendo os dados dos sensores no corpo da requisição.
     * @return {@link ResponseEntity} com a leitura salva e status 201 (Created).
     */
    @PostMapping
    public ResponseEntity<Leitura> registrarLeitura(@RequestBody Leitura leitura) {
        Leitura novaLeitura = leituraService.salvar(leitura);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaLeitura);
    }

    /**
     * Endpoint para atualizar um registro de leitura existente.
     * Rota de acesso: PUT /api/leituras/{id}
     *
     * @param id Identificador do registro a ser corrigido.
     * @param leitura Novos dados de telemetria.
     * @return {@link ResponseEntity} com a {@link Leitura} atualizada e status 200 (OK), ou 404 (Not Found).
     */
    @PutMapping("/{id}")
    public ResponseEntity<Leitura> atualizar(@PathVariable Long id, @RequestBody Leitura leitura) {
        try {
            Leitura leituraAtualizada = leituraService.atualizar(id, leitura);
            return ResponseEntity.ok(leituraAtualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Endpoint para excluir um registro de leitura pelo ID.
     * Rota de acesso: DELETE /api/leituras/{id}
     *
     * @param id Identificador do registro a ser removido.
     * @return {@link ResponseEntity} sem conteúdo e status 204 (No Content), ou 404 (Not Found).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        try {
            leituraService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}