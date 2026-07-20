package br.com.agrotech.agrotech_api.repository;

import br.com.agrotech.agrotech_api.model.Alerta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositório responsável pelas operações de persistência da entidade {@link Alerta}.
 * <p>
 * Controla os registros de ocorrências e severidades dos eventos gerados pelo sistema.
 * </p>
 */
@Repository
public interface AlertaRepository extends JpaRepository<Alerta, Long> {
}