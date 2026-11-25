package uel.br.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import uel.br.dao.AtribuicaoDao;
import uel.br.dao.AvaliacaoDao;
import uel.br.dao.UsuarioDao;
import uel.br.model.Atribuicao;
import uel.br.model.Usuario;

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
    
        Usuario usuario = usuarioDao.buscarPorId(atribuicao.getId_usuario()).orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));
        
        if (!"ALUNO".equals(usuario.getTipo())) {
            throw new IllegalArgumentException("Apenas usuários do tipo ALUNO podem receber avaliações.");
        }

        if (avaliacaoDao.buscarPorId(atribuicao.getId_avaliacao()).isEmpty()) {
            throw new IllegalArgumentException("Avaliação não encontrada.");
        }

        if (dao.buscarPorChave(atribuicao.getId_usuario(), atribuicao.getId_avaliacao()).isPresent()) {
            throw new IllegalArgumentException("Este usuário já possui atribuição para esta avaliação.");
        }

        if(!atribuicao.getStatus().equals("CONCLUIDO") && !atribuicao.getStatus().equals("EM_ANDAMENTO") && !atribuicao.getStatus().equals("NAO_INICIADO")) {
            throw new IllegalArgumentException("O status não é válido. Os status válidos são: CONCLUIDO, EM_ANDAMENTO e NAO_INICIADO.");
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

        if(!atribuicao.getStatus().equals("CONCLUIDO") && !atribuicao.getStatus().equals("EM_ANDAMENTO") && !atribuicao.getStatus().equals("NAO_INICIADO")) {
            throw new IllegalArgumentException("O status não é válido. Os status válidos são: CONCLUIDO, EM_ANDAMENTO e NAO_INICIADO.");
        }

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