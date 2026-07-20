package br.com.agrotech.agrotech_api.repository;

import br.com.agrotech.agrotech_api.model.Leitura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositório responsável pelas operações de persistência da entidade {@link Leitura}.
 * <p>
 * Armazena o histórico de telemetria capturado pelos sensores (pH, umidade, temperatura).
 * </p>
 */
@Repository
public interface LeituraRepository extends JpaRepository<Leitura, Long> {
}