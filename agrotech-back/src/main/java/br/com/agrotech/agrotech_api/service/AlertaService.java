package br.com.agrotech.agrotech_api.service;

import br.com.agrotech.agrotech_api.model.Alerta;
import br.com.agrotech.agrotech_api.repository.AlertaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
     * Recupera os detalhes de um evento ou anomalia através de seu identificador.
     *
     * @param id Identificador único do alerta.
     * @return Um {@link Optional} com o {@link Alerta} consultado.
     */
    public Optional<Alerta> buscarPorId(Long id) {
        return alertaRepository.findById(id);
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

    /**
     * Atualiza o status, severidade ou descrição de um alerta cadastrado (ex: marcar como resolvido).
     *
     * @param id Identificador do alerta a ser atualizado.
     * @param alertaAtualizado Dados atualizados da anomalia.
     * @return O {@link Alerta} atualizado e mantido no banco de dados.
     * @throws RuntimeException Caso a anomalia informada não exista no banco.
     */
    public Alerta atualizar(Long id, Alerta alertaAtualizado) {
        return alertaRepository.findById(id)
                .map(alerta -> {
                    alerta.setDescricao(alertaAtualizado.getDescricao());
                    alerta.setSeveridade(alertaAtualizado.getSeveridade());
                    alerta.setDataHoraDisparo(alertaAtualizado.getDataHoraDisparo());
                    alerta.setResolvido(alertaAtualizado.getResolvido());
                    if (alertaAtualizado.getDispositivo() != null) {
                        alerta.setDispositivo(alertaAtualizado.getDispositivo());
                    }
                    return alertaRepository.save(alerta);
                })
                .orElseThrow(() -> new RuntimeException("Alerta não encontrado com o ID: " + id));
    }

    /**
     * Remove a ocorrência de um alerta do histórico do sistema.
     *
     * @param id Identificador do alerta a ser removido.
     * @throws RuntimeException Caso a anomalia informada não exista no banco.
     */
    public void deletar(Long id) {
        if (!alertaRepository.existsById(id)) {
            throw new RuntimeException("Alerta não encontrado com o ID: " + id);
        }
        alertaRepository.deleteById(id);
    }
}