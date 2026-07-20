package br.com.agrotech.agrotech_api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Entidade que representa uma propriedade agrícola (Fazenda) no sistema.
 * Mapeia as informações básicas do local onde os dispositivos de IoT serão instalados.
 */
@Entity
@Table(name = "tb_fazenda")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Fazenda {

    /**
     * Identificador único da fazenda.
     * Gerado automaticamente pelo banco de dados com estratégia de auto-incremento.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nome identificador da fazenda (ex: Fazenda Santa Maria).
     * Campo obrigatório com limite de 100 caracteres.
     */
    @Column(nullable = false, length = 100)
    private String nome;

    /**
     * Localização geográfica descritiva ou por coordenadas da propriedade.
     * Campo obrigatório com limite de 100 caracteres.
     */
    @Column(nullable = false, length = 100)
    private String localizacao;

    /**
     * Área total da fazenda mensurada em hectares.
     * Campo obrigatório usado para cálculos de densidade de sensores por área.
     */
    @Column(nullable = false)
    private Double areaHectares;
}