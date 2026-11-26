package uel.br.dto;

import java.math.BigDecimal;

public record NotaTotalDto(
    BigDecimal notaTotal,
    BigDecimal valorTotal,
    Long pendentesCorrecao
) {}
