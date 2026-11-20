package uel.br.dto;

public record AlunoMediaGeralDto(
    String nome,
    String email,
    Double mediaGeral,
    Long avaliacoesConcluidas
) {}
