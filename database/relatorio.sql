
-- Relatório 1: Tabela de ranking de média dos alunos
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
ORDER BY media_geral DESC, u.nome ASC;