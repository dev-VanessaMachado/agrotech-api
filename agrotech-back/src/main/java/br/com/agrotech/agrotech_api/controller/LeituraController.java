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
 * Gerencia o recebimento de dados de telemetria enviados pelos sensores em campo.
 * </p>
 */
@RestController
@RequestMapping("/api/leituras")
public class LeituraController {

    @Autowired
    private LeituraService leituraService;

    /**
     * Endpoint para consultar o histórico completo de telemetria.
     * Rota de acesso: GET /api/leituras
     *
     * @return {@link ResponseEntity} contendo a lista de {@link Leitura} e o status HTTP 200 (OK).
     */
    @GetMapping
    public ResponseEntity<List<Leitura>> listarTodas() {
        List<Leitura> leituras = leituraService.buscarTodas();
        return ResponseEntity.ok(leituras);
    }

    /**
     * Endpoint para receber e registrar novas medições vindas dos sensores IoT.
     * Rota de acesso: POST /api/leituras
     *
     * @param leitura Objeto contendo dados de pH, umidade e temperatura enviados pelo dispositivo.
     * @return {@link ResponseEntity} contendo a leitura registrada e o status HTTP 201 (Created).
     */
    @PostMapping
    public ResponseEntity<Leitura> registrarLeitura(@RequestBody Leitura leitura) {
        Leitura novaLeitura = leituraService.salvar(leitura);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaLeitura);
    }
}