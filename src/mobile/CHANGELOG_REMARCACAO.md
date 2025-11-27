# Changelog - Funcionalidades de Remarcação e Cancelamento

## Data: 2025-06-XX

### Novas Funcionalidades Implementadas

#### 1. **Validação de Tempo para Cancelamento/Remarcação**
- Implementada regra de negócio que impede cancelamento ou remarcação de consultas com menos de 24 horas de antecedência
- Configuração ajustável via constante `HOURS_BEFORE_MIN` (atualmente 24 horas)
- Mensagens de erro claras informando o motivo da restrição

#### 2. **Funcionalidade de Remarcação**
- Novo botão "Remarcar" nas consultas agendadas/confirmadas
- Fluxo: Cancela a consulta atual → Redireciona usuário para agendar nova consulta
- Validação de tempo aplicada antes de permitir remarcação

#### 3. **Indicadores Visuais**
- Badge laranja em consultas próximas que não podem ser canceladas/remarcadas
- Mensagem: "Consulta próxima - não pode ser cancelada/remarcada"
- Ícones informativos nos botões de ação

#### 4. **Melhorias na Interface**
- Botões com ícones para melhor identificação visual:
  - 🗓️ Remarcar (azul)
  - ❌ Cancelar (vermelho)
- Layout horizontal dos botões de ação
- Feedback visual via SnackBars com cores apropriadas

### Arquivos Modificados

#### `lib/screens/consultas_screen.dart`
**Constantes adicionadas:**
- `HOURS_BEFORE_MIN = 24`: Tempo mínimo em horas para permitir modificações

**Métodos adicionados:**
- `_canModifyConsulta(Consulta)`: Verifica se consulta pode ser modificada baseado no tempo
- `_getModifyErrorMessage(Consulta)`: Retorna mensagem de erro apropriada
- `_rescheduleConsulta(Consulta)`: Implementa fluxo de remarcação

**Métodos modificados:**
- `_cancelConsulta(Consulta)`: Adicionada validação de tempo antes de cancelar
- `_buildConsultaCard(Consulta)`: Adicionado badge de aviso e botões com ícones

### Regras de Negócio Implementadas

1. **Tempo Mínimo**: Consultas só podem ser canceladas/remarcadas com no mínimo 24h de antecedência
2. **Estados Permitidos**: Apenas consultas com status "agendada" ou "confirmada" podem ser modificadas
3. **Consultas Passadas**: Consultas já realizadas não podem ser modificadas
4. **Feedback ao Usuário**: Mensagens claras em todas as operações (sucesso, erro, restrição)

### Comportamento dos Botões

#### Botão "Remarcar"
1. Verifica se consulta está dentro do prazo mínimo (24h)
2. Se não estiver, exibe mensagem de erro laranja
3. Se estiver, mostra diálogo de confirmação
4. Cancela a consulta atual
5. Exibe mensagem de sucesso
6. Retorna à tela anterior (HomeScreen) para usuário agendar nova consulta

#### Botão "Cancelar"
1. Verifica se consulta está dentro do prazo mínimo (24h)
2. Se não estiver, exibe mensagem de erro laranja
3. Se estiver, mostra diálogo de confirmação
4. Cancela a consulta via API
5. Recarrega lista de consultas
6. Exibe mensagem de sucesso/erro

### Mensagens de Erro

**Consulta Muito Próxima:**
```
Cancelamento/remarcação deve ser feito com no mínimo 24 horas de antecedência. 
Faltam apenas X horas.
```

**Consulta Já Passou:**
```
Esta consulta já passou.
```

### Melhorias Futuras (Sugestões)

1. **Remarcação Direta**: Implementar endpoint no backend para remarcação sem necessidade de cancelar + agendar
2. **Notificações**: Adicionar lembretes X horas antes da consulta
3. **Configuração por Perfil**: Permitir que tempo mínimo seja configurado por tipo de consulta/médico
4. **Histórico**: Manter histórico de remarcações para auditoria
5. **Justificativa**: Permitir que paciente adicione motivo do cancelamento/remarcação

### Testes Sugeridos

1. ✅ Tentar cancelar consulta com mais de 24h de antecedência (deve funcionar)
2. ✅ Tentar cancelar consulta com menos de 24h de antecedência (deve bloquear)
3. ✅ Tentar remarcar consulta válida (deve cancelar e redirecionar)
4. ✅ Verificar badge laranja em consultas próximas
5. ✅ Verificar atualização da lista após cancelamento
6. ✅ Verificar mensagens de erro/sucesso

### Observações Técnicas

- **Sem Mudanças no Backend**: Toda lógica implementada apenas no mobile
- **Compatibilidade**: Mantém compatibilidade com API existente
- **Performance**: Validação feita localmente sem chamadas de API extras
- **UX**: Feedback imediato ao usuário sobre ações permitidas/bloqueadas
