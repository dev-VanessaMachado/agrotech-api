package br.com.agrotech.agrotech_api.service;

import br.com.agrotech.agrotech_api.model.Fazenda;
import br.com.agrotech.agrotech_api.repository.FazendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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
     * @return {@link List} contendo todas as instâncias de {@link Fazenda} encontradas no banco de dados.
     */
    public List<Fazenda> buscarTodas() {
        return fazendaRepository.findAll();
    }

    /**
     * Realiza o cadastro ou atualização de uma propriedade rural no sistema.
     * <p>
     * Antes de persistir, futuras regras de negócio ou validações customizadas da
     * fazenda (como validação de área ou localização) devem ser aplicadas aqui.
     * </p>
     *
     * @param fazenda Objeto contendo os dados da fazenda a ser persistida.
     * @return A instância de {@link Fazenda} salva com seu respectivo ID gerado pelo banco.
     */
    public Fazenda salvar(Fazenda fazenda) {
        // Futuras validações de negócio podem entrar aqui
        return fazendaRepository.save(fazenda);
    }
}