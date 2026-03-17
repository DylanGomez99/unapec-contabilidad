package com.contabilidad.unapec.backend_contabilidad.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Table(name = "tipos_cuenta_t")
@Data
public class TipoCuenta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @io.swagger.v3.oas.annotations.media.Schema(description = "ID único del tipo de cuenta", example = "1", accessMode = io.swagger.v3.oas.annotations.media.Schema.AccessMode.READ_ONLY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Column(name = "nombre", length = 50)
    @io.swagger.v3.oas.annotations.media.Schema(description = "Nombre del tipo de cuenta (ej. Activos)", example = "Activos")
    private String nombre;

    @Column(name = "descripcion", length = 100)
    @io.swagger.v3.oas.annotations.media.Schema(description = "Descripción del tipo de cuenta", example = "Bienes y derechos de la empresa")
    private String descripcion;

    @Column(name = "origen", length = 10)
    @io.swagger.v3.oas.annotations.media.Schema(description = "Origen normal del saldo de la cuenta", allowableValues = {"DEBITO", "CREDITO"}, example = "DEBITO")
    private String origen; // "Debito" o "Credito"

    @Column(name = "estado")
    @io.swagger.v3.oas.annotations.media.Schema(description = "Estado del tipo de cuenta (true = Activo, false = Inactivo)", example = "true")
    private Boolean estado;

    @PrePersist
    protected void onCreate() {
        if (this.estado == null) {
            this.estado = true;
        }
    }
}
