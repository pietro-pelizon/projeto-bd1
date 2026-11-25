
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


-- Relatório 2: Questão mais difícil (com menor média entre aqueles que a responderam)
SELECT
    q.id_questao,
    q.enunciado,
    ROUND(AVG(r.nota), 2) AS media_nota,
    COUNT(r.id_usuario) AS total_respostas
FROM questao q
JOIN resposta r ON r.id_questao = q.id_questao
WHERE r.nota IS NOT NULL
GROUP BY q.id_questao, q.enunciado
ORDER BY media_nota ASC, total_respostas DESC;

-- Relatório 3: Questão de múltipla escolha com o maior número de erros
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
    ORDER BY total_erros DESC, total_respostas DESC;
    