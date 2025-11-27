package br.com.g2.medlink.service;

import br.com.g2.medlink.entity.Medico;
import br.com.g2.medlink.entity.Slot;
import br.com.g2.medlink.repository.SlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class SlotService {

    @Autowired
    private SlotRepository slotRepository;

    // Gera slots de duracaoMin minutos dentro de uma janela
    @Transactional
    public List<Slot> gerarSlotsParaJanela(Medico medico, LocalDateTime inicio, LocalDateTime fim, int duracaoMin) {
        List<Slot> slots = new ArrayList<>();
        LocalDateTime cursor = inicio;

        while (!cursor.plusMinutes(duracaoMin).isAfter(fim)) {
            LocalDateTime slotFim = cursor.plusMinutes(duracaoMin);

            boolean existeSobreposicao = slotRepository
                    .existsByMedicoAndInicioLessThanEqualAndFimGreaterThanEqual(medico, slotFim, cursor);
            if (!existeSobreposicao) {
                Slot s = new Slot();
                s.setMedico(medico);
                s.setInicio(cursor);
                s.setFim(slotFim);
                s.setStatus(Slot.Status.LIVRE);
                slots.add(s);
            }
            cursor = slotFim;
        }
        return slotRepository.saveAll(slots);
    }

    @Transactional
    public void cancelarOuExcluirSlotLivre(UUID slotId) {
        Slot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new IllegalArgumentException("Slot não encontrado"));

        if (slot.getStatus() != Slot.Status.LIVRE) {
            throw new IllegalStateException("Apenas slots LIVRE podem ser removidos/cancelados");
        }

        // Opção A: marcar como CANCELADO
        slot.setStatus(Slot.Status.BLOQUEADO);
        slotRepository.save(slot);
    }

    public List<Slot> listarSlotsLivresDoDia(Medico medico, LocalDate dia) {
        LocalDateTime start = dia.atStartOfDay();
        LocalDateTime end = dia.plusDays(1).atStartOfDay().minusNanos(1);
        return slotRepository.findByMedicoAndInicioBetweenAndStatus(medico, start, end, Slot.Status.LIVRE);
    }
}
