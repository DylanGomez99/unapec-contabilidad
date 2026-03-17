package com.contabilidad.unapec.backend_contabilidad.controller;

import com.contabilidad.unapec.backend_contabilidad.model.CuentaContable;
import com.contabilidad.unapec.backend_contabilidad.service.CuentaContableService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cuentas-contables")
@RequiredArgsConstructor
@Tag(name = "Cuentas Contables", description = "Endpoints para el catálogo de cuentas contables")
public class CuentaContableController {

    private final CuentaContableService service;

    @GetMapping
    @Operation(summary = "Listar todas las cuentas contables")
    public List<CuentaContable> listarTodas() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener una cuenta por ID")
    public ResponseEntity<CuentaContable> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    @Operation(summary = "Crear una nueva cuenta contable")
    public ResponseEntity<CuentaContable> crear(@Valid @RequestBody CuentaContable cuenta) {
        return new ResponseEntity<>(service.create(cuenta), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar una cuenta contable existente")
    public ResponseEntity<CuentaContable> actualizar(@PathVariable Long id, @Valid @RequestBody CuentaContable cuenta) {
        return ResponseEntity.ok(service.update(id, cuenta));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar una cuenta contable")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
