package com.contabilidad.unapec.backend_contabilidad.service;

import com.contabilidad.unapec.backend_contabilidad.model.Auxiliar;
import com.contabilidad.unapec.backend_contabilidad.repository.AuxiliarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuxiliarService {

    @Autowired
    private AuxiliarRepository repository;

    public List<Auxiliar> findAll() {
        return repository.findAll();
    }

    public Auxiliar getById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Auxiliar no encontrado"));
    }

    public Auxiliar create(Auxiliar auxiliar) {
        if (auxiliar.getId() == null) {
            auxiliar.setId(repository.findMaxId() + 1);
        }
        return repository.save(auxiliar);
    }

    public Auxiliar update(Long id, Auxiliar data) {
        Auxiliar existing = getById(id);
        existing.setNombre(data.getNombre());
        existing.setDescripcion(data.getDescripcion());
        existing.setEstado(data.getEstado());
        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
