package uel.br.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import uel.br.dao.RespostaDao;
import uel.br.dto.ItemProvaDto;
import uel.br.dto.NotaTotalDto;
import uel.br.model.Resposta;

@Service
public class RespostaService {

    private final RespostaDao dao;

    public RespostaService(RespostaDao dao) {
        this.dao = dao;
    }

    private void validarChave(Resposta resposta) {
        if (resposta.getId_usuario() == null || resposta.getId_avaliacao() == null || resposta.getId_questao() == null) {
            throw new IllegalArgumentException("id_usuario, id_avaliacao e id_questao são obrigatórios.");
        }
    }

    private String buscarStatus(Long idUsuario, Long idAvaliacao) {
        return dao.buscarStatusAtribuicao(idUsuario, idAvaliacao)
            .orElseThrow(() -> new IllegalArgumentException("Atribuição (usuário + avaliação) não encontrada."));
    }

    private void exigirProvaAberta(Long idUsuario, Long idAvaliacao) {
        if ("CONCLUIDO".equals(buscarStatus(idUsuario, idAvaliacao))) {
            throw new IllegalArgumentException("Avaliação já concluída: as respostas não podem ser alteradas.");
        }
    }

    private ItemProvaDto buscarItem(Long idAvaliacao, Long idQuestao) {
        return dao.buscarItemProva(idAvaliacao, idQuestao)
            .orElseThrow(() -> new IllegalArgumentException("Esta questão não faz parte da avaliação."));
    }

    // Valida a resposta conforme o tipo da questão e define a nota.
    // A nota enviada pelo cliente é sempre ignorada aqui.
    private void validarEAvaliar(Resposta resposta) {
        ItemProvaDto item = buscarItem(resposta.getId_avaliacao(), resposta.getId_questao());

        String letra = resposta.getLetra_marcada() == null ? "" : resposta.getLetra_marcada().trim().toUpperCase();
        String texto = resposta.getTexto_resposta() == null ? "" : resposta.getTexto_resposta().trim();

        if (item.discursiva()) {
            if (!letra.isEmpty()) {
                throw new IllegalArgumentException("Questão discursiva não aceita letra marcada.");
            }
            if (texto.isEmpty()) {
                throw new IllegalArgumentException("Escreva o texto da resposta.");
            }
            if (texto.length() > 3000) {
                throw new IllegalArgumentException("A resposta deve ter no máximo 3000 caracteres.");
            }
            resposta.setLetra_marcada(null);
            resposta.setTexto_resposta(texto);
            resposta.setNota(null); // aguarda a correção do professor
            return;
        }

        if (!texto.isEmpty()) {
            throw new IllegalArgumentException("Questão de múltipla escolha não aceita texto.");
        }
        if (letra.isEmpty()) {
            throw new IllegalArgumentException("Marque uma alternativa.");
        }
        boolean acertou = dao.buscarGabarito(resposta.getId_questao(), letra)
            .orElseThrow(() -> new IllegalArgumentException("A alternativa " + letra + " não existe nesta questão."));

        resposta.setLetra_marcada(letra);
        resposta.setTexto_resposta(null);
        resposta.setNota(acertou ? item.valor() : BigDecimal.ZERO);
    }

    @Transactional
    public Resposta criar(Resposta resposta) {
        validarChave(resposta);
        exigirProvaAberta(resposta.getId_usuario(), resposta.getId_avaliacao());
        validarEAvaliar(resposta);

        if (dao.buscarPorId(resposta.getId_usuario(), resposta.getId_avaliacao(), resposta.getId_questao()).isPresent()) {
            throw new IllegalArgumentException("Já existe uma resposta registrada para este usuário, avaliação e questão.");
        }

        dao.inserir(resposta);
        dao.marcarEmAndamento(resposta.getId_usuario(), resposta.getId_avaliacao());
        return resposta;
    }

    // Correção de questão discursiva pelo professor
    @Transactional
    public Resposta corrigir(Long idUsuario, Long idAvaliacao, Long idQuestao, BigDecimal nota) {
        buscarStatus(idUsuario, idAvaliacao);
        ItemProvaDto item = buscarItem(idAvaliacao, idQuestao);

        if (!item.discursiva()) {
            throw new IllegalArgumentException("Questões de múltipla escolha são corrigidas automaticamente.");
        }
        if (nota == null || nota.compareTo(BigDecimal.ZERO) < 0 || nota.compareTo(item.valor()) > 0) {
            throw new IllegalArgumentException("A nota deve estar entre 0 e " + item.valor() + ".");
        }
        if (dao.atualizarNota(idUsuario, idAvaliacao, idQuestao, nota) == 0) {
            throw new IllegalArgumentException("Resposta não encontrada.");
        }
        return buscarPorId(idUsuario, idAvaliacao, idQuestao);
    }

    @Transactional
    public NotaTotalDto calcularNotaTotal(Long idUsuario, Long idAvaliacao) {
        buscarStatus(idUsuario, idAvaliacao);
        return dao.calcularNotaTotal(idUsuario, idAvaliacao);
    }

    public List<Resposta> listarTodos() {
        return dao.listarTodos();
    }

    public List<Resposta> listarPorAtribuicao(Long idUsuario, Long idAvaliacao) {
        return dao.listarPorAtribuicao(idUsuario, idAvaliacao);
    }

    public Resposta buscarPorId(Long idUsuario, Long idAvaliacao, Long idQuestao) {
        return dao.buscarPorId(idUsuario, idAvaliacao, idQuestao)
            .orElseThrow(() -> new IllegalArgumentException("Resposta não encontrada."));
    }

    @Transactional
    public Resposta atualizar(Long idUsuario, Long idAvaliacao, Long idQuestao, Resposta resposta) {
        resposta.setId_usuario(idUsuario);
        resposta.setId_avaliacao(idAvaliacao);
        resposta.setId_questao(idQuestao);

        exigirProvaAberta(idUsuario, idAvaliacao);
        validarEAvaliar(resposta);

        int linhasAfetadas = dao.atualizar(resposta);
        if (linhasAfetadas == 0) {
            throw new IllegalArgumentException("Resposta não encontrada.");
        }
        return resposta;
    }

    @Transactional
    public void excluir(Long idUsuario, Long idAvaliacao, Long idQuestao) {
        exigirProvaAberta(idUsuario, idAvaliacao);
        int linhasAfetadas = dao.excluir(idUsuario, idAvaliacao, idQuestao);
        if (linhasAfetadas == 0) {
            throw new IllegalArgumentException("Resposta não encontrada.");
        }
    }
}