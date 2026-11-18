package uel.br.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import uel.br.model.AvaliacaoQuestao;
import uel.br.service.AvaliacaoQuestaoService;

@RestController
@RequestMapping("/avaliacoes-questoes")
public class AvaliacaoQuestaoController {

    private final AvaliacaoQuestaoService service;

    public AvaliacaoQuestaoController(AvaliacaoQuestaoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<AvaliacaoQuestao> criar(@RequestBody AvaliacaoQuestao aq) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(aq));
    }

    @GetMapping
    public ResponseEntity<List<AvaliacaoQuestao>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/avaliacao/{idAvaliacao}")
    public ResponseEntity<List<AvaliacaoQuestao>> listarPorAvaliacao(@PathVariable Long idAvaliacao) {
        return ResponseEntity.ok(service.listarPorAvaliacao(idAvaliacao));
    }

    @GetMapping("/{idAvaliacao}/{idQuestao}")
    public ResponseEntity<AvaliacaoQuestao> buscarPorId(
            @PathVariable Long idAvaliacao,
            @PathVariable Long idQuestao) {
        return ResponseEntity.ok(service.buscarPorId(idAvaliacao, idQuestao));
    }

    @PutMapping("/{idAvaliacao}/{idQuestao}")
    public ResponseEntity<AvaliacaoQuestao> atualizar(
            @PathVariable Long idAvaliacao,
            @PathVariable Long idQuestao,
            @RequestBody AvaliacaoQuestao aq) {
        return ResponseEntity.ok(service.atualizar(idAvaliacao, idQuestao, aq));
    }

    @DeleteMapping("/{idAvaliacao}/{idQuestao}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long idAvaliacao,
            @PathVariable Long idQuestao) {
        service.excluir(idAvaliacao, idQuestao);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
}