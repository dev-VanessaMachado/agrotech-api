package br.com.agrotech.agrotech_api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

/**
 * Entidade que representa um dispositivo físico de IoT (Sensor Hub) instalado no campo.
 * Cada dispositivo é responsável por agrupar e transmitir as leituras de telemetria de uma fazenda.
 */
@Entity
@Table(name = "tb_dispositivo")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Dispositivo {

    /**
     * Identificador único do dispositivo no sistema.
     * Gerado automaticamente por auto-incremento no banco de dados.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nome identificador ou código do modelo do hardware (ex: "Sensor Hub v2", "EcoNode-300").
     * Campo obrigatório com limite de 50 caracteres.
     */
    @Column(nullable = false, length = 50)
    private String nomeModelo;

    /**
     * Status operacional atual do dispositivo (ex: "ATIVO", "INATIVO", "MANUTENCAO").
     * Campo obrigatório com limite de 20 caracteres para garantir consistência de estados.
     */
    @Column(nullable = false, length = 20)
    private String status;

    /**
     * Data em que o dispositivo foi fisicamente instalado na propriedade agrícola.
     * Campo obrigatório que registra o histórico de ativação do hardware.
     */
    @Column(nullable = false)
    private LocalDate dataInstalacao;

    /**
     * Relacionamento muitos-para-um com a entidade Fazenda.
     * Indica a propriedade agrícola onde este dispositivo IoT está instalado.
     * Muitas instâncias de Dispositivo podem pertencer a uma única instância de Fazenda.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fazenda_id", nullable = false)
    private Fazenda fazenda;
}