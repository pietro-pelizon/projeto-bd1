package uel.br.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor 
@NoArgsConstructor
@Getter 
@Setter 
public class Alternativa {

    private Long idQuestao;

    @NotBlank
    @Pattern(regexp = "^[A-G]$", message = "Letra deve estar entre A e G")
    private String letra;

    private boolean correta = false;

    @NotBlank 
    private String texto;
    


}
