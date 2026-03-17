package com.contabilidad.unapec.backend_contabilidad.repository;

import com.contabilidad.unapec.backend_contabilidad.model.CuentaContable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CuentaContableRepository extends JpaRepository<CuentaContable, Long> {
}
