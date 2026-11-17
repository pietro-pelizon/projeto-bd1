package uel.br.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import uel.br.enums.TipoQuestoesEnum;

@AllArgsConstructor 
@NoArgsConstructor 
@Getter 
@Setter 

public class Questao {
    
    private Long id;

    @NotBlank(message = "O enunciado da questão é obrigatório")
    private String enunciado;

    @NotNull(message = "O tipo da questão é obrigatório")
    private TipoQuestoesEnum tipo; 

    @Valid 
    private List<Alternativa> alternativas = new ArrayList<>();    

    

}
