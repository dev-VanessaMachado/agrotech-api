package br.com.agrotech.agrotech_api.repository;

import br.com.agrotech.agrotech_api.model.Dispositivo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositório responsável pelas operações de persistência da entidade {@link Dispositivo}.
 * <p>
 * Gerencia o ciclo de vida dos dispositivos IoT instalados em campo.
 * </p>
 */
@Repository
public interface DispositivoRepository extends JpaRepository<Dispositivo, Long> {
}