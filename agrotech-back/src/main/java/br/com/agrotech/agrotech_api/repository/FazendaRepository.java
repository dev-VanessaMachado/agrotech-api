package br.com.agrotech.agrotech_api.repository;

import br.com.agrotech.agrotech_api.model.Fazenda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositório responsável pelas operações de persistência da entidade {@link Fazenda}.
 * <p>
 * Fornece métodos CRUD padrão herdados de {@link JpaRepository} para gerenciamento
 * dos dados das propriedades rurais.
 * </p>
 */
@Repository
public interface FazendaRepository extends JpaRepository<Fazenda, Long> {
}