package com.contabilidad.unapec.backend_contabilidad.repository;

import com.contabilidad.unapec.backend_contabilidad.model.Auxiliar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuxiliarRepository extends JpaRepository<Auxiliar, Long> {
    
    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(MAX(a.id), 0) FROM Auxiliar a")
    Long findMaxId();
}
