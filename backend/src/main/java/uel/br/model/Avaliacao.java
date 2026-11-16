package uel.br.model;

import java.sql.Date;
import java.sql.Timestamp;

import jakarta.validation.constraints.NotBlank;
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

    Long id;

    @NotBlank 
    @Size(max = 100)
    private String titulo;

    @Size(max = 300)
    private String descricao;

    @NotBlank
    private Date data;

    @NotBlank 
    private Timestamp hora_inicio;

    @NotBlank
    private Timestamp hora_fim;

}
