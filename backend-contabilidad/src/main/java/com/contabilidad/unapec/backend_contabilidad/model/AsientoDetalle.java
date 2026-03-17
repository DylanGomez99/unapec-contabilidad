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
    private Long id;

    @ManyToOne
    @JoinColumn(name = "asiento_id", referencedColumnName = "id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Asiento asiento;

    @NotNull(message = "La cuenta contable es obligatoria")
    @ManyToOne
    @JoinColumn(name = "cuenta_id", referencedColumnName = "id")
    private CuentaContable cuenta;

    @Column(name = "tipo_movimiento", length = 10)
    private String tipoMovimiento; // "Debito" o "Credito"

    @NotNull(message = "El monto es obligatorio")
    @Column(name = "monto", precision = 18, scale = 2)
    private BigDecimal monto;
}
