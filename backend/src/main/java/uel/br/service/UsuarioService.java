package uel.br.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import uel.br.dao.UsuarioDao;
import uel.br.model.Usuario;

@Service 
public class UsuarioService {
    private final UsuarioDao dao;


    public UsuarioService(UsuarioDao dao){
        this.dao = dao;
    }

    // @Transactional garante a integridade dos dados caso alguma operação falhe
    @Transactional
    public void cadastrar(Usuario usuario) {
        if (dao.buscarPorEmail(usuario.getEmail()).isPresent()) {
            throw new IllegalArgumentException("E-mail já registrado no banco.");
        }

        dao.inserir(usuario);
    }

    @Transactional
    public void atualizar(Long id, Usuario novosDados){
        novosDados.setId(id);
        int linhasAfetadas = dao.atualizar(novosDados);
        if(linhasAfetadas == 0){
            throw new IllegalArgumentException("Usuário não encontrado");
        }
    }

    public List<Usuario> listar(){
        return dao.listarTodos();
    }

  
    @Transactional 
    public void remover(Long id){
            int linhasAfetadas = dao.excluir(id);
            if(linhasAfetadas == 0){
                throw new IllegalArgumentException("Usuário não encontrado.");
        }
    }
}
