package uel.br.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import uel.br.model.Atribuicao;

@Repository
public class AtribuicaoDao {
    private final JdbcTemplate jdbcTemplate;

    public AtribuicaoDao(JdbcTemplate template) {
        this.jdbcTemplate = template;
    }

    private final RowMapper<Atribuicao> rowMapper = (rs, rowNum) -> new Atribuicao(
        rs.getLong("id_usuario"),
        rs.getLong("id_avaliacao"),
        rs.getString("status")
    );

    public void inserir(Atribuicao atribuicao) {
        String sql = "INSERT INTO atribuicao (id_usuario, id_avaliacao, status) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, atribuicao.getId_usuario(), atribuicao.getId_avaliacao(), atribuicao.getStatus());
    }

    public List<Atribuicao> listarTodos() {
        String sql = "SELECT id_usuario, id_avaliacao, status FROM atribuicao ORDER BY id_avaliacao";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public int excluir(Long idUsuario, Long idAvaliacao) {
        String sql = "DELETE FROM atribuicao WHERE id_usuario = ? AND id_avaliacao = ?";
        return jdbcTemplate.update(sql, idUsuario, idAvaliacao);
    }

    public Optional<Atribuicao> buscarPorChave(Long idUsuario, Long idAvaliacao) {
        String sql = "SELECT id_usuario, id_avaliacao, status FROM atribuicao WHERE id_usuario = ? AND id_avaliacao = ?";
        List<Atribuicao> resultados = jdbcTemplate.query(sql, rowMapper, idUsuario, idAvaliacao);
        return resultados.stream().findFirst();
    }

    public int atualizar(Atribuicao atribuicao) {
        String sql = "UPDATE atribuicao SET status = ? WHERE id_usuario = ? AND id_avaliacao = ?";
        return jdbcTemplate.update(sql, atribuicao.getStatus(), atribuicao.getId_usuario(), atribuicao.getId_avaliacao());
    }
}