package com.contabilidad.unapec.backend_contabilidad.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "monedas_t")
@Data 
public class Moneda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El código ISO es obligatorio")
    @Size(min = 3, max = 3, message = "El código ISO debe tener 3 caracteres")
    @Column(name = "codigo_iso", unique = true)
    private String codigoIso;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    // --- EL CAMPO QUE FALTABA ---
    @NotBlank(message = "La descripción es obligatoria")
    @Column(name = "descripcion") 
    private String descripcion;

    @NotNull(message = "La tasa de cambio es obligatoria")
    @Column(name = "tasa_cambio")
    private Double tasaCambio;

    private Boolean estado;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
        if (this.estado == null) {
            this.estado = true; 
        }
    }
}