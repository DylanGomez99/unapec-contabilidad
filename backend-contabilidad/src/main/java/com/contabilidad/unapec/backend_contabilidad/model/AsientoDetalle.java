package com.contabilidad.unapec.backend_contabilidad.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "asientos_detalle_t")
@Data
public class AsientoDetalle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @io.swagger.v3.oas.annotations.media.Schema(description = "ID único del detalle del asiento", example = "1", accessMode = io.swagger.v3.oas.annotations.media.Schema.AccessMode.READ_ONLY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "asiento_id", referencedColumnName = "id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Asiento asiento;

    @NotNull(message = "La cuenta contable es obligatoria")
    @ManyToOne
    @JoinColumn(name = "cuenta_id", referencedColumnName = "id")
    @io.swagger.v3.oas.annotations.media.Schema(description = "Cuenta contable asociada al detalle")
    private CuentaContable cuenta;

    @Column(name = "tipo_movimiento", length = 10)
    @io.swagger.v3.oas.annotations.media.Schema(description = "Tipo de movimiento (DEBITO o CREDITO)", allowableValues = {"DEBITO", "CREDITO"}, example = "DEBITO")
    private String tipoMovimiento; // "Debito" o "Credito"

    @NotNull(message = "El monto es obligatorio")
    @Column(name = "monto", precision = 18, scale = 2)
    @io.swagger.v3.oas.annotations.media.Schema(description = "Monto del movimiento", example = "1500.00")
    private BigDecimal monto;
}
