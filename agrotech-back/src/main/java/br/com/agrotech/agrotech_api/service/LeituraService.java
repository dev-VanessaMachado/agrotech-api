package br.com.agrotech.agrotech_api.service;

import br.com.agrotech.agrotech_api.model.Leitura;
import br.com.agrotech.agrotech_api.repository.LeituraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Classe de serviço para controle das regras de negócio da telemetria e leituras dos sensores.
 */
@Service
public class LeituraService {

    @Autowired
    private LeituraRepository leituraRepository;

    /**
     * Retorna o histórico de todas as capturas de sensores realizadas.
     *
     * @return {@link List} preenchida com o histórico completo de {@link Leitura}.
     */
    public List<Leitura> buscarTodas() {
        return leituraRepository.findAll();
    }

    /**
     * Armazena uma nova leitura enviada pelos sensores de campo (pH, umidade, temperatura).
     *
     * @param leitura Os dados brutos de telemetria medidos pelo hardware IoT.
     * @return A {@link Leitura} salva e datada no banco de dados.
     */
    public Leitura salvar(Leitura leitura) {
        return leituraRepository.save(leitura);
    }
}