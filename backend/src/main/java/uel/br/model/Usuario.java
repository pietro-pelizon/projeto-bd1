package uel.br.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter 
@Setter
@AllArgsConstructor
@NoArgsConstructor   
public class Usuario {
    static final String REGEX_EMAIL = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)+$";

    private Long id;

    @NotBlank 
    @Pattern(regexp = REGEX_EMAIL)
    @Size(max = 320)
    private String email;

    @NotBlank
    @Size(max = 100)
    private String nome;

    @NotBlank
    @Size(max = 64)
    private String senha;

    @NotBlank
    @Size(max = 20)
    private String tipo;

}
