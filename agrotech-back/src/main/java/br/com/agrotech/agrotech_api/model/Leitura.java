package br.com.agrotech.agrotech_api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

/**
 * Entidade que representa uma leitura de telemetria capturada pelos sensores de um dispositivo IoT.
 * Armazena as métricas ambientais do solo e do ar em um determinado instante de tempo.
 */
@Entity
@Table(name = "tb_leitura")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Leitura {

    /**
     * Identificador único da leitura no sistema.
     * Gerado automaticamente por auto-incremento no banco de dados.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Temperatura do ar capturada pelo sensor, mensurada em graus Celsius (°C).
     * Campo obrigatório para análise de condições climáticas locais.
     */
    @Column(nullable = false)
    private Double temperaturaAr;

    /**
     * Percentual de umidade detectado no solo (0.0% a 100.0%).
     * Campo obrigatório crucial para a tomada de decisão sobre acionamento de sistemas de irrigação.
     */
    @Column(nullable = false)
    private Double umidadeSolo;

    /**
     * Potencial Hidrogeniônico (pH) medido no solo (escala de 0 a 14).
     * Campo obrigatório utilizado para monitoramento da saúde e acidez química da terra.
     */
    @Column(nullable = false)
    private Double phSolo;

    /**
     * Data e hora exatas do momento em que os sensores efetuaram a coleta dos dados.
     * Campo obrigatório que serve como linha do tempo para a plotagem de gráficos históricos.
     */
    @Column(nullable = false)
    private LocalDateTime dataHoraCaptura;

    /**
     * Relacionamento muitos-para-um com a entidade Dispositivo.
     * Identifica qual Sensor Hub realizou e transmitiu esta leitura de telemetria.
     * Muitas leituras estarão associadas cronologicamente a um único dispositivo.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dispositivo_id", nullable = false)
    private Dispositivo dispositivo;
}
