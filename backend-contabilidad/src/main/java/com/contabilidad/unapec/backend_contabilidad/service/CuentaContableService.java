package com.contabilidad.unapec.backend_contabilidad.service;

import com.contabilidad.unapec.backend_contabilidad.model.CuentaContable;
import com.contabilidad.unapec.backend_contabilidad.repository.CuentaContableRepository;
import com.contabilidad.unapec.backend_contabilidad.repository.TipoCuentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CuentaContableService {

    @Autowired
    private CuentaContableRepository repository;

    @Autowired
    private TipoCuentaRepository tipoRepository;

    public List<CuentaContable> findAll() {
        return repository.findAll();
    }

    public CuentaContable getById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Cuenta contable no encontrada"));
    }

    public CuentaContable create(CuentaContable cuenta) {
        // 1. Validar Tipo de Cuenta
        if (cuenta.getTipo() == null || cuenta.getTipo().getId() == null) {
            throw new IllegalArgumentException("El tipo de cuenta es obligatorio");
        }
        if (!tipoRepository.existsById(cuenta.getTipo().getId())) {
            throw new IllegalArgumentException("El tipo de cuenta con ID " + cuenta.getTipo().getId() + " no existe");
        }

        // 2. Validar Cuenta Mayor
        if (cuenta.getCuentaMayor() != null && cuenta.getCuentaMayor().getId() != null) {
            CuentaContable mayor = getById(cuenta.getCuentaMayor().getId());
            if (mayor.getPermiteMovimiento() != null && mayor.getPermiteMovimiento()) {
                throw new IllegalArgumentException("La cuenta superior '" + mayor.getNombre() + "' no puede ser padre porque permite movimientos directos (debe ser de agrupación)");
            }
        }
        return repository.save(cuenta);
    }

    public CuentaContable update(Long id, CuentaContable data) {
        CuentaContable existing = getById(id);
        
        // 1. Validar Tipo de Cuenta
        if (data.getTipo() == null || data.getTipo().getId() == null) {
            throw new IllegalArgumentException("El tipo de cuenta es obligatorio");
        }
        if (!tipoRepository.existsById(data.getTipo().getId())) {
            throw new IllegalArgumentException("El tipo de cuenta con ID " + data.getTipo().getId() + " no existe");
        }

        // 2. Validar Cuenta Mayor
        if (data.getCuentaMayor() != null && data.getCuentaMayor().getId() != null) {
            if (id.equals(data.getCuentaMayor().getId())) {
                throw new IllegalArgumentException("Una cuenta no puede ser su propia cuenta mayor");
            }
            CuentaContable mayor = getById(data.getCuentaMayor().getId());
            if (mayor.getPermiteMovimiento() != null && mayor.getPermiteMovimiento()) {
                throw new IllegalArgumentException("La cuenta superior '" + mayor.getNombre() + "' no puede ser padre porque permite movimientos directos");
            }
            existing.setCuentaMayor(data.getCuentaMayor());
        } else {
            existing.setCuentaMayor(null);
        }

        existing.setCodigo(data.getCodigo());
        existing.setNombre(data.getNombre());
        existing.setDescripcion(data.getDescripcion());
        existing.setPermiteMovimiento(data.getPermiteMovimiento());
        existing.setTipo(data.getTipo());
        existing.setNivel(data.getNivel());
        existing.setEstado(data.getEstado());
        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
