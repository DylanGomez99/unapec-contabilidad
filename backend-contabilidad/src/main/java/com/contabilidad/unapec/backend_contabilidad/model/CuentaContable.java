package com.contabilidad.unapec.backend_contabilidad.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "cuentas_contables_t")
@Data
public class CuentaContable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "codigo", length = 50)
    private String codigo;

    @NotBlank(message = "El nombre es obligatorio")
    @Column(name = "nombre", length = 100)
    private String nombre;

    @Column(name = "descripcion", length = 100)
    private String descripcion;

    @Column(name = "permite_movimiento")
    private Boolean permiteMovimiento;

    @ManyToOne
    @JoinColumn(name = "tipo_id", referencedColumnName = "id")
    private TipoCuenta tipo;

    @Column(name = "nivel")
    private Integer nivel;

    @Column(name = "balance", precision = 12, scale = 4)
    private BigDecimal balance;

    @ManyToOne
    @JoinColumn(name = "cuenta_mayor_id", referencedColumnName = "id")
    private CuentaContable cuentaMayor;

    @Column(name = "estado")
    private Boolean estado;

    @PrePersist
    protected void onCreate() {
        if (this.estado == null) {
            this.estado = true;
        }
        if (this.permiteMovimiento == null) {
            this.permiteMovimiento = true;
        }
        if (this.balance == null) {
            this.balance = BigDecimal.ZERO;
        }
    }
}
