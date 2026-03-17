package com.contabilidad.unapec.backend_contabilidad.service;

import com.contabilidad.unapec.backend_contabilidad.model.TipoCuenta;
import com.contabilidad.unapec.backend_contabilidad.repository.TipoCuentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TipoCuentaService {

    @Autowired
    private TipoCuentaRepository repository;

    public List<TipoCuenta> findAll() {
        return repository.findAll();
    }

    public TipoCuenta getById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Tipo de cuenta no encontrado"));
    }

    public TipoCuenta create(TipoCuenta tipoCuenta) {
        return repository.save(tipoCuenta);
    }

    public TipoCuenta update(Long id, TipoCuenta data) {
        TipoCuenta existing = getById(id);
        existing.setNombre(data.getNombre());
        existing.setDescripcion(data.getDescripcion());
        existing.setOrigen(data.getOrigen());
        existing.setEstado(data.getEstado());
        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
