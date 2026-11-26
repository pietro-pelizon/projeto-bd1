package uel.br.dao;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import uel.br.model.Resposta;

@Repository
public class RespostaDao {

    private final JdbcTemplate jdbcTemplate;

    public RespostaDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Resposta> rowMapper = (rs, rowNum) -> new Resposta(
        rs.getLong("id_usuario"),
        rs.getLong("id_avaliacao"),
        rs.getLong("id_questao"),
        rs.getString("texto_resposta"),
        rs.getString("letra_marcada"),
        rs.getBigDecimal("nota")
    );

    public void inserir(Resposta resposta) {
        String sql = "INSERT INTO resposta (id_usuario, id_avaliacao, id_questao, texto_resposta, letra_marcada, nota) VALUES (?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(
            sql,
            resposta.getId_usuario(),
            resposta.getId_avaliacao(),
            resposta.getId_questao(),
            resposta.getTexto_resposta(),
            resposta.getLetra_marcada(),
            resposta.getNota()
        );
    }

    public List<Resposta> listarTodos() {
        String sql = "SELECT id_usuario, id_avaliacao, id_questao, texto_resposta, letra_marcada, nota FROM resposta ORDER BY id_usuario, id_avaliacao, id_questao";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public List<Resposta> listarPorAtribuicao(Long idUsuario, Long idAvaliacao) {
        String sql = "SELECT id_usuario, id_avaliacao, id_questao, texto_resposta, letra_marcada, nota FROM resposta WHERE id_usuario = ? AND id_avaliacao = ? ORDER BY id_questao";
        return jdbcTemplate.query(sql, rowMapper, idUsuario, idAvaliacao);
    }

    public Optional<Resposta> buscarPorId(Long idUsuario, Long idAvaliacao, Long idQuestao) {
        String sql = "SELECT id_usuario, id_avaliacao, id_questao, texto_resposta, letra_marcada, nota FROM resposta WHERE id_usuario = ? AND id_avaliacao = ? AND id_questao = ?";
        List<Resposta> resultados = jdbcTemplate.query(sql, rowMapper, idUsuario, idAvaliacao, idQuestao);
        return resultados.stream().findFirst();
    }

    public int atualizar(Resposta resposta) {
        String sql = "UPDATE resposta SET texto_resposta = ?, letra_marcada = ?, nota = ? WHERE id_usuario = ? AND id_avaliacao = ? AND id_questao = ?";
        return jdbcTemplate.update(
            sql,
            resposta.getTexto_resposta(),
            resposta.getLetra_marcada(),
            resposta.getNota(),
            resposta.getId_usuario(),
            resposta.getId_avaliacao(),
            resposta.getId_questao()
        );
    }

    public int excluir(Long idUsuario, Long idAvaliacao, Long idQuestao) {
        String sql = "DELETE FROM resposta WHERE id_usuario = ? AND id_avaliacao = ? AND id_questao = ?";
        return jdbcTemplate.update(sql, idUsuario, idAvaliacao, idQuestao);
    }

    public boolean existeAtribuicao(Long idUsuario, Long idAvaliacao) {
        Integer count = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM atribuicao WHERE id_usuario = ? AND id_avaliacao = ?",
            Integer.class, idUsuario, idAvaliacao);
        return count != null && count > 0;
    }

    public boolean existeQuestao(Long idQuestao) {
        Integer count = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM questao WHERE id_questao = ?", Integer.class, idQuestao);
        return count != null && count > 0;
    }
}