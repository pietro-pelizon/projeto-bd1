package uel.br.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import uel.br.dao.RespostaDao;
import uel.br.model.Resposta;

@Service
public class RespostaService {

    private static final List<String> OPCOES_VALIDAS = List.of("A", "B", "C", "D", "E", "F", "G");

    private final RespostaDao dao;

    public RespostaService(RespostaDao dao) {
        this.dao = dao;
    }

    private void normalizarEValidarCampos(Resposta resposta) {
        if (resposta.getLetra_marcada() != null) {
            if (resposta.getLetra_marcada().isBlank()) {
                resposta.setLetra_marcada(null);
            } else {
                String letra = resposta.getLetra_marcada().trim().toUpperCase();
                if (!OPCOES_VALIDAS.contains(letra)) {
                    throw new IllegalArgumentException("letra_marcada inválida. Use uma letra de A até G.");
                }
                resposta.setLetra_marcada(letra);
            }
        }

        if (resposta.getNota() != null) {
            if (resposta.getNota().compareTo(BigDecimal.ZERO) < 0 || resposta.getNota().compareTo(BigDecimal.TEN) > 0) {
                throw new IllegalArgumentException("A nota deve estar entre 0 e 10.");
            }
        }
    }

    @Transactional
    public Resposta criar(Resposta resposta) {
        if (resposta.getId_usuario() == null || resposta.getId_avaliacao() == null || resposta.getId_questao() == null) {
            throw new IllegalArgumentException("id_usuario, id_avaliacao e id_questao são obrigatórios.");
        }

        normalizarEValidarCampos(resposta);

        if (!dao.existeAtribuicao(resposta.getId_usuario(), resposta.getId_avaliacao())) {
            throw new IllegalArgumentException("Atribuição (usuário + avaliação) não encontrada.");
        }
        if (!dao.existeQuestao(resposta.getId_questao())) {
            throw new IllegalArgumentException("Questão não encontrada.");
        }
        if (dao.buscarPorId(resposta.getId_usuario(), resposta.getId_avaliacao(), resposta.getId_questao()).isPresent()) {
            throw new IllegalArgumentException("Já existe uma resposta registrada para este usuário, avaliação e questão.");
        }

        dao.inserir(resposta);
        return resposta;
    }

    public List<Resposta> listarTodos() {
        return dao.listarTodos();
    }

    public List<Resposta> listarPorAtribuicao(Long idUsuario, Long idAvaliacao) {
        return dao.listarPorAtribuicao(idUsuario, idAvaliacao);
    }

    public Resposta buscarPorId(Long idUsuario, Long idAvaliacao, Long idQuestao) {
        return dao.buscarPorId(idUsuario, idAvaliacao, idQuestao)
            .orElseThrow(() -> new IllegalArgumentException("Resposta não encontrada."));
    }

    @Transactional
    public Resposta atualizar(Long idUsuario, Long idAvaliacao, Long idQuestao, Resposta resposta) {
        resposta.setId_usuario(idUsuario);
        resposta.setId_avaliacao(idAvaliacao);
        resposta.setId_questao(idQuestao);

        normalizarEValidarCampos(resposta);

        int linhasAfetadas = dao.atualizar(resposta);
        if (linhasAfetadas == 0) {
            throw new IllegalArgumentException("Resposta não encontrada.");
        }
        return resposta;
    }

    @Transactional
    public void excluir(Long idUsuario, Long idAvaliacao, Long idQuestao) {
        int linhasAfetadas = dao.excluir(idUsuario, idAvaliacao, idQuestao);
        if (linhasAfetadas == 0) {
            throw new IllegalArgumentException("Resposta não encontrada.");
        }
    }
}