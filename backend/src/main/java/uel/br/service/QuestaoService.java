package uel.br.service;

import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import uel.br.dao.QuestaoDao;
import uel.br.enums.TipoQuestoesEnum;
import uel.br.model.Alternativa;
import uel.br.model.Questao;

@Service 
public class QuestaoService {
    private final QuestaoDao dao;

    public QuestaoService(QuestaoDao dao){
        this.dao = dao;
    }

    public void validarQuestao(Questao questao) {
        List<Alternativa> alts = questao.getAlternativas();
        boolean temAlternativas = alts != null && !alts.isEmpty();

        if (questao.getTipo() == TipoQuestoesEnum.DISCURSIVA) {
            if (temAlternativas) {
                throw new IllegalArgumentException("Questão discursiva não deve possuir alternativas.");
            }
            return;
        }

        // Daqui para baixo, é garantido que é MULTIPLA_ESCOLHA
        if (!temAlternativas || alts.size() < 2 || alts.size() > 7) {
            throw new IllegalArgumentException("Questão de múltipla escolha deve ter entre 2 e 7 alternativas.");
        }

        Set<String> letrasVistas = new HashSet<>();
        int qtdCorretas = 0;

        for (Alternativa alt : alts) {
            if (!letrasVistas.add(alt.getLetra())) {
                throw new IllegalArgumentException("Letra de alternativa duplicada: " + alt.getLetra());
            }
            if (alt.isCorreta()) {
                qtdCorretas++;
            }
        }

        if (qtdCorretas != 1) {
            throw new IllegalArgumentException("A questão deve ter exatamente 1 alternativa correta.");
        }
    }

    @Transactional 
    public Long cadastrar(Questao questao) {
        validarQuestao(questao);

        Long idQuestao = dao.inserirQuestaoBase(questao.getEnunciado());

        // caso DISCURSIVA
        if (questao.getTipo() == TipoQuestoesEnum.DISCURSIVA) {
            dao.inserirDiscursiva(idQuestao);
            return idQuestao;
        }

        // caso MULTIPLA_ESCOLHA ... 
        dao.inserirMultiplaEscolha(idQuestao);

        for (Alternativa alt : questao.getAlternativas()) {
            dao.inserirAlternativa(idQuestao, alt);
        }

        return idQuestao;

        // retornar idQuestao gerado?
    }

    public List<Questao> listarTodos() {
        return dao.listarTodas();
    }


    public Questao buscarPorId(Long id) {
        return dao.buscarPorId(id)
            .orElseThrow(() -> new IllegalArgumentException("Questão com id " + id + " não encontrada no banco."));
    }

    @Transactional
    public void atualizar(Long id, Questao questao) {
        Questao existente = buscarPorId(id);

        if (existente.getTipo() != questao.getTipo()) {
            throw new IllegalArgumentException("Não é permitido alterar o tipo de uma questão já cadastrada.");
        }

        validarQuestao(questao);
        dao.atualizarEnunciado(id, questao.getEnunciado());

        if (questao.getTipo() == TipoQuestoesEnum.MULTIPLA_ESCOLHA) {
            if (dao.possuiRespostas(id)) {
                throw new IllegalArgumentException("Não é possível alterar as alternativas de uma questão que já possui respostas.");
            }

            dao.excluirAlternativas(id);
            for (Alternativa alt : questao.getAlternativas()) {
                dao.inserirAlternativa(id, alt);
            }
        }
    }

    @Transactional
    public void remover(Long id) {
        if (dao.excluir(id) == 0) {
            throw new IllegalArgumentException("Questão com id " + id + " não encontrada no banco.");
        }
    }
}