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
 * Provê rotas para criação e listagem dos equipamentos IoT instalados nas fazendas.
 */
@RestController
@RequestMapping("/api/dispositivos")
public class DispositivoController {

    @Autowired
    private DispositivoService dispositivoService;

    /**
     * Endpoint para listar todos os dispositivos IoT cadastrados na plataforma.
     * Rota de acesso: GET /api/dispositivos
     *
     * @return {@link ResponseEntity} contendo a lista de {@link Dispositivo} e o status HTTP 200 (OK).
     */
    @GetMapping
    public ResponseEntity<List<Dispositivo>> listarTodos() {
        List<Dispositivo> dispositivos = dispositivoService.buscarTodos();
        return ResponseEntity.ok(dispositivos);
    }

    /**
     * Endpoint para cadastrar um novo dispositivo IoT no sistema.
     * Rota de acesso: POST /api/dispositivos
     *
     * @param dispositivo Objeto contendo os dados do equipamento enviados no corpo da requisição.
     * @return {@link ResponseEntity} contendo o dispositivo cadastrado e o status HTTP 201 (Created).
     */
    @PostMapping
    public ResponseEntity<Dispositivo> cadastrar(@RequestBody Dispositivo dispositivo) {
        Dispositivo novoDispositivo = dispositivoService.salvar(dispositivo);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoDispositivo);
    }
}