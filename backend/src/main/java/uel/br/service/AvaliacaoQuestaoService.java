package uel.br.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import uel.br.dao.AvaliacaoQuestaoDao;
import uel.br.model.AvaliacaoQuestao;

@Service
public class AvaliacaoQuestaoService {

    private final AvaliacaoQuestaoDao dao;

    public AvaliacaoQuestaoService(AvaliacaoQuestaoDao dao) {
        this.dao = dao;
    }

    private void validarValor(BigDecimal valor) {
        if (valor == null) {
            throw new IllegalArgumentException("O valor da questão é obrigatório.");
        }
        if (valor.compareTo(BigDecimal.ZERO) < 0 || valor.compareTo(BigDecimal.TEN) > 0) {
            throw new IllegalArgumentException("O valor da questão deve estar entre 0 e 10.");
        }
    }

    @Transactional
    public AvaliacaoQuestao criar(AvaliacaoQuestao aq) {
        if (aq.getId_avaliacao() == null || aq.getId_questao() == null) {
            throw new IllegalArgumentException("id_avaliacao e id_questao são obrigatórios.");
        }
        validarValor(aq.getValor());

        if (!dao.existeAvaliacao(aq.getId_avaliacao())) {
            throw new IllegalArgumentException("Avaliação não encontrada.");
        }
        if (!dao.existeQuestao(aq.getId_questao())) {
            throw new IllegalArgumentException("Questão não encontrada.");
        }
        if (dao.buscarPorId(aq.getId_avaliacao(), aq.getId_questao()).isPresent()) {
            throw new IllegalArgumentException("Esta questão já está vinculada a esta avaliação.");
        }

        dao.inserir(aq);
        return aq;
    }

    public List<AvaliacaoQuestao> listarTodos() {
        return dao.listarTodos();
    }

    public List<AvaliacaoQuestao> listarPorAvaliacao(Long idAvaliacao) {
        return dao.listarPorAvaliacao(idAvaliacao);
    }

    public AvaliacaoQuestao buscarPorId(Long idAvaliacao, Long idQuestao) {
        return dao.buscarPorId(idAvaliacao, idQuestao)
            .orElseThrow(() -> new IllegalArgumentException("Vínculo entre avaliação e questão não encontrado."));
    }

    @Transactional
    public AvaliacaoQuestao atualizar(Long idAvaliacao, Long idQuestao, AvaliacaoQuestao aq) {
        aq.setId_avaliacao(idAvaliacao);
        aq.setId_questao(idQuestao);
        validarValor(aq.getValor());

        int linhasAfetadas = dao.atualizar(aq);
        if (linhasAfetadas == 0) {
            throw new IllegalArgumentException("Vínculo entre avaliação e questão não encontrado.");
        }
        return aq;
    }

    @Transactional
    public void excluir(Long idAvaliacao, Long idQuestao) {
        int linhasAfetadas = dao.excluir(idAvaliacao, idQuestao);
        if (linhasAfetadas == 0) {
            throw new IllegalArgumentException("Vínculo entre avaliação e questão não encontrado.");
        }
    }
}