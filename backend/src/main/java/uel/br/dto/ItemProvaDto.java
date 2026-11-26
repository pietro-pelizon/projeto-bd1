package uel.br.dto;

import java.math.BigDecimal;

// Dados de uma questão dentro de uma avaliação
public record ItemProvaDto(
    BigDecimal valor,
    boolean discursiva
) {}
