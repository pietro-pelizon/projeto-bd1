package uel.br.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import uel.br.model.Avaliacao;
import uel.br.service.AvaliacaoService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RestController 
@RequestMapping("/avaliacoes")
public class AvaliacaoController {

    private final AvaliacaoService service;

    public AvaliacaoController(AvaliacaoService service){
        this.service = service;
    }

    
    @PostMapping 
    public ResponseEntity<Void> criar(@Valid @RequestBody Avaliacao avaliacao){
        service.cadastrar(avaliacao);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("{id}")
    public ResponseEntity<Avaliacao> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<Avaliacao>> listarTodos() {
        return ResponseEntity.ok(service.listar());
    }

    @PutMapping("{id}")
    public ResponseEntity<Void> atualizar(@PathVariable Long id,@Valid @RequestBody Avaliacao avaliacao) {

        service.atualizar(id, avaliacao);

        return ResponseEntity.noContent().build();
    }
    
    @DeleteMapping("{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id){
        service.remover(id);
        return ResponseEntity.noContent().build();
    }


    
}
