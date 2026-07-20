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
 * Provê rotas para visualização e criação de incidentes e alertas gerados no sistema.
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
     * @return {@link ResponseEntity} contendo a lista de {@link Alerta} e o status HTTP 200 (OK).
     */
    @GetMapping
    public ResponseEntity<List<Alerta>> listarTodos() {
        List<Alerta> alertas = alertaService.buscarTodos();
        return ResponseEntity.ok(alertas);
    }

    /**
     * Endpoint para registrar um novo alerta de severidade ou disparar anomalia de sistema.
     * Rota de acesso: POST /api/alertas
     *
     * @param alerta Objeto contendo os dados do alerta gerado.
     * @return {@link ResponseEntity} contendo o alerta salvo e o status HTTP 201 (Created).
     */
    @PostMapping
    public ResponseEntity<Alerta> dispararAlerta(@RequestBody Alerta alerta) {
        Alerta novoAlerta = alertaService.salvar(alerta);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoAlerta);
    }
}