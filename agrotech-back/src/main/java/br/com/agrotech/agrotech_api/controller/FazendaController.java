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
 * Provê rotas para criação e listagem de propriedades rurais integradas ao ecossistema.
 * </p>
 */
@RestController
@RequestMapping("/api/fazendas")
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
}