package uel.br.model;

import java.time.LocalDate;
import java.time.LocalTime;

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
public class Avaliacao {

    private Long id;

    @NotBlank 
    @Size(max = 100)
    private String titulo;

    @Size(max = 300)
    private String descricao;

    @NotNull 
    private LocalDate data;

    @NotNull
    private LocalTime hora_inicio;

    @NotNull
    private LocalTime hora_fim;

}
