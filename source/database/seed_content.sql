-- ============================================================
-- DogFlow — Seed de Conteúdo Completo
-- Versão 2.0 — Conteúdo alinhado ao produto "Xixi em 7 dias"
-- Executar no Supabase SQL Editor após o schema.sql
-- ============================================================

-- ── 1. LIMPA MÓDULOS E STEPS ANTERIORES (idempotente) ──────
delete from training_steps where module_id in (
  select id from training_modules where product = 'dogflow_7dias'
);
delete from training_modules where product = 'dogflow_7dias';

-- ── 2. MÓDULOS CORRETOS — FOCO EM XIXI ─────────────────────
insert into training_modules (id, product, title, description, order_index, plan_required, unlock_hours) values
  ('00000000-0000-0000-0000-000000000001', 'dogflow_7dias', 'Boas-vindas ao DogFlow',             'Entenda como o método funciona e prepare o ambiente',                                   0, 'desafio', 0),
  ('00000000-0000-0000-0000-000000000002', 'dogflow_7dias', 'Dia 1 — Por que ele faz isso?',       'A lógica canina do xixi: entenda antes de corrigir',                                   1, 'desafio', 0),
  ('00000000-0000-0000-0000-000000000003', 'dogflow_7dias', 'Dia 2 — Mapeando o Padrão',           'Identifique horários, locais e gatilhos do seu cão',                                   2, 'desafio', 24),
  ('00000000-0000-0000-0000-000000000004', 'dogflow_7dias', 'Dia 3 — Criando a Zona Certa',        'Apresente e reforce o local correto de forma positiva',                                3, 'desafio', 48),
  ('00000000-0000-0000-0000-000000000005', 'dogflow_7dias', 'Dia 4 — Comando "Xixi Aqui"',         'Ensine o cão a fazer no lugar certo sob comando',                                      4, 'desafio', 72),
  ('00000000-0000-0000-0000-000000000006', 'dogflow_7dias', 'Dia 5 — Reforço e Consistência',      'O que fazer quando ele acerta — e quando erra',                                        5, 'desafio', 96),
  ('00000000-0000-0000-0000-000000000007', 'dogflow_7dias', 'Dia 6 — Casos Difíceis',              'Cão teimoso, idoso, apartamento pequeno: soluções específicas',                        6, 'desafio', 120),
  ('00000000-0000-0000-0000-000000000008', 'dogflow_7dias', 'Dia 7 — Missão Cumprida 🏆',          'Consolidação, rotina definitiva e certificado de conclusão',                           7, 'desafio', 144),
  -- Módulos de assinatura
  ('00000000-0000-0000-0000-000000000009', 'dogflow_silencioso', 'Módulo Cão Silencioso',          'Elimine o latido excessivo em 3 dias',                                                 0, 'basico', 0),
  ('00000000-0000-0000-0000-000000000010', 'dogflow_calmo',      'Protocolo Cão Calmo',            'Resolva a ansiedade de separação em 7 dias',                                           0, 'premium', 0);

-- ── 3. STEPS — INTRO ────────────────────────────────────────
insert into training_steps (module_id, order_index, title, objective, explanation, training, common_error, practical_task, checklist) values
(
  '00000000-0000-0000-0000-000000000001', 0,
  'Como o DogFlow funciona',
  'Entender a estrutura do programa e o que esperar nos próximos 7 dias.',
  'O DogFlow é um método de 10 minutos por dia baseado em reforço positivo — a mesma técnica usada por adestradores profissionais. Você não vai gritar, não vai punir. Vai ensinar o seu cão que fazer xixi no lugar certo é a melhor decisão que ele pode tomar.

Cada dia tem 3 componentes: entendimento, treino prático e checklist. O checklist não é opcional — ele garante que você realmente fez o treino antes de avançar.',
  'Hoje não tem treino ativo. Reserve 5 minutos para:
1. Identificar qual é o local "errado" onde seu cão costuma fazer xixi (sofá, tapete, corredor...)
2. Identificar o local "certo" onde você quer que ele faça (tapete higiênico, jardim, calçada...)
3. Ter em mãos: petiscos pequenos (do tamanho de um grão de arroz), paciência.',
  'Achar que o cão "sabe que está errado" quando volta com a cabeça baixa. Ele não sabe — ele aprendeu que você fica bravo depois. São coisas diferentes.',
  'Escolha um petisco que seu cão acha irresistível. Esse petisco será usado EXCLUSIVAMENTE no treino de xixi durante os 7 dias. A exclusividade aumenta o valor percebido pelo cão.',
  '["Li como o método funciona", "Identifiquei o local errado que meu cão usa", "Identifiquei o local certo onde quero que ele faça", "Tenho petiscos separados para o treino", "Estou pronto para começar amanhã"]'
);

-- ── 4. STEPS — DIA 1 ────────────────────────────────────────
insert into training_steps (module_id, order_index, title, objective, explanation, training, common_error, practical_task, checklist) values
(
  '00000000-0000-0000-0000-000000000002', 0,
  'Por que cães fazem xixi fora do lugar',
  'Entender a lógica canina antes de tentar corrigir o comportamento.',
  'Cães não fazem xixi no sofá para te irritar. Eles fazem porque:

1. Não aprenderam ainda onde é o local certo
2. Têm muito espaço livre sem supervisão
3. O cheiro de xixi anterior marca o local como "banheiro"
4. Ansiedade ou excitação reduz o controle da bexiga

O erro mais comum dos donos é reagir com raiva DEPOIS que aconteceu. O cão não conecta sua raiva ao xixi de 5 minutos atrás — ele conecta ao seu retorno. Isso piora a ansiedade e aumenta os acidentes.',
  'Observação ativa — 10 minutos:
Sente perto do seu cão e observe sem interferir. Note:
• Quanto tempo após acordar ele precisa fazer xixi?
• Quanto tempo após comer?
• Ele dá sinais antes (farejar, girar em círculos, agachar)?
• Em que parte da casa ele prefere?

Anote no papel ou no celular. Esses dados são ouro nos próximos dias.',
  'Pegar o cão no flagra e gritar. Isso ensina o cão a esconder o comportamento — ele vai procurar cantos mais reservados para fazer. O resultado é o oposto do que você quer.',
  'Faça um mapa mental ou físico da sua casa e marque os locais onde os acidentes acontecem com mais frequência. Você vai usar isso no Dia 2.',
  '["Entendi por que meu cão faz xixi fora (não é maldade)", "Observei meu cão por 10 minutos", "Anotei os sinais que ele dá antes de fazer", "Identifiquei os horários mais comuns de acidente", "Sei onde ele prefere fazer (local favorito errado)"]'
),
(
  '00000000-0000-0000-0000-000000000002', 1,
  'A regra das 3 horas',
  'Criar uma rotina básica de saídas para reduzir acidentes imediatamente.',
  'Filhotes de até 6 meses têm bexiga pequena — precisam fazer xixi a cada 1-2 horas. Cães adultos conseguem segurar de 4 a 6 horas. Mas quando não há rotina, o cão vai quando a bexiga enche — onde estiver.

A regra das 3 horas: leve seu cão ao local certo a cada 3 horas durante a vigília, independente de ele dar sinais. Especialmente:
• Logo ao acordar (antes de qualquer coisa)
• Após comer
• Após brincar
• Antes de dormir',
  'Implemente a regra das 3 horas hoje:
1. Configure um alarme a cada 3 horas enquanto estiver em casa
2. A cada alarme: leve o cão diretamente ao local certo (no colo se necessário)
3. Aguarde 3-5 minutos parado, sem brincar
4. Se ele fizer: recompensa imediata (petisco + elogio animado)
5. Se não fizer: sem reação, volta para dentro, tenta de novo em 30 minutos',
  'Levar ao local certo e brincar com o cão lá fora antes que ele faça. Ele associa a saída com brincadeira, não com xixi. Faça xixi PRIMEIRO, brincadeira DEPOIS.',
  'Configure os alarmes agora para hoje. Cada vez que ele fizer no local certo hoje, anote no celular com o horário. No final do dia você vai ter o mapa real de quando ele precisa ir.',
  '["Entendi a regra das 3 horas", "Configurei os alarmes no celular", "Levei meu cão ao local certo pelo menos 3 vezes hoje", "Recompsensei cada acerto imediatamente", "Anotei os horários em que ele fez no local certo"]'
);

-- ── 5. STEPS — DIA 2 ────────────────────────────────────────
insert into training_steps (module_id, order_index, title, objective, explanation, training, common_error, practical_task, checklist) values
(
  '00000000-0000-0000-0000-000000000003', 0,
  'Mapeando o padrão do seu cão',
  'Criar um mapa de comportamento personalizado baseado nos dados do Dia 1.',
  'Todo cão tem um padrão. Quando você conhece o padrão, você antecipa o acidente em vez de reagir a ele.

Os 4 padrões mais comuns:
1. Padrão temporal: sempre 20 minutos após comer, sempre ao acordar
2. Padrão de excitação: visita chegou, chegou em casa, hora de brincar
3. Padrão de estresse: sozinho, mudança de rotina, barulho externo
4. Padrão territorial: mesmos locais, sempre os cantos escuros

Com os dados de ontem você já consegue identificar qual é o padrão do SEU cão.',
  'Análise dos dados — 10 minutos:
1. Olhe as anotações de ontem
2. Identifique: qual padrão seu cão tem? (temporal, excitação, estresse, territorial)
3. Escreva os 3 horários de MAIOR RISCO de acidente (ex: 7h, 12h, 19h)
4. Escreva os 3 locais de MAIOR RISCO na sua casa

Esses 3 horários e 3 locais são onde você vai focar toda a atenção nos próximos dias.',
  'Tentar memorizar os padrões sem anotar. Sem dado concreto, você age na intuição — e a intuição costuma estar errada. Escreve.',
  'Monte sua "tabela de risco": uma lista simples com os horários de risco e locais de risco do SEU cão. Coloca no celular ou imprime e gruda na geladeira.',
  '["Analisei os dados que coletei ontem", "Identifiquei o padrão principal do meu cão", "Listei os 3 horários de maior risco", "Listei os 3 locais de maior risco", "Tenho minha tabela de risco pronta"]'
),
(
  '00000000-0000-0000-0000-000000000003', 1,
  'Limpeza que elimina o cheiro — e o problema',
  'Remover completamente o marcador de xixi dos locais errados.',
  'O nariz de um cão é 100.000 vezes mais sensível que o seu. Quando você limpa o xixi com água ou limpador comum, você não vê e não cheira mais — mas ele cheira perfeitamente. E o cheiro diz: "aqui é banheiro."

Produtos que NÃO funcionam: água com sabão, multiuso, água sanitária (o cloro mascara para humanos, não para cães).

O que funciona: enzymatic cleaner (limpador enzimático) — as enzimas consomem as proteínas do xixi e eliminam o odor na raiz. Se não tiver, use: 1 parte de vinagre branco + 2 partes de água + algumas gotas de detergente. Aplique, aguarde 5 minutos, absorva com papel.',
  'Limpeza completa hoje:
1. Identifique todos os locais onde ele já fez xixi na casa
2. Aplique o limpador enzimático (ou solução de vinagre) em cada um
3. Aguarde 5 minutos de contato
4. Absorva com papel toalha, não esfregue
5. Deixe secar completamente

Opcional mas eficiente: coloque uma cama ou tigela de água do cão nos locais de acidente frequente. Cão raramente urina onde dorme ou come.',
  'Usar água sanitária achando que vai eliminar o odor. Elimina para você. Para ele, continua lá.',
  'Faça a limpeza completa de todos os locais de acidente hoje. Depois teste: passe um papel branco no local limpo e cheira o papel. Se sentir algum cheiro de amônia, repetir a limpeza.',
  '["Comprei ou preparei o limpador enzimático", "Limpei todos os locais de acidente corretamente", "Coloquei objetos do cão em locais críticos de acidente", "Os locais estão limpos e secos", "Sei por que a limpeza correta é parte do treinamento"]'
);

-- ── 6. STEPS — DIA 3 ────────────────────────────────────────
insert into training_steps (module_id, order_index, title, objective, explanation, training, common_error, practical_task, checklist) values
(
  '00000000-0000-0000-0000-000000000004', 0,
  'Apresentando o local certo',
  'Fazer o cão associar o local correto com algo positivo.',
  'O cão não vai ao local certo porque ninguém nunca o apresentou como algo especial. Para ele, todos os locais da casa são iguais.

Você vai mudar isso hoje criando uma associação forte: local certo = melhor coisa que existe.

A técnica se chama "carregamento do local": você vai ao local certo com o cão várias vezes ao longo do dia, mesmo sem ele precisar fazer xixi, e cria momentos positivos lá — petisco, elogio, brincadeira curta.',
  'Carregamento do local — faça 5 vezes hoje:
1. Leve o cão ao local certo (no colo ou na guia curta)
2. Assim que chegar lá: dê 2-3 petiscos um por um, elogie com voz animada
3. Fique lá 2 minutos em silêncio — se ele fizer xixi: jackpot (5 petiscos + festa)
4. Se não fizer: sem problema, volta para dentro
5. Repita a cada 2 horas

O objetivo hoje não é que ele faça — é que ele comece a achar o local certo o melhor lugar do mundo.',
  'Só ir ao local quando o cão está com urgência. Aí vira pressão, não associação positiva. Vá também quando não há urgência, só para criar a conexão positiva.',
  'Faça uma marcação no local certo — uma fita, um objeto, qualquer coisa que só fica lá. Isso ajuda o cão a identificar o local mais rápido. Você vai remover depois que o hábito estiver consolidado.',
  '["Entendi o conceito de carregamento do local", "Fui ao local certo com meu cão pelo menos 5 vezes hoje", "Usei petiscos exclusivos em cada visita ao local certo", "Celebrei cada xixi no lugar certo com festa e petisco", "Meu cão começa a mostrar interesse no local certo"]'
),
(
  '00000000-0000-0000-0000-000000000004', 1,
  'Supervisão ativa — a regra da linha',
  'Evitar acidentes através de supervisão inteligente.',
  'Você não consegue treinar o que não vê. A maioria dos acidentes acontece quando o dono está desatento.

A regra da linha: quando você não puder supervisionar ativamente, o cão fica limitado a um espaço pequeno onde você vê tudo. Isso não é punição — é gestão do ambiente enquanto o treino acontece.

Opções de supervisão:
• Guia longa presa à sua cintura (o cão fica colado em você)
• Espaço fechado pequeno com tapete higiênico
• Grade de contenção no cômodo onde você está',
  'Implemente a regra da linha hoje:
1. Quando estiver em casa e ativo: use a guia longa presa à cintura
2. Quando não puder supervisionar (banho, trabalho, dormir): espaço contido com tapete
3. Nunca deixe o cão solto na casa inteira sem supervisão durante o treinamento

O cão não pode errar sem que você veja. Se ele erra sem sua presença, o aprendizado não acontece.',
  'Dar liberdade total achando que o cão "já sabe." Durante o treinamento, liberdade é inimiga do progresso. Restrinja agora, liberte depois que o hábito estiver estabelecido.',
  'Monte o espaço contido hoje — mesmo que não use agora, ter pronto garante que você vai usar quando precisar. Um xPen, grade de bebê ou banheiro pequeno com tapete funcionam bem.',
  '["Entendi a regra da linha", "Tenho uma forma de supervisão ativa (guia na cintura ou espaço contido)", "Montei o espaço contido para quando não puder supervisionar", "Não deixei meu cão sem supervisão hoje", "Continuo com a regra das 3 horas do Dia 1"]'
);

-- ── 7. STEPS — DIA 4 ────────────────────────────────────────
insert into training_steps (module_id, order_index, title, objective, explanation, training, common_error, practical_task, checklist) values
(
  '00000000-0000-0000-0000-000000000005', 0,
  'Introduzindo o comando "Xixi aqui"',
  'Ensinar o cão a fazer xixi em resposta a um comando verbal.',
  'A partir de hoje você vai adicionar uma palavra ao momento que o cão está fazendo xixi no local certo. Com repetição, essa palavra vai virar um gatilho: o cão vai fazer xixi quando você falar a palavra, não só quando a bexiga encher.

Isso é chamado de "colocar um comportamento sob comando." É o mesmo princípio do "senta" — o cão aprende que a palavra prediz uma recompensa se ele fizer o comportamento.

Palavras comuns: "faz xixi", "vai lá", "vai fazer". Escolha uma e use sempre a mesma.',
  'Treino do comando — durante cada saída hoje:
1. Leve ao local certo como de costume
2. Fique parado e aguarde silenciosamente
3. ASSIM QUE ele começar a agachar ou cheirar indicando que vai fazer: diga a palavra escolhida UMA VEZ, com voz calma
4. Enquanto ele estiver fazendo: repita a palavra suavemente (não muito alto)
5. Imediatamente ao terminar: jackpot (5 petiscos + muita festa)

Não diga a palavra antes — apenas quando ele já está iniciando o comportamento.',
  'Dizer a palavra antes de ele estar prestes a fazer. Ele não entende o que você quer — e a palavra perde o significado. A palavra vem DURANTE o comportamento, não antes.',
  'Escolha sua palavra agora e comprometa-se a usar APENAS ela por todos os 7 dias. Anote no celular. Se tiver família em casa, todos precisam usar a mesma palavra.',
  '["Escolhi minha palavra de comando e avisei a família", "Disse a palavra durante (não antes) que meu cão fazia xixi no local certo", "Dei jackpot (5 petiscos) cada vez que ele terminou no local certo", "Fiz pelo menos 4 saídas ao local certo hoje", "Consigo perceber que ele começa a associar a palavra com o comportamento"]'
),
(
  '00000000-0000-0000-0000-000000000005', 1,
  'Lidando com o flagra',
  'Saber exatamente o que fazer quando pegar o cão no flagra.',
  'Pegar no flagra é oportunidade de ouro — SE você reagir certo.

O que fazer nos primeiros 2 segundos do flagra:
1. Interrupção suave: faça um som (ah!, oi!, upa!) — não grite, apenas interrompa
2. Imediatamente leve ao local certo (no colo se necessário)
3. Se ele completar lá: recompensa normal (não jackpot — ele começou errado)
4. Limpe o local errado com o limpador enzimático

O que NÃO fazer:
• Gritar ou bater
• Enfiar o nariz no xixi
• Punir minutos depois (ele não vai conectar)
• Ignorar e não levar ao local certo',
  'Role play mental hoje:
Imagine as últimas 3 vezes que seu cão teve um acidente. Agora refaça a cena mentalmente com a reação correta: interrupção suave → local certo → recompensa se completar lá.

Isso prepara seu cérebro para reagir automaticamente quando acontecer de verdade.',
  'Punir depois do fato. "Olha o que você fez!" enquanto aponta para o xixi não ensina nada — só assusta o cão e aumenta a ansiedade, que piora os acidentes.',
  'Cole um lembrete na porta do banheiro ou da cozinha: "FLAGRA: som suave → local certo → recompensa se completar." É para você, não para o cão.',
  '["Sei o que fazer nos primeiros 2 segundos de um flagra", "Não puní meu cão após um acidente hoje", "Se houve flagra, usei a técnica correta", "Continuei com as saídas programadas e o comando verbal", "Tenho o limpador enzimático sempre pronto"]'
);

-- ── 8. STEPS — DIA 5 ────────────────────────────────────────
insert into training_steps (module_id, order_index, title, objective, explanation, training, common_error, practical_task, checklist) values
(
  '00000000-0000-0000-0000-000000000006', 0,
  'Reforço inteligente — quando e quanto recompensar',
  'Aprender a calibrar as recompensas para manter o comportamento sem depender de petiscos para sempre.',
  'Você não vai usar petiscos para sempre. O objetivo é que o hábito se instale e o comportamento aconteça naturalmente. Mas agora, na fase de instalação, o petisco é a ferramenta principal.

Escalonamento de reforço:
• Dias 1-4: recompensa TODA vez que acertar (100%)
• Dias 5-7: recompensa aleatória (70% das vezes) — isso na verdade fortalece o comportamento
• Após dia 7: elogio verbal é suficiente na maioria das vezes

A recompensa aleatória cria mais resistência que a recompensa garantida — é o mesmo princípio que torna jogos viciantes.',
  'Escalonamento hoje:
Recompense 7 de cada 10 acertos com petisco (pule 3 ao acaso). Em todos os 10, elogie verbalmente. Observe se o comportamento se mantém ou diminui.

Se diminuir muito: volta para 100% por mais 1-2 dias antes de escalonar.',
  'Parar de recompensar abruptamente depois que o cão "aprendeu." O comportamento desaparece. Escalone gradualmente, nunca corte de vez.',
  'Crie um sistema simples de contagem: 10 pedrinhas no bolso esquerdo = acertos. A cada acerto com petisco, move uma pedra para o bolso direito. Quando o direito tiver 7 pedras, parou os petiscos por hoje (mas continua o elogio).',
  '["Entendi o escalonamento de reforço", "Recompnsei aproximadamente 7 de 10 acertos com petisco hoje", "Elogiei verbalmente todos os 10 acertos", "O comportamento se manteve estável", "Estou vendo progresso real comparado ao Dia 1"]'
),
(
  '00000000-0000-0000-0000-000000000006', 1,
  'Upsell: próximo nível 🌟',
  'Entender o que vem depois do xixi resolvido.',
  'Parabéns por chegar ao Dia 5. O xixi já está muito mais sob controle.

Mas você provavelmente está percebendo outras coisas que quer melhorar no seu cão. Isso é normal — quando um problema é resolvido, enxergamos os outros com mais clareza.

Os dois problemas mais comuns que aparecem depois do xixi:

🔇 Latido excessivo — especialmente quando você sai de casa ou tem visitas
😰 Ansiedade de separação — destruição, xixi de ansiedade, choro quando fica sozinho

Temos módulos específicos para cada um desses no DogFlow. Se você ainda não tem acesso, pode adicionar agora diretamente aqui no app.',
  'Reflexão — 5 minutos:
Além do xixi, qual é o próximo comportamento que mais te incomoda no seu cão?
• Latido
• Ansiedade quando fica sozinho
• Pular nas pessoas
• Morder (filhote)
• Puxar a guia

Anote. Isso vai ajudar a priorizar o que trabalhar depois do Dia 7.',
  'Achar que um módulo resolve todos os problemas. Cada comportamento tem sua técnica específica. O DogFlow tem módulos para cada um.',
  'Se você ainda não tem o Módulo Cão Silencioso ou Protocolo Cão Calmo, acesse a aba de planos e desbloqueie agora com desconto especial de aluno.',
  '["Completei 5 dias do desafio", "Estou vendo melhora real no comportamento do meu cão", "Identifiquei o próximo problema que quero resolver", "Sei que cada problema tem técnica específica", "Considerei os módulos complementares"]'
);

-- ── 9. STEPS — DIA 6 ────────────────────────────────────────
insert into training_steps (module_id, order_index, title, objective, explanation, training, common_error, practical_task, checklist) values
(
  '00000000-0000-0000-0000-000000000007', 0,
  'Casos especiais — cão "teimoso"',
  'Resolver situações específicas que travam o progresso de alguns cães.',
  'Se você chegou ao Dia 6 com progresso lento, provavelmente é um desses casos:

Caso 1 — Cão que faz xixi na frente de você e sai andando: ele não aprendeu ainda que essa ação tem consequências positivas no local certo. Solução: aumentar o jackpot (mais petiscos, mais festa) e diminuir o intervalo entre saídas.

Caso 2 — Cão que só faz quando está sozinho (esconde o comportamento): ele aprendeu que fazer perto de você é perigoso. Isso vem de punição anterior. Solução: reconstruir confiança com mais tempo juntos, menos reação a acidentes.

Caso 3 — Cão idoso: bexiga menor, hábitos antigos mais profundos. Progresso existe mas é mais lento — 14 dias em vez de 7 é normal.

Caso 4 — Apartamento sem saída fácil: tapete higiênico em local fixo + troca consistente a cada 6h + higienizador enzimático para manter o cheiro "convidativo".',
  'Diagnóstico específico hoje:
Identifique em qual caso você está e aplique a solução específica por 48 horas antes de desistir. A maioria dos casos "difíceis" resolve com ajuste fino, não com método diferente.',
  'Trocar de método quando o atual está funcionando só devagar. Consistência bate variedade. Mude só o que está claramente errado, não o método todo.',
  'Escreva em uma linha: "Meu cão está no Caso ____ e vou fazer ____ por 48 horas." Isso cria comprometimento e clareza.',
  '["Identifiquei em qual caso especial meu cão se encaixa (ou confirmei que não é caso especial)", "Apliquei o ajuste específico para o meu caso", "Mantive a consistência nas saídas programadas", "Não mudei o método por completo — fiz ajuste fino", "Estou no caminho certo para o Dia 7"]'
),
(
  '00000000-0000-0000-0000-000000000007', 1,
  'Prevenindo recaídas',
  'Entender por que recaídas acontecem e como evitá-las.',
  'Recaída é normal e previsível. Não significa que o treino falhou. Acontece quando:

• Mudança de rotina (viagem, visitantes, mudança de casa)
• Doença ou infecção urinária (sempre descartar se acidentes súbitos aumentam)
• Estresse (fogos de artifício, reforma na vizinhança)
• Liberdade demais cedo demais

O protocolo de recaída:
1. Volte para a supervisão ativa por 3 dias
2. Volte para recompensa 100% das vezes
3. Relimpe todos os locais de acidente
4. Não puna — recaída com punição vira recaída com ansiedade (pior)',
  'Prevenção hoje:
Liste 3 situações futuras que podem causar recaída no SEU cão. Para cada uma, escreva o que vai fazer quando acontecer. Ter o plano antes da crise é muito mais eficaz que improvisar durante.',
  'Interpretar recaída como falha permanente e desistir. Recaída é um sinal de que o hábito ainda está se consolidando — não que o método não funciona.',
  'Salve o "protocolo de recaída" (3 passos acima) no celular em local fácil de achar. Quando precisar, você vai estar estressado — não é hora de procurar informação.',
  '["Entendi por que recaídas acontecem", "Listei 3 situações de risco para o MEU cão", "Tenho o protocolo de recaída salvo", "Sei que recaída não é fracasso", "Estou pronto para o Dia 7 amanhã"]'
);

-- ── 10. STEPS — DIA 7 ───────────────────────────────────────
insert into training_steps (module_id, order_index, title, objective, explanation, training, common_error, practical_task, checklist) values
(
  '00000000-0000-0000-0000-000000000008', 0,
  'Revisão: o que você construiu em 7 dias',
  'Consolidar tudo que foi aprendido e criar a rotina definitiva.',
  'Em 7 dias você:
✅ Entendeu a lógica do comportamento canino
✅ Mapeou o padrão específico do seu cão
✅ Limpou os marcadores de xixi antigos
✅ Criou associação positiva com o local certo
✅ Ensinou o comando verbal
✅ Aprendeu a reagir ao flagra sem punição
✅ Calibrou as recompensas para durabilidade
✅ Tem plano para casos difíceis e recaídas

O hábito leva de 21 a 66 dias para se consolidar completamente. Os próximos 14 dias são os mais importantes — é quando a maioria das pessoas relaxa e o hábito desfaz.',
  'Rotina definitiva — crie agora:
Escreva a rotina que vai seguir por mais 14 dias:
• Horários de saída (mínimo 4 por dia)
• Palavra de comando
• Protocolo de recompensa (70% petisco, 100% elogio)
• O que fazer no flagra
• O que fazer se houver recaída

Isso não é opcional — é a diferença entre um resultado de 7 dias e um hábito para a vida.',
  'Parar o treino completamente no Dia 7. O programa ensinou a base — os próximos 14 dias consolidam. Manutenção não é igual a treinamento intenso, mas não é zero.',
  'Monte sua rotina definitiva por escrito e coloque onde vai ver todo dia (geladeira, espelho do banheiro, tela de bloqueio do celular).',
  '["Revisei tudo que aprendi nos 7 dias", "Criei minha rotina definitiva por escrito", "Estou comprometido com mais 14 dias de manutenção", "Tenho o protocolo de recaída em mãos", "Meu cão progrediu visivelmente em 7 dias"]'
),
(
  '00000000-0000-0000-0000-000000000008', 1,
  'Certificado e próximos passos 🏆',
  'Celebrar a conquista e definir o que vem a seguir.',
  'Parabéns. Você completou o Desafio DogFlow de 7 Dias.

Isso não é pouca coisa. A maioria das pessoas que tem problemas com o cão não faz nada — você fez. Por 7 dias consecutivos. Isso diz muito sobre você como dono.

Seu cão não é o mesmo de 7 dias atrás. E você também não é.

O que vem a seguir depende do que você quer para o seu cão:
• Se o xixi ainda precisa de reforço: mais 14 dias de manutenção
• Se surgiu outro problema (latido, ansiedade): módulos complementares no app
• Se quer aprofundar: plano de assinatura com novos conteúdos todo mês',
  'Celebração ativa:
1. Tire uma foto do seu cão agora
2. Escreva uma linha: o que mudou em 7 dias?
3. Compartilhe nos stories com #DogFlow7Dias — você merece o reconhecimento
4. Baixe seu certificado abaixo',
  'Não celebrar. Celebrar vitórias (suas e do seu cão) é parte do processo de manutenção — mantém você motivado para os próximos 14 dias.',
  'Baixe seu certificado personalizado. Guarda — daqui a 30 dias você vai olhar para ele e lembrar do antes e depois.',
  '["Completei os 7 dias do Desafio DogFlow", "Escrevi o que mudou em 7 dias", "Tenho minha rotina de manutenção definida", "Baixei meu certificado", "Sei o que vem a seguir para mim e meu cão"]'
);

-- ── 11. TABELA VACINAS (nova feature) ──────────────────────
create table if not exists vaccines (
  id            uuid primary key default gen_random_uuid(),
  pet_id        uuid references pets(id) on delete cascade not null,
  user_id       uuid references auth.users(id) on delete cascade not null,
  name          text not null,
  date_applied  date not null,
  next_dose     date,
  veterinarian  text,
  notes         text,
  created_at    timestamptz not null default now()
);

create index if not exists idx_vaccines_pet_id  on vaccines(pet_id);
create index if not exists idx_vaccines_user_id on vaccines(user_id);
create index if not exists idx_vaccines_next    on vaccines(next_dose);

alter table vaccines enable row level security;

create policy "users manage own vaccines"
  on vaccines for all
  using (user_id = auth.uid());

-- ── 12. TABELA SAÚDE — peso, consultas, vermifugação ───────
create table if not exists health_records (
  id           uuid primary key default gen_random_uuid(),
  pet_id       uuid references pets(id) on delete cascade not null,
  user_id      uuid references auth.users(id) on delete cascade not null,
  type         text not null, -- weight | vet_visit | deworming | medication | allergy | other
  date         date not null,
  value        text,          -- peso em kg, nome do medicamento, etc.
  notes        text,
  created_at   timestamptz not null default now()
);

create index if not exists idx_health_pet_id  on health_records(pet_id);
create index if not exists idx_health_user_id on health_records(user_id);

alter table health_records enable row level security;

create policy "users manage own health records"
  on health_records for all
  using (user_id = auth.uid());

-- ── 13. TABELA STREAKS E CONQUISTAS ────────────────────────
create table if not exists user_streaks (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users(id) on delete cascade not null unique,
  current_streak   int not null default 0,
  longest_streak   int not null default 0,
  last_activity    date,
  total_days       int not null default 0,
  updated_at       timestamptz not null default now()
);

create table if not exists user_badges (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  badge_key   text not null, -- first_day | day3 | day7 | streak7 | streak30 | completed
  earned_at   timestamptz not null default now(),
  unique (user_id, badge_key)
);

alter table user_streaks enable row level security;
alter table user_badges  enable row level security;

create policy "users manage own streaks"
  on user_streaks for all using (user_id = auth.uid());

create policy "users manage own badges"
  on user_badges for all using (user_id = auth.uid());

-- ── 14. COLUNA photo_url NA TABELA PETS ────────────────────
alter table pets add column if not exists photo_url text;

-- ============================================================
-- FIM DO SEED — versão 2.0
-- ============================================================
