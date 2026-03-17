package com.contabilidad.unapec.backend_contabilidad.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "asientos_t")
@Data
public class Asiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "La descripción es obligatoria")
    @Column(name = "descripcion", length = 255)
    private String descripcion;

    @ManyToOne
    @JoinColumn(name = "auxiliar_id", referencedColumnName = "id")
    private Auxiliar auxiliar;

    @Column(name = "fecha_asiento")
    private LocalDate fechaAsiento;

    @Column(name = "monto_total", precision = 18, scale = 2)
    private BigDecimal montoTotal;

    @OneToMany(mappedBy = "asiento", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private java.util.List<AsientoDetalle> detalles = new java.util.ArrayList<>();

    @Column(name = "estado")
    private Boolean estado;

    @PrePersist
    protected void onCreate() {
        if (this.estado == null) {
            this.estado = true;
        }
        if (this.fechaAsiento == null) {
            this.fechaAsiento = LocalDate.now();
        }
    }
}
