package com.contabilidad.unapec.backend_contabilidad.controller;

import com.contabilidad.unapec.backend_contabilidad.model.Moneda;
import com.contabilidad.unapec.backend_contabilidad.service.MonedaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/monedas")
@RequiredArgsConstructor
@Tag(name = "Monedas", description = "Endpoints para la gestión de tipos de moneda y tasas de cambio")
public class MonedaController {

    private final MonedaService monedaService;

    @GetMapping(produces = "application/json")
    @Operation(operationId = "listarMonedas", summary = "Listar todas las monedas", 
               description = "Retorna una lista de todas las monedas registradas en el sistema de contabilidad.")
    public List<Moneda> listarTodas() {
        return monedaService.listarTodas();
    }

    @PostMapping(produces = "application/json")
    @Operation(operationId = "crearMoneda", summary = "Registrar nueva moneda", 
               description = "Crea una nueva moneda. El ID y la fecha de creación se generan automáticamente.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Moneda creada con éxito",
            content = { @Content(mediaType = "application/json", 
            schema = @Schema(implementation = Moneda.class)) }),
        @ApiResponse(responseCode = "400", description = "Error de validación o datos incorrectos", 
            content = @Content),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor (ej. violación de restricción en DB)", 
            content = @Content)
    })
    public ResponseEntity<Moneda> crear(@Valid @RequestBody Moneda moneda) {
        Moneda nuevaMoneda = monedaService.guardar(moneda);
        return new ResponseEntity<>(nuevaMoneda, HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}", produces = "application/json")
    @Operation(operationId = "actualizarMoneda", summary = "Actualizar moneda", description = "Actualiza los datos de una moneda existente.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Moneda actualizada con éxito")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Datos de entrada inválidos")
    public ResponseEntity<Moneda> actualizar(@PathVariable Long id, @Valid @RequestBody Moneda moneda) {
        // Asignamos el ID a la moneda antes de guardar para que JPA haga un update en vez de insert
        moneda.setId(id);
        Moneda actualizada = monedaService.guardar(moneda);
        return ResponseEntity.ok(actualizada);
    }

    @DeleteMapping(value = "/{id}", produces = "application/json")
    @Operation(operationId = "eliminarMoneda", summary = "Eliminar moneda", description = "Elimina físicamente una moneda de la base de datos por su ID.")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        monedaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}