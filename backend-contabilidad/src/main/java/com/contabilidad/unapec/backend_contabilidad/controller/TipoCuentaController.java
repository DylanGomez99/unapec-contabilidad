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

    @GetMapping(produces = "application/json")
    @Operation(summary = "Listar todos los tipos de cuenta", operationId = "listarTiposCuenta")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Lista obtenida exitosamente")
    public List<TipoCuenta> listarTodos() {
        return service.findAll();
    }

    @GetMapping(value = "/{id}", produces = "application/json")
    @Operation(summary = "Obtener un tipo de cuenta por ID", operationId = "obtenerTipoCuentaPorId")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Tipo de cuenta encontrado"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Tipo de cuenta no encontrado")
    })
    public ResponseEntity<TipoCuenta> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping(produces = "application/json")
    @Operation(summary = "Crear un nuevo tipo de cuenta", operationId = "crearTipoCuenta")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Tipo de cuenta creado"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    public ResponseEntity<TipoCuenta> crear(@Valid @RequestBody TipoCuenta tipoCuenta) {
        return new ResponseEntity<>(service.create(tipoCuenta), HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}", produces = "application/json")
    @Operation(summary = "Actualizar un tipo de cuenta existente", operationId = "actualizarTipoCuenta")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Tipo de cuenta actualizado"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Datos inválidos o ID no coincide"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Tipo de cuenta no encontrado")
    })
    public ResponseEntity<TipoCuenta> actualizar(@PathVariable Long id, @Valid @RequestBody TipoCuenta tipoCuenta) {
        return ResponseEntity.ok(service.update(id, tipoCuenta));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un tipo de cuenta", operationId = "eliminarTipoCuenta")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Tipo de cuenta eliminado"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Tipo de cuenta no encontrado")
    })
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
