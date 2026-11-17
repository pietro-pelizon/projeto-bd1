package uel.br.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import uel.br.dao.AtribuicaoDao;
import uel.br.dao.AvaliacaoDao;
import uel.br.dao.UsuarioDao;
import uel.br.model.Atribuicao;

@Service
public class AtribuicaoService {

    private final AtribuicaoDao dao;
    private final UsuarioDao usuarioDao;
    private final AvaliacaoDao avaliacaoDao;

    public AtribuicaoService(AtribuicaoDao dao, UsuarioDao usuarioDao, AvaliacaoDao avaliacaoDao) {
        this.dao = dao;
        this.usuarioDao = usuarioDao;
        this.avaliacaoDao = avaliacaoDao;
    }

    @Transactional
    public void criar(Atribuicao atribuicao) {
        if (usuarioDao.buscarPorId(atribuicao.getId_usuario()).isEmpty()) {
            throw new IllegalArgumentException("Usuário não encontrado.");
        }

        if (avaliacaoDao.buscarPorId(atribuicao.getId_avaliacao()).isEmpty()) {
            throw new IllegalArgumentException("Avaliação não encontrada.");
        }

        if (dao.buscarPorChave(atribuicao.getId_usuario(), atribuicao.getId_avaliacao()).isPresent()) {
            throw new IllegalArgumentException("Este usuário já possui atribuição para esta avaliação.");
        }

        if (atribuicao.getStatus() == null || atribuicao.getStatus().isBlank()) {
            atribuicao.setStatus("PENDENTE");
        }

        dao.inserir(atribuicao);
    }

    public List<Atribuicao> listarTodos() {
        return dao.listarTodos();
    }

    public Atribuicao buscarPorChave(Long idUsuario, Long idAvaliacao) {
        return dao.buscarPorChave(idUsuario, idAvaliacao)
            .orElseThrow(() -> new IllegalArgumentException("Atribuição não encontrada."));
    }

    @Transactional
    public void atualizar(Long idUsuario, Long idAvaliacao, Atribuicao atribuicao) {
        atribuicao.setId_usuario(idUsuario);
        atribuicao.setId_avaliacao(idAvaliacao);

        int linhasAfetadas = dao.atualizar(atribuicao);
        if (linhasAfetadas == 0) {
            throw new IllegalArgumentException("Atribuição não encontrada.");
        }
    }

    @Transactional
    public void remover(Long idUsuario, Long idAvaliacao) {
        int linhasAfetadas = dao.excluir(idUsuario, idAvaliacao);
        if (linhasAfetadas == 0) {
            throw new IllegalArgumentException("Atribuição não encontrada.");
        }
    }
}