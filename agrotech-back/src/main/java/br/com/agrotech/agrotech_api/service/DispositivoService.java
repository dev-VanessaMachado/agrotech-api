package br.com.agrotech.agrotech_api.service;

import br.com.agrotech.agrotech_api.model.Dispositivo;
import br.com.agrotech.agrotech_api.repository.DispositivoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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
     * Salva um novo dispositivo ou atualiza um equipamento existente no banco.
     *
     * @param dispositivo A instância do dispositivo contendo os dados de instalação e status.
     * @return O {@link Dispositivo} persistido com seu ID preenchido.
     */
    public Dispositivo salvar(Dispositivo dispositivo) {
        return dispositivoRepository.save(dispositivo);
    }
}