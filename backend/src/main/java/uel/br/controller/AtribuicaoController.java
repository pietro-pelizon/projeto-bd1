package uel.br.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import uel.br.model.Atribuicao;
import uel.br.service.AtribuicaoService;

@RestController
@RequestMapping("/atribuicoes")
public class AtribuicaoController {
    private final AtribuicaoService service;

    public AtribuicaoController(AtribuicaoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Void> criar(@Valid @RequestBody Atribuicao atribuicao) {
        service.criar(atribuicao);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    public ResponseEntity<List<Atribuicao>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{idUsuario}/{idAvaliacao}")
    public ResponseEntity<Atribuicao> buscarPorChave(
            @PathVariable Long idUsuario,
            @PathVariable Long idAvaliacao) {
        return ResponseEntity.ok(service.buscarPorChave(idUsuario, idAvaliacao));
    }

    @PutMapping("/{idUsuario}/{idAvaliacao}")
    public ResponseEntity<Void> atualizar(
            @PathVariable Long idUsuario,
            @PathVariable Long idAvaliacao,
            @RequestBody Atribuicao atribuicao) {
        service.atualizar(idUsuario, idAvaliacao, atribuicao);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{idUsuario}/{idAvaliacao}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long idUsuario,
            @PathVariable Long idAvaliacao) {
        service.remover(idUsuario, idAvaliacao);
        return ResponseEntity.noContent().build();
    }
}
