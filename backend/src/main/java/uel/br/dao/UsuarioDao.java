package uel.br.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import uel.br.model.Usuario;


@Repository 
public class UsuarioDao {
    private final JdbcTemplate jdbcTemplate;

    public UsuarioDao(JdbcTemplate template){
        this.jdbcTemplate = template;
    }

    private final RowMapper<Usuario> rowMapper = (rs, rowNum) -> new Usuario(
        rs.getLong("id_usuario"),
        rs.getString("email"),
        rs.getString("nome"),
        rs.getString("senha")
    );

    public void inserir(Usuario usuario){
        String sql = "INSERT INTO usuario (email, nome, senha) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, usuario.getEmail(), usuario.getNome(), usuario.getSenha());
    }

    public List<Usuario> listarTodos(){
        String sql = "SELECT id, email, nome, senha FROM usuario ORDER BY nome";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public int excluir(Long id){
        String sql = "DELETE FROM usuario WHERE id_usuario = ?";
        return jdbcTemplate.update(sql, id);
    }

    public Optional<Usuario> buscarPorId(Long id){
        String sql = "SELECT id_usuario, email, nome, senha FROM usuario WHERE id_usuario = ?";
        List<Usuario> resultados = jdbcTemplate.query(sql, rowMapper, id);
        return resultados.stream().findFirst();
    }


    public Optional<Usuario> buscarPorEmail(String email) {
        String sql = "SELECT id_usuario, email, nome, senha FROM usuario WHERE email = ?";
        List<Usuario> resultados = jdbcTemplate.query(sql, rowMapper, email);
        return resultados.stream().findFirst();
    }


    public int atualizar(Usuario usuario){
        String sql = "UPDATE usuario SET email = ?, nome = ?, senha = ? WHERE id_usuario = ?";
        return jdbcTemplate.update(sql, usuario.getEmail(), usuario.getNome(), usuario.getSenha(), usuario.getId()); 
    }
}
