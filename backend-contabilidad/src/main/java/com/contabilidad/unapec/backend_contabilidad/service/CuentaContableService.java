package com.contabilidad.unapec.backend_contabilidad.service;

import com.contabilidad.unapec.backend_contabilidad.model.CuentaContable;
import com.contabilidad.unapec.backend_contabilidad.repository.CuentaContableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CuentaContableService {

    @Autowired
    private CuentaContableRepository repository;

    public List<CuentaContable> findAll() {
        return repository.findAll();
    }

    public CuentaContable getById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Cuenta contable no encontrada"));
    }

    public CuentaContable create(CuentaContable cuenta) {
        return repository.save(cuenta);
    }

    public CuentaContable update(Long id, CuentaContable data) {
        CuentaContable existing = getById(id);
        existing.setCodigo(data.getCodigo());
        existing.setNombre(data.getNombre());
        existing.setDescripcion(data.getDescripcion());
        existing.setPermiteMovimiento(data.getPermiteMovimiento());
        existing.setTipo(data.getTipo());
        existing.setNivel(data.getNivel());
        existing.setCuentaMayor(data.getCuentaMayor());
        existing.setEstado(data.getEstado());
        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
