package br.com.agrotech.agrotech_api.controller;

import br.com.agrotech.agrotech_api.model.Fazenda;
import br.com.agrotech.agrotech_api.service.FazendaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST responsável por expor os endpoints HTTP referentes à entidade {@link Fazenda}.
 * <p>
 * Provê rotas para criação, consulta, atualização e remoção de propriedades rurais.
 * </p>
 */
@RestController
@RequestMapping("/api/fazendas")
@CrossOrigin(origins = "*")
public class FazendaController {

    @Autowired
    private FazendaService fazendaService;

    /**
     * Endpoint para listar todas as fazendas cadastradas na plataforma.
     * Rota de acesso: GET /api/fazendas
     *
     * @return {@link ResponseEntity} contendo a lista de {@link Fazenda} e o status HTTP 200 (OK).
     */
    @GetMapping
    public ResponseEntity<List<Fazenda>> listarTodas() {
        List<Fazenda> fazendas = fazendaService.buscarTodas();
        return ResponseEntity.ok(fazendas);
    }

    /**
     * Endpoint para buscar uma fazenda específica pelo seu identificador único.
     * Rota de acesso: GET /api/fazendas/{id}
     *
     * @param id Identificador único da fazenda informado na URL.
     * @return {@link ResponseEntity} com a {@link Fazenda} encontrada e status 200 (OK), ou 404 (Not Found).
     */
    @GetMapping("/{id}")
    public ResponseEntity<Fazenda> buscarPorId(@PathVariable Long id) {
        return fazendaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Endpoint para cadastrar uma nova fazenda no sistema.
     * Rota de acesso: POST /api/fazendas
     *
     * @param fazenda Objeto contendo os dados da fazenda enviados no corpo da requisição.
     * @return {@link ResponseEntity} contendo a fazenda cadastrada e o status HTTP 201 (Created).
     */
    @PostMapping
    public ResponseEntity<Fazenda> cadastrar(@RequestBody Fazenda fazenda) {
        Fazenda novaFazenda = fazendaService.salvar(fazenda);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaFazenda);
    }

    /**
     * Endpoint para atualizar os dados de uma fazenda existente.
     * Rota de acesso: PUT /api/fazendas/{id}
     *
     * @param id Identificador único da fazenda a ser atualizada.
     * @param fazenda Objeto contendo os novos dados da fazenda enviados no corpo da requisição.
     * @return {@link ResponseEntity} com a {@link Fazenda} atualizada e status 200 (OK), ou 404 (Not Found).
     */
    @PutMapping("/{id}")
    public ResponseEntity<Fazenda> atualizar(@PathVariable Long id, @RequestBody Fazenda fazenda) {
        try {
            Fazenda fazendaAtualizada = fazendaService.atualizar(id, fazenda);
            return ResponseEntity.ok(fazendaAtualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Endpoint para remover uma fazenda do sistema pelo seu identificador.
     * Rota de acesso: DELETE /api/fazendas/{id}
     *
     * @param id Identificador único da fazenda a ser removida.
     * @return {@link ResponseEntity} sem conteúdo com status 204 (No Content), ou 404 (Not Found).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        try {
            fazendaService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}