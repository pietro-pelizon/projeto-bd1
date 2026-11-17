package uel.br.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import uel.br.enums.TipoQuestoesEnum;
import uel.br.model.Alternativa;
import uel.br.model.Questao;

@Repository 
public class QuestaoDao {
    private final JdbcTemplate jdbcTemplate;

    public QuestaoDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Alternativa> alternativaRowMapper = (rs, rowNum) -> new Alternativa(
        rs.getLong("id_questao"),
        rs.getString("letra"),
        rs.getBoolean("correta"),
        rs.getString("texto")
    );

  

    private final RowMapper<Questao> questaoRowMapper = (rs, rowNum) -> {
        Long idQuestao = rs.getLong("id_questao");
        String enunciado = rs.getString("enunciado");
        TipoQuestoesEnum tipo = TipoQuestoesEnum.valueOf(rs.getString("tipo"));

        // Só busca as alternativas se a questão for de múltipla escolha
        List<Alternativa> alternativas = (tipo == TipoQuestoesEnum.MULTIPLA_ESCOLHA)
        ? buscarAlternativas(idQuestao)
        : new ArrayList<>();

        return new Questao(idQuestao, enunciado, tipo, alternativas);

    };

    private List<Alternativa> buscarAlternativas(Long idQuestao) {
        String sql = "SELECT id_questao, letra, correta, texto FROM alternativa WHERE id_questao = ? ORDER BY letra";
        return jdbcTemplate.query(sql, alternativaRowMapper, idQuestao);
    }

    public List<Questao> listarTodas() {
        String sql = """
            SELECT q.id_questao, q.enunciado,
                CASE WHEN qme.id_questao IS NOT NULL THEN 'MULTIPLA_ESCOLHA' ELSE 'DISCURSIVA' END AS tipo
            FROM questao q
            LEFT JOIN questao_multipla_escolha qme ON q.id_questao = qme.id_questao
            ORDER BY q.id_questao
        """;
        return jdbcTemplate.query(sql, questaoRowMapper);
   }

   public Long inserirQuestaoBase(String enunciado) {
    String sql = "INSERT INTO questao (enunciado) VALUES (?) RETURNING id_questao";
    return jdbcTemplate.queryForObject(sql, Long.class, enunciado);
   }

   public void inserirAlternativa(Long idQuestao, Alternativa alt) {
    String sql = "INSERT INTO alternativa (id_questao, letra, correta, texto) VALUES (?, ?, ?, ?)";
    jdbcTemplate.update(sql,
            idQuestao,
            alt.getLetra(),
            alt.isCorreta(),
            alt.getTexto()
        );
    }

   public void inserirMultiplaEscolha(Long idQuestao) {
     String sql = "INSERT INTO questao_multipla_escolha (id_questao) VALUES (?)";
     jdbcTemplate.update(sql, idQuestao);
   }

   public void inserirDiscursiva(Long idQuestao) {
    String sql = "INSERT INTO questao_discursiva (id_questao) VALUES (?)";
    jdbcTemplate.update(sql, idQuestao);
   }


   public Optional<Questao> buscarPorId(Long idQuestao) {
    String sql = """
    SELECT q.id_questao, q.enunciado, 
        CASE WHEN qme.id_questao IS NOT NULL THEN 'MULTIPLA_ESCOLHA' ELSE 'DISCURSIVA' END AS tipo
    FROM questao q
    LEFT JOIN questao_multipla_escolha qme ON q.id_questao = qme.id_questao
    WHERE q.id_questao = ?
    """;

    List<Questao> resultados = jdbcTemplate.query(sql, questaoRowMapper, idQuestao);
    return resultados.stream().findFirst(); 
   }

   public void atualizarEnunciado(Long id, String enunciado) {
    String sql = "UPDATE questao SET enunciado = ? WHERE id_questao = ?";
    jdbcTemplate.update(sql, enunciado, id);
   }

   public void excluirAlternativas(Long idQuestao) {
    String sql = "DELETE FROM alternativa WHERE id_questao = ?";
    jdbcTemplate.update(sql, idQuestao);
   }

   public boolean possuiRespostas(Long idQuestao) {
    String sql = "SELECT COUNT (*) FROM resposta  WHERE id_questao = ?";
    Integer count = jdbcTemplate.queryForObject(sql, Integer.class, idQuestao);

    return count != null && count > 0;

   }

   public int excluir(Long idQuestao) {
    String sql = "DELETE FROM questao WHERE id_questao = ?";
    return jdbcTemplate.update(sql, idQuestao);
   }




}