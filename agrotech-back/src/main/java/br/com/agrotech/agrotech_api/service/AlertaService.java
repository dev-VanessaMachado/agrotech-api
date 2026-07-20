package br.com.agrotech.agrotech_api.service;

import br.com.agrotech.agrotech_api.model.Alerta;
import br.com.agrotech.agrotech_api.repository.AlertaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Classe de serviço responsável pelas regras e disparos de alertas do sistema.
 */
@Service
public class AlertaService {

    @Autowired
    private AlertaRepository alertaRepository;

    /**
     * Busca todas as ocorrências de alertas gerados no sistema.
     *
     * @return Uma lista contendo todas as instâncias registradas de {@link Alerta}.
     */
    public List<Alerta> buscarTodos() {
        return alertaRepository.findAll();
    }

    /**
     * Registra uma nova ocorrência ou anomalia detectada pelo ecossistema.
     *
     * @param alerta Dados do evento que gerou o disparo de severidade.
     * @return O {@link Alerta} gravado no banco de dados.
     */
    public Alerta salvar(Alerta alerta) {
        return alertaRepository.save(alerta);
    }
}