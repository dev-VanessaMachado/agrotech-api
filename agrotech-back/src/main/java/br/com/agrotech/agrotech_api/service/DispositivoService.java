package br.com.agrotech.agrotech_api.service;

import br.com.agrotech.agrotech_api.model.Dispositivo;
import br.com.agrotech.agrotech_api.repository.DispositivoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Classe de serviço para gerenciamento das regras de negócio dos dispositivos IoT.
 */
@Service
public class DispositivoService {

    @Autowired
    private DispositivoRepository dispositivoRepository;

    /**
     * Lista todos os dispositivos cadastrados no ecossistema da aplicação.
     *
     * @return Uma lista {@link List} contendo todos os objetos {@link Dispositivo}.
     */
    public List<Dispositivo> buscarTodos() {
        return dispositivoRepository.findAll();
    }

    /**
     * Localiza um equipamento IoT cadastrado a partir de seu identificador principal.
     *
     * @param id Identificador único do dispositivo.
     * @return Um {@link Optional} contendo o {@link Dispositivo} encontrado.
     */
    public Optional<Dispositivo> buscarPorId(Long id) {
        return dispositivoRepository.findById(id);
    }

    /**
     * Salva um novo dispositivo no banco de dados.
     *
     * @param dispositivo A instância do dispositivo contendo os dados de instalação e status.
     * @return O {@link Dispositivo} persistido com seu ID preenchido.
     */
    public Dispositivo salvar(Dispositivo dispositivo) {
        return dispositivoRepository.save(dispositivo);
    }

    /**
     * Atualiza as informações de registro, status ou associação de fazenda de um dispositivo IoT.
     *
     * @param id Identificador do dispositivo a ser modificado.
     * @param dispositivoAtualizado Objeto com os dados atualizados do equipamento.
     * @return O {@link Dispositivo} atualizado após o salvamento no banco.
     * @throws RuntimeException Se o equipamento informado não existir no banco.
     */
    public Dispositivo atualizar(Long id, Dispositivo dispositivoAtualizado) {
        return dispositivoRepository.findById(id)
                .map(dispositivo -> {
                    dispositivo.setNomeModelo(dispositivoAtualizado.getNomeModelo());
                    dispositivo.setDataInstalacao(dispositivoAtualizado.getDataInstalacao());
                    dispositivo.setStatus(dispositivoAtualizado.getStatus());
                    if (dispositivoAtualizado.getFazenda() != null) {
                        dispositivo.setFazenda(dispositivoAtualizado.getFazenda());
                    }
                    return dispositivoRepository.save(dispositivo);
                })
                .orElseThrow(() -> new RuntimeException("Dispositivo não encontrado com o ID: " + id));
    }

    /**
     * Remove um equipamento IoT do cadastro ativo da aplicação.
     *
     * @param id Identificador do dispositivo a ser deletado.
     * @throws RuntimeException Se o equipamento informado não for localizado.
     */
    public void deletar(Long id) {
        if (!dispositivoRepository.existsById(id)) {
            throw new RuntimeException("Dispositivo não encontrado com o ID: " + id);
        }
        dispositivoRepository.deleteById(id);
    }
}