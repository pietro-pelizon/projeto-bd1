package uel.br.model;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter 
@NoArgsConstructor
@AllArgsConstructor
public class Resposta {

    @NotNull 
    private Long id_usuario;

    @NotNull 
    private Long id_avaliacao;

    @NotNull 
    private Long id_questao;

    @Size(max = 3000)
    private String texto_resposta;


    private String letra_marcada;

    @DecimalMin("0.00")
    @DecimalMax("10.00")
    private BigDecimal nota;
}