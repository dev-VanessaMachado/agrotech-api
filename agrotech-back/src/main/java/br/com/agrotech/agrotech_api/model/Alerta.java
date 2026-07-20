package br.com.agrotech.agrotech_api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

/**
 * Entidade que representa um evento de alerta gerado automaticamente pelo sistema.
 * Ocorre quando uma leitura de telemetria viola os limites de segurança operacionais estabelecidos.
 */
@Entity
@Table(name = "tb_alerta")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Alerta {

    /**
     * Identificador único do alerta no sistema.
     * Gerado automaticamente por auto-incremento no banco de dados.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Descrição detalhada do problema detectado (ex: "Umidade do solo abaixo do limite crítico de 20%").
     * Campo obrigatório com limite de 255 caracteres para detalhamento técnico.
     */
    @Column(nullable = false, length = 255)
    private String descricao;

    /**
     * Nível de severidade do risco associado ao alerta (ex: "CRITICO", "ALERTA", "INFO").
     * Campo obrigatório com limite de 20 caracteres para categorização no painel visual.
     */
    @Column(nullable = false, length = 20)
    private String severidade;

    /**
     * Data e hora exatas em que a anomalia foi identificada e o alerta foi disparado.
     * Campo obrigatório utilizado para auditoria e linha do tempo de eventos.
     */
    @Column(nullable = false)
    private LocalDateTime dataHoraDisparo;

    /**
     * Define se o alerta já foi visualizado ou resolvido pelo operador de campo.
     * Campo obrigatório inicializado como falso por padrão.
     */
    @Column(nullable = false)
    private Boolean resolvido = false;

    /**
     * Relacionamento muitos-para-um com a entidade Dispositivo.
     * Identifica qual Sensor Hub gerou a leitura anômala que disparou este alerta.
     * Muitos alertas podem estar historicamente vinculados a um único dispositivo.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dispositivo_id", nullable = false)
    private Dispositivo dispositivo;
}
