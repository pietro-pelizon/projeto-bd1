package uel.br.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import uel.br.dao.AvaliacaoDao;
import uel.br.model.Avaliacao;

@Service 
public class AvaliacaoService {
    private final AvaliacaoDao dao;


    public AvaliacaoService(AvaliacaoDao dao){
        this.dao = dao;
    }

    // @Transactional garante a integridade dos dados caso alguma operação falhe
    @Transactional
    public void cadastrar(Avaliacao avaliacao) {
        if (dao.buscarPorTitulo(avaliacao.getTitulo()).isPresent()) {
            throw new IllegalArgumentException("Título já registrado no banco.");
        }

        if (!avaliacao.getHora_fim().isAfter(avaliacao.getHora_inicio())) {
            throw new IllegalArgumentException("A hora de término deve ser posterior à hora de início.");
        }

        dao.inserir(avaliacao);
    }

   @Transactional
        public void atualizar(Long id, Avaliacao novosDados) {
        if (!novosDados.getHora_fim().isAfter(novosDados.getHora_inicio())) {
            throw new IllegalArgumentException("A hora de término deve ser posterior à hora de início.");
        }

        var existente = dao.buscarPorTitulo(novosDados.getTitulo());
        if (existente.isPresent() && !existente.get().getId().equals(id)) {
            throw new IllegalArgumentException("Título já registrado em outra avaliação.");
        }

        novosDados.setId(id);
        int linhasAfetadas = dao.atualizar(novosDados);
        if (linhasAfetadas == 0) {
            throw new IllegalArgumentException("Avaliação não encontrada.");
        }
    }

    public List<Avaliacao> listar(){
        return dao.listarTodos();
    }

  
    @Transactional 
    public void remover(Long id){
            int linhasAfetadas = dao.excluir(id);
            if(linhasAfetadas == 0){
                throw new IllegalArgumentException("Avaliacao não encontrada.");
        }
    }
}
