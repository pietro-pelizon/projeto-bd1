package uel.br.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter 
@Setter
@AllArgsConstructor
@NoArgsConstructor  
    public class Atribuicao {

    @NotNull 
    private Long id_usuario;

    @NotNull 
    private Long id_avaliacao;

    @NotBlank 
    @Size(max = 30)
    private String status;

}
