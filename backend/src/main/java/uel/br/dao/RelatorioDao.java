package uel.br.dao;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import uel.br.dto.AlunoMediaGeralDto;
import uel.br.dto.QuestaoMaisDificilDto;
import uel.br.dto.QuestaoMaisErrosDto;

@Repository
public class RelatorioDao {

    private final JdbcTemplate jdbcTemplate;

    public RelatorioDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<AlunoMediaGeralDto> alunoMediaGeralMapper = (rs, rowNum) -> new AlunoMediaGeralDto(
        rs.getString("nome"),
        rs.getString("email"),
        rs.getDouble("media_geral"),
        rs.getLong("avaliacoes_concluidas")
    );

    private final RowMapper<QuestaoMaisDificilDto> questaoMaisDificilMapper = (rs, rowNum) -> new QuestaoMaisDificilDto(
        rs.getLong("id_questao"),
        rs.getString("enunciado"),
        rs.getDouble("media_nota"),
        rs.getLong("total_respostas")
    );

    private final RowMapper<QuestaoMaisErrosDto> questaoMaisErrosMapper = (rs, rowNum) -> new QuestaoMaisErrosDto(
        rs.getLong("id_questao"),
        rs.getString("enunciado"),
        rs.getLong("total_erros"),
        rs.getLong("total_respostas"),
        rs.getDouble("taxa_erro")
    );

    // Relatório 1: Média geral e total de avaliações concluídas por aluno
    public List<AlunoMediaGeralDto> listarMediaGeralPorAluno() {
        String sql = """
                    WITH notas_avaliacao AS (
            SELECT
                a.id_usuario,
                a.id_avaliacao,
                COALESCE(SUM(r.nota), 0) AS nota_prova
            FROM atribuicao a
            LEFT JOIN resposta r
                   ON r.id_usuario = a.id_usuario
                  AND r.id_avaliacao = a.id_avaliacao
            WHERE a.status = 'CONCLUIDO'
            GROUP BY a.id_usuario, a.id_avaliacao
        )
        SELECT
            u.nome,
            u.email,
            COALESCE(ROUND(AVG(na.nota_prova), 2), 0.0) AS media_geral,
            COUNT(na.id_avaliacao) AS avaliacoes_concluidas
        FROM usuario u
        JOIN notas_avaliacao na ON na.id_usuario = u.id_usuario
        GROUP BY u.id_usuario, u.nome, u.email
        ORDER BY media_geral DESC, u.nome ASC
            """;
        return jdbcTemplate.query(sql, alunoMediaGeralMapper);
    }

    // Relatório 2: Questões com menor média de nota (mais difíceis)
    public List<QuestaoMaisDificilDto> listarQuestoesMaisDificeis() {
        String sql = """
            SELECT
                q.id_questao,
                q.enunciado,
                ROUND(AVG(r.nota), 2) AS media_nota,
                COUNT(r.id_usuario) AS total_respostas
            FROM questao q
            JOIN resposta r ON r.id_questao = q.id_questao
            WHERE r.nota IS NOT NULL
            GROUP BY q.id_questao, q.enunciado
            ORDER BY media_nota ASC, total_respostas DESC
            """;
        return jdbcTemplate.query(sql, questaoMaisDificilMapper);
    }

    // Relatório 3: Questões objetivas com maior quantidade de respostas incorretas
    public List<QuestaoMaisErrosDto> listarQuestoesMaisErros() {
        String sql = """
           SELECT 
            q.id_questao,
            q.enunciado,
            COUNT(CASE WHEN a.correta = FALSE THEN 1 END) AS total_erros,
            COUNT(*) AS total_respostas,
            ROUND((COUNT(CASE WHEN a.correta = FALSE THEN 1 END) * 100.0) / NULLIF(COUNT(*), 0), 2) AS taxa_erro
            FROM questao q 
            JOIN resposta r
            ON q.id_questao = r.id_questao
            JOIN alternativa a
            ON r.letra_marcada = a.letra AND r.id_questao = a.id_questao
            GROUP BY q.id_questao, q.enunciado
            ORDER BY total_erros DESC, total_respostas DESC
            """;
        return jdbcTemplate.query(sql, questaoMaisErrosMapper);
    }
}