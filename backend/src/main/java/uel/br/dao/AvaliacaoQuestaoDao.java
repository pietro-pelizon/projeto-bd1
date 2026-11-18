package uel.br.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import uel.br.model.AvaliacaoQuestao;

@Repository
public class AvaliacaoQuestaoDao {

    private final JdbcTemplate jdbcTemplate;

    public AvaliacaoQuestaoDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<AvaliacaoQuestao> rowMapper = (rs, rowNum) -> new AvaliacaoQuestao(
        rs.getLong("id_avaliacao"),
        rs.getLong("id_questao"),
        rs.getBigDecimal("valor")
    );

    public void inserir(AvaliacaoQuestao aq) {
        String sql = "INSERT INTO avaliacao_questao (id_avaliacao, id_questao, valor) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, aq.getId_avaliacao(), aq.getId_questao(), aq.getValor());
    }

    public List<AvaliacaoQuestao> listarTodos() {
        String sql = "SELECT id_avaliacao, id_questao, valor FROM avaliacao_questao ORDER BY id_avaliacao, id_questao";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public List<AvaliacaoQuestao> listarPorAvaliacao(Long idAvaliacao) {
        String sql = "SELECT id_avaliacao, id_questao, valor FROM avaliacao_questao WHERE id_avaliacao = ? ORDER BY id_questao";
        return jdbcTemplate.query(sql, rowMapper, idAvaliacao);
    }

    public Optional<AvaliacaoQuestao> buscarPorId(Long idAvaliacao, Long idQuestao) {
        String sql = "SELECT id_avaliacao, id_questao, valor FROM avaliacao_questao WHERE id_avaliacao = ? AND id_questao = ?";
        List<AvaliacaoQuestao> resultados = jdbcTemplate.query(sql, rowMapper, idAvaliacao, idQuestao);
        return resultados.stream().findFirst();
    }

    public int atualizar(AvaliacaoQuestao aq) {
        String sql = "UPDATE avaliacao_questao SET valor = ? WHERE id_avaliacao = ? AND id_questao = ?";
        return jdbcTemplate.update(sql, aq.getValor(), aq.getId_avaliacao(), aq.getId_questao());
    }

    public int excluir(Long idAvaliacao, Long idQuestao) {
        String sql = "DELETE FROM avaliacao_questao WHERE id_avaliacao = ? AND id_questao = ?";
        return jdbcTemplate.update(sql, idAvaliacao, idQuestao);
    }

    public boolean existeAvaliacao(Long idAvaliacao) {
        Integer count = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM avaliacao WHERE id_avaliacao = ?", Integer.class, idAvaliacao);
        return count != null && count > 0;
    }

    public boolean existeQuestao(Long idQuestao) {
        Integer count = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM questao WHERE id_questao = ?", Integer.class, idQuestao);
        return count != null && count > 0;
    }
}