package uel.br.dto;

public record QuestaoMaisErrosDto(
    Long idQuestao,
    String enunciado,
    Long quantidadeErros,
    Long totalRespotas,
    Double taxa_erros
) {}
