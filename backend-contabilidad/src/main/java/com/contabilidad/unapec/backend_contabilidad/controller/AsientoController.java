package com.contabilidad.unapec.backend_contabilidad.controller;

import com.contabilidad.unapec.backend_contabilidad.model.Asiento;
import com.contabilidad.unapec.backend_contabilidad.model.AsientoDetalle;
import com.contabilidad.unapec.backend_contabilidad.service.AsientoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/asientos")
@RequiredArgsConstructor
@Tag(name = "Asientos Contables", description = "Endpoints para registrar transacciones y asientos contables")
public class AsientoController {

    private final AsientoService service;

    @GetMapping
    @Operation(summary = "Listar todos los asientos")
    public List<Asiento> listarTodos() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un asiento por ID")
    public ResponseEntity<Asiento> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    // DTO encapsulando asiento y sus detalles
    @Data
    public static class AsientoRequest {
        @Valid
        private Asiento asiento;
        private List<@Valid AsientoDetalle> detalles;
    }

    @PostMapping
    @Operation(summary = "Registrar un nuevo asiento con sus detalles")
    public ResponseEntity<Asiento> crear(@Valid @RequestBody AsientoRequest request) {
        return new ResponseEntity<>(service.create(request.getAsiento(), request.getDetalles()), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar/Anular un asiento")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
