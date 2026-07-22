package br.com.agrotech.agrotech_api.service;

import br.com.agrotech.agrotech_api.model.Fazenda;
import br.com.agrotech.agrotech_api.repository.FazendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Classe de serviço responsável por gerenciar as regras de negócio da entidade {@link Fazenda}.
 * Intermedeia a comunicação entre a camada de controle (Web) e o repositório de dados.
 */
@Service
public class FazendaService {

    @Autowired
    private FazendaRepository fazendaRepository;

    /**
     * Recupera todas as propriedades rurais cadastradas no sistema.
     *
     * @return {@link List} contendo todas as instâncias de {@link Fazenda}.
     */
    public List<Fazenda> buscarTodas() {
        return fazendaRepository.findAll();
    }

    /**
     * Busca uma fazenda específica pelo seu identificador único.
     *
     * @param id Identificador único da fazenda.
     * @return Um {@link Optional} contendo a {@link Fazenda} caso encontrada.
     */
    public Optional<Fazenda> buscarPorId(Long id) {
        return fazendaRepository.findById(id);
    }

    /**
     * Realiza o cadastro ou atualização de uma propriedade rural no sistema.
     *
     * @param fazenda Objeto contendo os dados da fazenda a ser persistida.
     * @return A instância de {@link Fazenda} salva com seu ID gerado.
     */
    public Fazenda salvar(Fazenda fazenda) {
        return fazendaRepository.save(fazenda);
    }

    /**
     * Atualiza os dados de uma fazenda existente no sistema.
     *
     * @param id Identificador da fazenda a ser atualizada.
     * @param fazendaAtualizada Objeto contendo os novos dados da fazenda.
     * @return A instância de {@link Fazenda} atualizada.
     * @throws RuntimeException Se a fazenda não for encontrada pelo ID.
     */
    public Fazenda atualizar(Long id, Fazenda fazendaAtualizada) {
        return fazendaRepository.findById(id)
                .map(fazenda -> {
                    fazenda.setNome(fazendaAtualizada.getNome());
                    fazenda.setLocalizacao(fazendaAtualizada.getLocalizacao());
                    fazenda.setAreaHectares(fazendaAtualizada.getAreaHectares());
                    return fazendaRepository.save(fazenda);
                })
                .orElseThrow(() -> new RuntimeException("Fazenda não encontrada com o ID: " + id));
    }

    /**
     * Remove uma propriedade rural do sistema pelo seu identificador.
     *
     * @param id Identificador da fazenda a ser removida.
     * @throws RuntimeException Se a fazenda não for encontrada.
     */
    public void deletar(Long id) {
        if (!fazendaRepository.existsById(id)) {
            throw new RuntimeException("Fazenda não encontrada com o ID: " + id);
        }
        fazendaRepository.deleteById(id);
    }
}