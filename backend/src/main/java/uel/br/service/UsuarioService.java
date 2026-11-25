package uel.br.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import uel.br.dao.UsuarioDao;
import uel.br.model.Usuario;

@Service
public class UsuarioService {
    private static final List<String> TIPOS_VALIDOS = List.of("ALUNO", "PROFESSOR");
    private final UsuarioDao dao;

    public UsuarioService(UsuarioDao dao) {
        this.dao = dao;
    }

    private void validarTipo(Usuario usuario) {
        if (usuario.getTipo() == null || usuario.getTipo().isBlank()) {
        throw new IllegalArgumentException("Tipo inválido. Use ALUNO ou PROFESSOR.");
    }
        String tipoNormalizado = usuario.getTipo().trim().toUpperCase();
        if (!TIPOS_VALIDOS.contains(tipoNormalizado)) {
            throw new IllegalArgumentException("Tipo inválido. Use ALUNO ou PROFESSOR.");
        }
        usuario.setTipo(tipoNormalizado);
    }

    @Transactional
    public void cadastrar(Usuario usuario) {
        validarTipo(usuario);

        if (dao.buscarPorEmail(usuario.getEmail()).isPresent()) {
            throw new IllegalArgumentException("E-mail já registrado no banco.");
        }

        dao.inserir(usuario);
    }

    @Transactional
    public void atualizar(Long id, Usuario novosDados) {
        validarTipo(novosDados);

        var existente = dao.buscarPorEmail(novosDados.getEmail());
        if (existente.isPresent() && !existente.get().getId().equals(id)) {
        throw new IllegalArgumentException("E-mail já registrado em outro usuário.");
    }

        novosDados.setId(id);
        int linhasAfetadas = dao.atualizar(novosDados);
        if (linhasAfetadas == 0) {
            throw new IllegalArgumentException("Usuário não encontrado.");
        }
    }

    public List<Usuario> listar() {
        return dao.listarTodos();
    }

    @Transactional
    public void remover(Long id) {
        int linhasAfetadas = dao.excluir(id);
        if (linhasAfetadas == 0) {
            throw new IllegalArgumentException("Usuário não encontrado.");
        }
    }
}