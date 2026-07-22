package br.com.agrotech.agrotech_api.service;

import br.com.agrotech.agrotech_api.model.Leitura;
import br.com.agrotech.agrotech_api.repository.LeituraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Classe de serviço para controle das regras de negócio da telemetria e leituras dos sensores.
 */
@Service
public class LeituraService {

    @Autowired
    private LeituraRepository leituraRepository;

    /**
     * Retorna o histórico de todas as capturas de sensores realizadas no sistema.
     *
     * @return {@link List} preenchida com o histórico completo de {@link Leitura}.
     */
    public List<Leitura> buscarTodas() {
        return leituraRepository.findAll();
    }

    /**
     * Busca um registro de telemetria individual através do seu ID de captura.
     *
     * @param id Identificador da medição.
     * @return Um {@link Optional} contendo a {@link Leitura} recuperada.
     */
    public Optional<Leitura> buscarPorId(Long id) {
        return leituraRepository.findById(id);
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

    /**
     * Permite a correção ou atualização manual de um registro de leitura dos sensores.
     *
     * @param id Identificador do registro de leitura a ser atualizado.
     * @param leituraAtualizada Objeto contendo os novos dados métricos de telemetria.
     * @return A {@link Leitura} modificada e persistida.
     * @throws RuntimeException Se a leitura informada não estiver gravada no banco.
     */
    public Leitura atualizar(Long id, Leitura leituraAtualizada) {
        return leituraRepository.findById(id)
                .map(leitura -> {
                    leitura.setPhSolo(leituraAtualizada.getPhSolo());
                    leitura.setUmidadeSolo(leituraAtualizada.getUmidadeSolo());
                    leitura.setTemperaturaAr(leituraAtualizada.getTemperaturaAr());
                    leitura.setDataHoraCaptura(leituraAtualizada.getDataHoraCaptura());
                    if (leituraAtualizada.getDispositivo() != null) {
                        leitura.setDispositivo(leituraAtualizada.getDispositivo());
                    }
                    return leituraRepository.save(leitura);
                })
                .orElseThrow(() -> new RuntimeException("Leitura não encontrada com o ID: " + id));
    }

    /**
     * Exclui um registro do histórico de medições de sensores.
     *
     * @param id Identificador do registro de leitura a ser excluído.
     * @throws RuntimeException Se o registro de leitura não for encontrado.
     */
    public void deletar(Long id) {
        if (!leituraRepository.existsById(id)) {
            throw new RuntimeException("Leitura não encontrada com o ID: " + id);
        }
        leituraRepository.deleteById(id);
    }
}