package uel.br.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import uel.br.model.Avaliacao;


@Repository 
public class AvaliacaoDao {
    private final JdbcTemplate jdbcTemplate;

    public AvaliacaoDao(JdbcTemplate template){
        this.jdbcTemplate = template;
    }

    private final RowMapper<Avaliacao> rowMapper = (rs, rowNum) -> new Avaliacao(
        rs.getLong("id_avaliacao"),
        rs.getString("titulo"),
        rs.getString("descricao"),
        rs.getObject("data", java.time.LocalDate.class),
        rs.getObject("hora_inicio", java.time.LocalTime.class),
        rs.getObject("hora_fim", java.time.LocalTime.class)
    );

    public void inserir(Avaliacao avaliacao){
        String sql = "INSERT INTO avaliacao (titulo, descricao, data, hora_inicio, hora_fim) VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, avaliacao.getTitulo(), avaliacao.getDescricao(), avaliacao.getData(), avaliacao.getHora_inicio(), avaliacao.getHora_fim());
    }

    public List<Avaliacao> listarTodos(){
        String sql  = "SELECT id_avaliacao, titulo, descricao, data, hora_inicio, hora_fim FROM avaliacao ORDER BY titulo";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public int excluir(Long id){
        String sql = "DELETE FROM avaliacao WHERE id_avaliacao = ?";
        return jdbcTemplate.update(sql, id);
    }

    public Optional<Avaliacao> buscarPorId(Long id){
        String sql = "SELECT id_avaliacao, titulo, descricao, data, hora_inicio, hora_fim FROM avaliacao WHERE id_avaliacao = ?";
        List<Avaliacao> resultados = jdbcTemplate.query(sql, rowMapper, id);
        return resultados.stream().findFirst();
    }


    public Optional<Avaliacao> buscarPorTitulo(String titulo) {
        String sql = "SELECT id_avaliacao, titulo, descricao, data, hora_inicio, hora_fim FROM avaliacao WHERE titulo = ?";
        List<Avaliacao> resultados = jdbcTemplate.query(sql, rowMapper, titulo);
        return resultados.stream().findFirst();
    }


    public int atualizar(Avaliacao avaliacao){
        String sql = "UPDATE avaliacao SET titulo = ?, descricao = ?, data = ?, hora_inicio = ?, hora_fim = ? WHERE id_avaliacao = ?";
        return jdbcTemplate.update(sql, avaliacao.getTitulo(), avaliacao.getDescricao(), avaliacao.getData(), avaliacao.getHora_inicio(), avaliacao.getHora_fim(), avaliacao.getId()); 
    }
}
