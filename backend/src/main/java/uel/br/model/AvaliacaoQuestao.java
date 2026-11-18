package uel.br.model;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvaliacaoQuestao {

    @NotNull 
    private Long id_avaliacao;

    @NotNull 
    private Long id_questao;

    @NotNull 
    private BigDecimal valor;
}