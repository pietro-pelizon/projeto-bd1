package uel.br.dto;

public record QuestaoMaisDificilDto(
    Long idQuestao,
    String enunciado,
    Double mediaNota,
    Long totalRespostas
) {}
