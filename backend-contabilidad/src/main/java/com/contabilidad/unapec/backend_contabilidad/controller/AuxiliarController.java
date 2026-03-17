package com.contabilidad.unapec.backend_contabilidad.controller;

import com.contabilidad.unapec.backend_contabilidad.model.Auxiliar;
import com.contabilidad.unapec.backend_contabilidad.service.AuxiliarService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auxiliares")
@RequiredArgsConstructor
@Tag(name = "Auxiliares", description = "Endpoints para la gestión de auxiliares")
public class AuxiliarController {

    private final AuxiliarService service;

    @GetMapping(produces = "application/json")
    @Operation(operationId = "listarAuxiliares", summary = "Listar todos los auxiliares")
    public List<Auxiliar> listarTodos() {
        return service.findAll();
    }

    @GetMapping(value = "/{id}", produces = "application/json")
    @Operation(operationId = "obtenerAuxiliarPorId", summary = "Obtener un auxiliar por ID")
    public ResponseEntity<Auxiliar> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping(produces = "application/json")
    @Operation(operationId = "crearAuxiliar", summary = "Crear un nuevo auxiliar")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Auxiliar creado exitosamente")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Datos de entrada inválidos")
    public ResponseEntity<Auxiliar> crear(@Valid @RequestBody Auxiliar auxiliar) {
        return new ResponseEntity<>(service.create(auxiliar), HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}", produces = "application/json")
    @Operation(operationId = "actualizarAuxiliar", summary = "Actualizar un auxiliar existente")
    public ResponseEntity<Auxiliar> actualizar(@PathVariable Long id, @Valid @RequestBody Auxiliar auxiliar) {
        return ResponseEntity.ok(service.update(id, auxiliar));
    }

    @DeleteMapping(value = "/{id}", produces = "application/json")
    @Operation(operationId = "eliminarAuxiliar", summary = "Eliminar un auxiliar")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
