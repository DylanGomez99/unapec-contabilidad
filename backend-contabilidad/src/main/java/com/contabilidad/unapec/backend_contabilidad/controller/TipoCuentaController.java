package com.contabilidad.unapec.backend_contabilidad.controller;

import com.contabilidad.unapec.backend_contabilidad.model.TipoCuenta;
import com.contabilidad.unapec.backend_contabilidad.service.TipoCuentaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipos-cuenta")
@RequiredArgsConstructor
@Tag(name = "Tipos de Cuenta", description = "Endpoints para la gestión de tipos de cuenta")
public class TipoCuentaController {

    private final TipoCuentaService service;

    @GetMapping
    @Operation(summary = "Listar todos los tipos de cuenta")
    public List<TipoCuenta> listarTodos() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un tipo de cuenta por ID")
    public ResponseEntity<TipoCuenta> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo tipo de cuenta")
    public ResponseEntity<TipoCuenta> crear(@Valid @RequestBody TipoCuenta tipoCuenta) {
        return new ResponseEntity<>(service.create(tipoCuenta), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un tipo de cuenta existente")
    public ResponseEntity<TipoCuenta> actualizar(@PathVariable Long id, @Valid @RequestBody TipoCuenta tipoCuenta) {
        return ResponseEntity.ok(service.update(id, tipoCuenta));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un tipo de cuenta")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
