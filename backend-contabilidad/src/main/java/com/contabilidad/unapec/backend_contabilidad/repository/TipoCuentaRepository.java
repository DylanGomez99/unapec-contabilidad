package com.contabilidad.unapec.backend_contabilidad.repository;

import com.contabilidad.unapec.backend_contabilidad.model.TipoCuenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoCuentaRepository extends JpaRepository<TipoCuenta, Long> {
}
