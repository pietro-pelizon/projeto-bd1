package uel.br.dao;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import uel.br.dto.ItemProvaDto;
import uel.br.dto.NotaTotalDto;
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

    // FOR UPDATE trava a atribuição até o fim da transação
    public Optional<String> buscarStatusAtribuicao(Long idUsuario, Long idAvaliacao) {
        String sql = "SELECT status FROM atribuicao WHERE id_usuario = ? AND id_avaliacao = ? FOR UPDATE";
        return jdbcTemplate.query(sql, (rs, rowNum) -> rs.getString("status"), idUsuario, idAvaliacao)
            .stream().findFirst();
    }

    // Vazio quando a questão não faz parte da avaliação
    public Optional<ItemProvaDto> buscarItemProva(Long idAvaliacao, Long idQuestao) {
        String sql = """
            SELECT aq.valor, (qd.id_questao IS NOT NULL) AS discursiva
            FROM avaliacao_questao aq
            LEFT JOIN questao_discursiva qd ON qd.id_questao = aq.id_questao
            WHERE aq.id_avaliacao = ? AND aq.id_questao = ?
            """;
        return jdbcTemplate.query(sql,
                (rs, rowNum) -> new ItemProvaDto(rs.getBigDecimal("valor"), rs.getBoolean("discursiva")),
                idAvaliacao, idQuestao)
            .stream().findFirst();
    }

    // Vazio quando a letra não existe na questão; senão, diz se é a correta
    public Optional<Boolean> buscarGabarito(Long idQuestao, String letra) {
        String sql = "SELECT correta FROM alternativa WHERE id_questao = ? AND letra = ?";
        return jdbcTemplate.query(sql, (rs, rowNum) -> rs.getBoolean("correta"), idQuestao, letra)
            .stream().findFirst();
    }

    public void marcarEmAndamento(Long idUsuario, Long idAvaliacao) {
        String sql = "UPDATE atribuicao SET status = 'EM_ANDAMENTO' WHERE id_usuario = ? AND id_avaliacao = ? AND status = 'NAO_INICIADO'";
        jdbcTemplate.update(sql, idUsuario, idAvaliacao);
    }

    public int atualizarNota(Long idUsuario, Long idAvaliacao, Long idQuestao, BigDecimal nota) {
        String sql = "UPDATE resposta SET nota = ? WHERE id_usuario = ? AND id_avaliacao = ? AND id_questao = ?";
        return jdbcTemplate.update(sql, nota, idUsuario, idAvaliacao, idQuestao);
    }

    public NotaTotalDto calcularNotaTotal(Long idUsuario, Long idAvaliacao) {
        String sql = """
            SELECT
                COALESCE(SUM(r.nota), 0) AS nota_total,
                COALESCE(SUM(aq.valor), 0) AS valor_total,
                COUNT(CASE WHEN r.id_usuario IS NOT NULL AND r.nota IS NULL THEN 1 END) AS pendentes
            FROM avaliacao_questao aq
            LEFT JOIN resposta r
                   ON r.id_avaliacao = aq.id_avaliacao
                  AND r.id_questao = aq.id_questao
                  AND r.id_usuario = ?
            WHERE aq.id_avaliacao = ?
            """;
        return jdbcTemplate.query(sql,
                (rs, rowNum) -> new NotaTotalDto(
                    rs.getBigDecimal("nota_total"),
                    rs.getBigDecimal("valor_total"),
                    rs.getLong("pendentes")),
                idUsuario, idAvaliacao)
            .get(0);
    }
}