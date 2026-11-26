package uel.br.dto;

import java.math.BigDecimal;

// Corpo da requisição de correção do professor: {"nota": 2.0}
public record CorrecaoDto(
    BigDecimal nota
) {}
