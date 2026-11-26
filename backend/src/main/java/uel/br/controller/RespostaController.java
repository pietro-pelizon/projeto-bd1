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

import uel.br.dto.CorrecaoDto;
import uel.br.dto.NotaTotalDto;
import uel.br.model.Resposta;
import uel.br.service.RespostaService;

@RestController
@RequestMapping("/respostas")
public class RespostaController {

    private final RespostaService service;

    public RespostaController(RespostaService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Resposta> criar(@RequestBody Resposta resposta) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(resposta));
    }

    @GetMapping
    public ResponseEntity<List<Resposta>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/atribuicao/{idUsuario}/{idAvaliacao}")
    public ResponseEntity<List<Resposta>> listarPorAtribuicao(
            @PathVariable Long idUsuario,
            @PathVariable Long idAvaliacao) {
        return ResponseEntity.ok(service.listarPorAtribuicao(idUsuario, idAvaliacao));
    }

    @GetMapping("/{idUsuario}/{idAvaliacao}/{idQuestao}")
    public ResponseEntity<Resposta> buscarPorId(
            @PathVariable Long idUsuario,
            @PathVariable Long idAvaliacao,
            @PathVariable Long idQuestao) {
        return ResponseEntity.ok(service.buscarPorId(idUsuario, idAvaliacao, idQuestao));
    }

    @PutMapping("/{idUsuario}/{idAvaliacao}/{idQuestao}")
    public ResponseEntity<Resposta> atualizar(
            @PathVariable Long idUsuario,
            @PathVariable Long idAvaliacao,
            @PathVariable Long idQuestao,
            @RequestBody Resposta resposta) {
        return ResponseEntity.ok(service.atualizar(idUsuario, idAvaliacao, idQuestao, resposta));
    }

    @PutMapping("/{idUsuario}/{idAvaliacao}/{idQuestao}/nota")
    public ResponseEntity<Resposta> corrigir(
            @PathVariable Long idUsuario,
            @PathVariable Long idAvaliacao,
            @PathVariable Long idQuestao,
            @RequestBody CorrecaoDto correcao) {
        return ResponseEntity.ok(service.corrigir(idUsuario, idAvaliacao, idQuestao, correcao.nota()));
    }

    @GetMapping("/atribuicao/{idUsuario}/{idAvaliacao}/total")
    public ResponseEntity<NotaTotalDto> notaTotal(
            @PathVariable Long idUsuario,
            @PathVariable Long idAvaliacao) {
        return ResponseEntity.ok(service.calcularNotaTotal(idUsuario, idAvaliacao));
    }

    @DeleteMapping("/{idUsuario}/{idAvaliacao}/{idQuestao}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long idUsuario,
            @PathVariable Long idAvaliacao,
            @PathVariable Long idQuestao) {
        service.excluir(idUsuario, idAvaliacao, idQuestao);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
}