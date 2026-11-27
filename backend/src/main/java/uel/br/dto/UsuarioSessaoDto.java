package uel.br.dto;

// O que o frontend recebe depois do login (nunca devolve a senha).
public record UsuarioSessaoDto(Long id, String nome, String email, String tipo) {
}
