-- Limpeza dos dados mantendo a estrutura
TRUNCATE TABLE resposta, atribuicao, avaliacao_questao, alternativa,
               questao_discursiva, questao_multipla_escolha,
               avaliacao, questao, usuario RESTART IDENTITY CASCADE;

-- Usuários 
INSERT INTO usuario (id_usuario, email, nome, senha) VALUES
(1,  'ana.silva@uel.br',        'Ana Clara Silva',       'hash_senha_01'),
(2,  'bruno.oliveira@uel.br',   'Bruno Henrique Oliveira','hash_senha_02'),
(3,  'camila.santos@uel.br',    'Camila Ferreira Santos','hash_senha_03'),
(4,  'daniel.costa@uel.br',     'Daniel Almeida Costa',  'hash_senha_04'),
(5,  'eduarda.lima@uel.br',     'Eduarda Souza Lima',    'hash_senha_05'),
(6,  'felipe.rocha@uel.br',     'Felipe Martins Rocha',  'hash_senha_06'),
(7,  'gabriela.alves@uel.br',   'Gabriela Dias Alves',   'hash_senha_07'),
(8,  'henrique.mendes@uel.br',  'Henrique Castro Mendes','hash_senha_08'),
(9,  'isabela.ribeiro@uel.br',  'Isabela Gomes Ribeiro', 'hash_senha_09'),
(10, 'joao.pereira@uel.br',     'João Pedro Pereira',    'hash_senha_10'),
(11, 'karina.carvalho@uel.br',  'Karina Nunes Carvalho', 'hash_senha_11'),
(12, 'lucas.fernandes@uel.br',  'Lucas Gabriel Fernandes','hash_senha_12'),
(13, 'mariana.gomes@uel.br',    'Mariana Azevedo Gomes', 'hash_senha_13'),
(14, 'nicolas.barbosa@uel.br',  'Nícolas Pinto Barbosa', 'hash_senha_14'),
(15, 'olivia.cardoso@uel.br',   'Olívia Teixeira Cardoso','hash_senha_15'),
(16, 'paulo.moreira@uel.br',    'Paulo César Moreira',   'hash_senha_16'),
(17, 'rafaela.vieira@uel.br',   'Rafaela Monteiro Vieira','hash_senha_17'),
(18, 'samuel.dias@uel.br',      'Samuel Araújo Dias',    'hash_senha_18'),
(19, 'tatiana.nunes@uel.br',    'Tatiana Lopes Nunes',   'hash_senha_19'),
(20, 'vinicius.ramos@uel.br',   'Vinícius Borges Ramos', 'hash_senha_20'),
(21, 'yasmin.castro@uel.br',    'Yasmin Freitas Castro', 'hash_senha_21'),
(22, 'zeca.monteiro@uel.br',    'José Carlos Monteiro',  'hash_senha_22');

-- Questões (30 questões: 20 múltipla escolha + 10 discursivas)
INSERT INTO questao (id_questao, enunciado) VALUES
-- Múltipla Escolha (1 a 20)
(1,  'No modelo Entidade-Relacionamento, qual símbolo representa um relacionamento identificador de entidade fraca?'),
(2,  'Qual anomalia de concorrência ocorre quando uma transação lê dados modificados por outra transação ainda não confirmada (uncommitted)?'),
(3,  'Qual comando SQL DDL é utilizado para remover completamente a estrutura e os dados de uma tabela do banco?'),
(4,  'Em um esquema relacional, qual restrição garante que os valores de um atributo não se repitam entre tuplas distintas, permitindo nulos?'),
(5,  'Qual operador da Álgebra Relacional filtra tuplas de uma relação que satisfazem um predicado lógico?'),
(6,  'Qual operador da Álgebra Relacional retorna apenas as colunas especificadas de uma relação, eliminando duplicatas?'),
(7,  'Qual fenômeno de isolamento ocorre quando duas transações concorrentes leem o mesmo dado, calculam novos valores com base nele e uma sobrescreve a atualização da outra?'),
(8,  'Em SQL, qual cláusula filtra grupos resultantes após a aplicação de funções de agregação como COUNT e AVG?'),
(9,  'Uma relação está na Primeira Forma Normal (1FN) quando todos os seus atributos possuem domínios exclusivamente:'),
(10, 'Qual forma normal exige que todo atributo não-chave seja totalmente dependente funcionalmente de toda a chave primária?'),
(11, 'Qual forma normal elimina dependências funcionais transitivas entre atributos não-chave?'),
(12, 'Qual propriedade ACID garante que uma transação seja executada integralmente ou não produza nenhum efeito no banco?'),
(13, 'Qual propriedade ACID assegura que os efeitos de uma transação confirmada persistam mesmo após falhas de energia ou sistema?'),
(14, 'No protocolo Two-Phase Locking (2PL) estrito, quando os bloqueios exclusivos (write locks) de uma transação são liberados?'),
(15, 'Qual estrutura de índice mantém todas as chaves ordenadas nas folhas ligadas sequencialmente, otimizando buscas por intervalo?'),
(16, 'Qual tipo de índice oferece complexidade O(1) para buscas de igualdade exata, mas não suporta consultas por faixa de valores?'),
(17, 'Em PostgreSQL, qual ação referencial impede a exclusão de uma tupla pai enquanto existirem tuplas filhas referenciando-a?'),
(18, 'Qual tipo de junção retorna todas as tuplas da tabela à esquerda, preenchendo com NULL as colunas da tabela à direita sem correspondência?'),
(19, 'Qual comando SQL DCL concede privilégios de leitura ou escrita em uma tabela para um usuário específico?'),
(20, 'Em otimização de consultas, qual operação costuma ser empurrada para o nível mais baixo da árvore algébrica (selection pushdown)?'),

-- Discursivas (21 a 30)
(21, 'Explique a diferença entre entidade forte e entidade fraca no modelo ER, citando o papel da chave parcial.'),
(22, 'Diferencie as cláusulas WHERE e HAVING em consultas SQL com agrupamento, apresentando um exemplo prático de uso.'),
(23, 'Explique o que é uma dependência funcional transitiva e como sua remoção conduz à Terceira Forma Normal (3FN).'),
(24, 'Compare a Forma Normal de Boyce-Codd (FNBC) com a 3FN, destacando em qual cenário uma relação em 3FN viola a FNBC.'),
(25, 'Descreva o problema de deadlock em sistemas transacionais e explique duas estratégias distintas para tratá-lo ou preveni-lo.'),
(26, 'Explique como funciona o mecanismo de Write-Ahead Logging (WAL) para garantir atomicidade e durabilidade na recuperação de falhas.'),
(27, 'Compare índices primários (clusterizados) e índices secundários quanto à organização física dos registros no disco.'),
(28, 'Explique em que situações a criação de um índice composto (multi-coluna) melhora o desempenho de consultas e quando ele não é aproveitado.'),
(29, 'Analise os impactos de custo entre os algoritmos Nested-Loop Join e Hash Join em junções de grandes volumes de dados.'),
(30, 'Explique o conceito de plano de execução (EXPLAIN ANALYZE) e como identificar um gargalo de Sequential Scan desnecessário.');

-- Especialização das questões
INSERT INTO questao_multipla_escolha (id_questao)
SELECT generate_series(1, 20);

INSERT INTO questao_discursiva (id_questao)
SELECT generate_series(21, 30);

-- Alternativas
INSERT INTO alternativa (id_questao, letra, correta, texto) VALUES
-- Q1 (Correta: B)
(1, 'A', FALSE, 'Retângulo simples'),
(1, 'B', TRUE,  'Losango duplo'),
(1, 'C', FALSE, 'Elipse tracejada'),
(1, 'D', FALSE, 'Triângulo invertido'),
-- Q2 (Correta: A)
(2, 'A', TRUE,  'Dirty Read (Leitura Suja)'),
(2, 'B', FALSE, 'Phantom Read (Leitura Fantasma)'),
(2, 'C', FALSE, 'Non-Repeatable Read (Leitura Não Repetível)'),
(2, 'D', FALSE, 'Serialization Anomaly'),
-- Q3 (Correta: C)
(3, 'A', FALSE, 'DELETE TABLE'),
(3, 'B', FALSE, 'TRUNCATE TABLE'),
(3, 'C', TRUE,  'DROP TABLE'),
(3, 'D', FALSE, 'ALTER TABLE DROP'),
-- Q4 (Correta: D)
(4, 'A', FALSE, 'PRIMARY KEY'),
(4, 'B', FALSE, 'FOREIGN KEY'),
(4, 'C', FALSE, 'CHECK'),
(4, 'D', TRUE,  'UNIQUE'),
-- Q5 (Correta: A)
(5, 'A', TRUE,  'Seleção (σ)'),
(5, 'B', FALSE, 'Projeção (π)'),
(5, 'C', FALSE, 'Junção Natural (⋈)'),
(5, 'D', FALSE, 'Produto Cartesiano (×)'),
-- Q6 (Correta: B)
(6, 'A', FALSE, 'Seleção (σ)'),
(6, 'B', TRUE,  'Projeção (π)'),
(6, 'C', FALSE, 'União (∪)'),
(6, 'D', FALSE, 'Renomeação (ρ)'),
-- Q7 (Correta: C)
(7, 'A', FALSE, 'Dirty Read'),
(7, 'B', FALSE, 'Phantom Read'),
(7, 'C', TRUE,  'Lost Update (Atualização Perdida)'),
(7, 'D', FALSE, 'Deadlock'),
-- Q8 (Correta: D)
(8, 'A', FALSE, 'WHERE'),
(8, 'B', FALSE, 'GROUP BY'),
(8, 'C', FALSE, 'ORDER BY'),
(8, 'D', TRUE,  'HAVING'),
-- Q9 (Correta: A)
(9, 'A', TRUE,  'Atômicos e indivisíveis'),
(9, 'B', FALSE, 'Multivalorados'),
(9, 'C', FALSE, 'Compostos por tuplas aninhadas'),
(9, 'D', FALSE, 'Indexados por chave estrangeira'),
-- Q10 (Correta: B)
(10, 'A', FALSE, 'Primeira Forma Normal (1FN)'),
(10, 'B', TRUE,  'Segunda Forma Normal (2FN)'),
(10, 'C', FALSE, 'Terceira Forma Normal (3FN)'),
(10, 'D', FALSE, 'Quarta Forma Normal (4FN)'),
-- Q11 (Correta: C)
(11, 'A', FALSE, '1FN'),
(11, 'B', FALSE, '2FN'),
(11, 'C', TRUE,  '3FN'),
(11, 'D', FALSE, '5FN'),
-- Q12 (Correta: A)
(12, 'A', TRUE,  'Atomicidade'),
(12, 'B', FALSE, 'Consistência'),
(12, 'C', FALSE, 'Isolamento'),
(12, 'D', FALSE, 'Durabilidade'),
-- Q13 (Correta: D)
(13, 'A', FALSE, 'Atomicidade'),
(13, 'B', FALSE, 'Consistência'),
(13, 'C', FALSE, 'Isolamento'),
(13, 'D', TRUE,  'Durabilidade'),
-- Q14 (Correta: B)
(14, 'A', FALSE, 'Imediatamente após a última operação de leitura'),
(14, 'B', TRUE,  'Somente após o COMMIT ou ABORT da transação'),
(14, 'C', FALSE, 'Antes do início da fase de crescimento'),
(14, 'D', FALSE, 'A cada comando UPDATE executado'),
-- Q15 (Correta: C)
(15, 'A', FALSE, 'Tabela Hash Estática'),
(15, 'B', FALSE, 'Heap File não ordenado'),
(15, 'C', TRUE,  'Árvore B+ (B+ Tree)'),
(15, 'D', FALSE, 'Bitmap sem ordenação'),
-- Q16 (Correta: A)
(16, 'A', TRUE,  'Índice Hash'),
(16, 'B', FALSE, 'Árvore B+'),
(16, 'C', FALSE, 'Árvore B'),
(16, 'D', FALSE, 'Índice Clusterizado Sequencial'),
-- Q17 (Correta: D)
(17, 'A', FALSE, 'ON DELETE CASCADE'),
(17, 'B', FALSE, 'ON DELETE SET NULL'),
(17, 'C', FALSE, 'ON DELETE SET DEFAULT'),
(17, 'D', TRUE,  'ON DELETE RESTRICT'),
-- Q18 (Correta: B)
(18, 'A', FALSE, 'INNER JOIN'),
(18, 'B', TRUE,  'LEFT OUTER JOIN'),
(18, 'C', FALSE, 'RIGHT OUTER JOIN'),
(18, 'D', FALSE, 'CROSS JOIN'),
-- Q19 (Correta: C)
(19, 'A', FALSE, 'REVOKE'),
(19, 'B', FALSE, 'COMMIT'),
(19, 'C', TRUE,  'GRANT'),
(19, 'D', FALSE, 'ALLOW'),
-- Q20 (Correta: A)
(20, 'A', TRUE,  'Seleção (σ)'),
(20, 'B', FALSE, 'Ordenação (τ)'),
(20, 'C', FALSE, 'Produto Cartesiano (×)'),
(20, 'D', FALSE, 'União externa');

-- Avaliações (5 avaliações somando 10.00 pontos cada)
INSERT INTO avaliacao (id_avaliacao, titulo, data, descricao, hora_inicio, hora_fim) VALUES
(1, 'P1 - Modelagem ER e DDL',            '2026-08-20', 'Fundamentos de modelagem conceitual, entidades fracas e definição de esquemas SQL.', '08:00:00', '10:00:00'),
(2, 'P2 - Álgebra Relacional e Consultas','2026-09-17', 'Operadores relacionais, agrupamentos e controle básico de concorrência.',           '08:00:00', '10:00:00'),
(3, 'P3 - Teoria da Normalização',        '2026-10-15', 'Dependências funcionais e formas normais (1FN, 2FN, 3FN e FNBC).',                  '08:00:00', '10:00:00'),
(4, 'P4 - Transações e Recuperação',      '2026-11-05', 'Propriedades ACID, bloqueios 2PL, deadlocks e logs WAL.',                           '08:00:00', '10:00:00'),
(5, 'P5 - Indexação e Otimização SQL',    '2026-11-18', 'Estruturas de índices, algoritmos de junção e análise de planos de execução.',      '08:00:00', '10:00:00');

-- Composição das avaliações (Todas as 30 questões distribuídas; soma = 10.00)
INSERT INTO avaliacao_questao (id_avaliacao, id_questao, valor) VALUES
-- Avaliação 1 (2.0 + 2.0 + 1.5 + 1.5 + 3.0 = 10.00)
(1, 1,  2.00),
(1, 2,  2.00),
(1, 3,  1.50),
(1, 4,  1.50),
(1, 21, 3.00),

-- Avaliação 2 (2.0 + 2.0 + 2.0 + 1.0 + 3.0 = 10.00)
(2, 5,  2.00),
(2, 6,  2.00),
(2, 7,  2.00),
(2, 8,  1.00),
(2, 22, 3.00),

-- Avaliação 3 (1.5 + 1.5 + 2.0 + 2.5 + 2.5 = 10.00)
(3, 9,  1.50),
(3, 10, 1.50),
(3, 11, 2.00),
(3, 23, 2.50),
(3, 24, 2.50),

-- Avaliação 4 (1.5 + 1.5 + 2.0 + 2.5 + 2.5 = 10.00)
(4, 12, 1.50),
(4, 13, 1.50),
(4, 14, 2.00),
(4, 25, 2.50),
(4, 26, 2.50),

-- Avaliação 5 (1.5*4 + 1.0*2 + 0.5*4 = 10.00)
(5, 15, 1.50),
(5, 16, 1.50),
(5, 17, 1.50),
(5, 18, 1.50),
(5, 19, 1.00),
(5, 20, 1.00),
(5, 27, 0.50),
(5, 28, 0.50),
(5, 29, 0.50),
(5, 30, 0.50);

-- Atribuições (95 atribuições entre CONCLUIDO, EM_ANDAMENTO e NAO_INICIADO)
-- Alunos 1 a 15 concluíram todas as 5 avaliações (75 atribuições)
INSERT INTO atribuicao (id_usuario, id_avaliacao, status)
SELECT u, a, 'CONCLUIDO'
FROM generate_series(1, 15) AS u
CROSS JOIN generate_series(1, 5) AS a;

-- Alunos 16 a 18 concluíram P1..P3 e estão com P4 em andamento (12 atribuições)
INSERT INTO atribuicao (id_usuario, id_avaliacao, status)
SELECT u, a, CASE WHEN a <= 3 THEN 'CONCLUIDO' ELSE 'EM_ANDAMENTO' END
FROM generate_series(16, 18) AS u
CROSS JOIN generate_series(1, 4) AS a;

-- Alunos 19 e 20 concluíram P1..P2 e ainda não iniciaram P3 (6 atribuições)
INSERT INTO atribuicao (id_usuario, id_avaliacao, status)
SELECT u, a, CASE WHEN a <= 2 THEN 'CONCLUIDO' ELSE 'NAO_INICIADO' END
FROM generate_series(19, 20) AS u
CROSS JOIN generate_series(1, 3) AS a;

-- Alunos 21 e 22 têm apenas avaliações em andamento ou não iniciadas (4 atribuições)
INSERT INTO atribuicao (id_usuario, id_avaliacao, status) VALUES
(21, 1, 'EM_ANDAMENTO'),
(21, 2, 'NAO_INICIADO'),
(22, 1, 'NAO_INICIADO'),
(22, 2, 'NAO_INICIADO');

-- Respostas (Geração determinística alinhada às FKs, notas e dificuldades)
WITH perfil_usuario (id_usuario, habilidade) AS (
    VALUES
    (1,  96), (2,  92), (3,  89), (4,  85), (5,  81),
    (6,  78), (7,  74), (8,  70), (9,  67), (10, 63),
    (11, 60), (12, 56), (13, 52), (14, 48), (15, 44),
    (16, 40), (17, 36), (18, 32), (19, 28), (20, 24),
    (21, 50), (22, 45)
),
dificuldade_questao (id_questao, dificuldade) AS (
    VALUES
    -- Múltipla escolha (Q7, Q2, Q14 e Q11 são as mais erradas)
    (1,  20), (2,  82), (3,  25), (4,  35), (5,  18),
    (6,  30), (7,  91), (8,  45), (9,  28), (10, 40),
    (11, 68), (12, 22), (13, 32), (14, 76), (15, 38),
    (16, 42), (17, 34), (18, 48), (19, 26), (20, 55),
    -- Discursivas (Q25 e Q29 têm as menores médias)
    (21, 45), (22, 52), (23, 60), (24, 72), (25, 88),
    (26, 65), (27, 50), (28, 58), (29, 84), (30, 62)
),
itens_respondidos AS (
    SELECT
        a.id_usuario,
        a.id_avaliacao,
        a.status,
        aq.id_questao,
        aq.valor,
        pu.habilidade,
        dq.dificuldade,
        alt.letra AS letra_correta,
        (qd.id_questao IS NOT NULL) AS eh_discursiva,
        ROW_NUMBER() OVER (PARTITION BY a.id_usuario, a.id_avaliacao ORDER BY aq.id_questao) AS ordem_questao
    FROM atribuicao a
    JOIN avaliacao_questao aq ON aq.id_avaliacao = a.id_avaliacao
    JOIN perfil_usuario pu    ON pu.id_usuario = a.id_usuario
    JOIN dificuldade_questao dq ON dq.id_questao = aq.id_questao
    LEFT JOIN alternativa alt ON alt.id_questao = aq.id_questao AND alt.correta = TRUE
    LEFT JOIN questao_discursiva qd ON qd.id_questao = aq.id_questao
    WHERE a.status = 'CONCLUIDO'
       OR (a.status = 'EM_ANDAMENTO' AND a.id_avaliacao IS NOT NULL)
),
itens_filtrados AS (
    SELECT *
    FROM itens_respondidos
    WHERE status = 'CONCLUIDO'
       OR (status = 'EM_ANDAMENTO' AND ordem_questao <= 2)
)
INSERT INTO resposta (id_usuario, id_avaliacao, id_questao, texto_resposta, letra_marcada, nota)
SELECT
    id_usuario,
    id_avaliacao,
    id_questao,
    -- Texto apenas para discursivas
    CASE
        WHEN NOT eh_discursiva THEN NULL
        WHEN habilidade >= dificuldade THEN
            'Resposta completa abordando os conceitos formais, restrições e exemplos solicitados na questão ' || id_questao || '.'
        WHEN habilidade >= (dificuldade - 25) THEN
            'Resposta parcialmente correta sobre o tema da questão ' || id_questao || ', mas omitindo detalhes técnicos.'
        ELSE
            'Resposta incompleta ou conceitualmente imprecisa referente à questão ' || id_questao || '.'
    END AS texto_resposta,
    -- Letra marcada apenas para múltipla escolha
    CASE
        WHEN eh_discursiva THEN NULL
        WHEN (habilidade + ((id_usuario * 13 + id_questao * 7) % 29) - 14) >= dificuldade THEN
            letra_correta
        ELSE
            (CASE letra_correta
                WHEN 'A' THEN (ARRAY['B','C','D'])[1 + ((id_usuario + id_questao) % 3)]
                WHEN 'B' THEN (ARRAY['A','C','D'])[1 + ((id_usuario + id_questao) % 3)]
                WHEN 'C' THEN (ARRAY['A','B','D'])[1 + ((id_usuario + id_questao) % 3)]
                ELSE          (ARRAY['A','B','C'])[1 + ((id_usuario + id_questao) % 3)]
            END)::opcoes_t
    END AS letra_marcada,
    -- Nota calculada (NULL para questões ainda não corrigidas em provas EM_ANDAMENTO)
    CASE
        WHEN status = 'EM_ANDAMENTO' AND eh_discursiva THEN NULL
        WHEN NOT eh_discursiva THEN
            CASE
                WHEN (habilidade + ((id_usuario * 13 + id_questao * 7) % 29) - 14) >= dificuldade THEN valor
                ELSE 0.00::nota_t
            END
        ELSE
            ROUND(
                (valor * GREATEST(0.0, LEAST(1.0, (habilidade - dificuldade + 45.0) / 90.0)))::numeric,
                2
            )::nota_t
    END AS nota
FROM itens_filtrados;

-- Sincronização das sequences identity
SELECT setval(pg_get_serial_sequence('usuario', 'id_usuario'), COALESCE(MAX(id_usuario), 1)) FROM usuario;
SELECT setval(pg_get_serial_sequence('questao', 'id_questao'), COALESCE(MAX(id_questao), 1)) FROM questao;
SELECT setval(pg_get_serial_sequence('avaliacao', 'id_avaliacao'), COALESCE(MAX(id_avaliacao), 1)) FROM avaliacao;