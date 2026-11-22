package uel.br.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import uel.br.dto.AlunoMediaGeralDto;
import uel.br.dto.QuestaoMaisDificilDto;
import uel.br.dto.QuestaoMaisErrosDto;
import uel.br.service.RelatorioService;

@RestController
@RequestMapping("/relatorios")
public class RelatorioController {

    private final RelatorioService relatorioService;

    public RelatorioController(RelatorioService relatorioService) {
        this.relatorioService = relatorioService;
    }

    @GetMapping("/alunos-media")
    public ResponseEntity<List<AlunoMediaGeralDto>> mediaGeralPorAluno() {
        return ResponseEntity.ok(relatorioService.obterMediaGeralPorAluno());
    }

    @GetMapping("/questoes-dificeis")
    public ResponseEntity<List<QuestaoMaisDificilDto>> questoesMaisDificeis() {
        return ResponseEntity.ok(relatorioService.obterQuestoesMaisDificeis());
    }

    @GetMapping("/questoes-erros")
    public ResponseEntity<List<QuestaoMaisErrosDto>> questoesMaisErros() {
        return ResponseEntity.ok(relatorioService.obterQuestoesMaisErros());
    }
}