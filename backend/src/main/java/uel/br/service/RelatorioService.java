package uel.br.service;

import java.util.List;

import org.springframework.stereotype.Service;

import uel.br.dao.RelatorioDao;
import uel.br.dto.AlunoMediaGeralDto;
import uel.br.dto.QuestaoMaisDificilDto;
import uel.br.dto.QuestaoMaisErrosDto;

@Service
public class RelatorioService {

    private final RelatorioDao relatorioDao;

    public RelatorioService(RelatorioDao relatorioDao) {
        this.relatorioDao = relatorioDao;
    }

    public List<AlunoMediaGeralDto> obterMediaGeralPorAluno() {
        return relatorioDao.listarMediaGeralPorAluno();
    }

    public List<QuestaoMaisDificilDto> obterQuestoesMaisDificeis() {
        return relatorioDao.listarQuestoesMaisDificeis();
    }

    public List<QuestaoMaisErrosDto> obterQuestoesMaisErros() {
        return relatorioDao.listarQuestoesMaisErros();
    }
}