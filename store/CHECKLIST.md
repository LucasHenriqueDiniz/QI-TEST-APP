# Checklist de publicação

Ordem sugerida. Os itens marcados já estão feitos no código.

## 0. Bloqueador de 16 KB — RESOLVIDO

Ficou registrado aqui porque o diagnóstico custou caro e a armadilha volta a
cada SDK novo.

Ao instalar o build de desenvolvimento num Galaxy A15 com Android 16, o próprio
sistema abriu este aviso:

> **Este app não é compatível com 16 KB. Falha na verificação de alinhamento ELF.**
>
> `libgesturehandler.so`, `libexpo-modules-core.so`, `libreanimated.so`,
> `libappmodules.so`, `libhermestooling.so`, `libhermes.so`,
> `libreact_codegen_rnsvg.so` — segmento LOAD não alinhado

A regra do Google: *apps com `targetSdk` 35 ou maior precisam suportar páginas
de memória de 16 KB em dispositivos 64-bit para serem distribuídos na Play
Store.* A partir de **1º de fevereiro de 2027** nem atualização passa.

Nenhuma configuração resolvia isso no SDK 52 — o alinhamento vem das
bibliotecas nativas compiladas dentro do próprio React Native. Suporte a 16 KB
entrou no **RN 0.77 = Expo SDK 53**.

- [x] **Migrar o Expo SDK** — feito, e além do planejado: o projeto foi para o
      **SDK 57 (RN 0.86.2, React 19.2.3)**, não para o 54

O upgrade resolveu de uma vez:

| Problema | Situação agora |
|---|---|
| 16 KB — bloqueio de publicação | RN 0.86 já alinhado |
| `react-native-google-mobile-ads` travado na 15.7.0 | trava removida, hoje em `^16.4.0` |
| 15 pacotes desatualizados (`expo doctor`) | resolvidos no upgrade |
| Plugin `withKotlinMetadataCheck` | **continua obrigatório** — ver abaixo |

O plugin foi o único item que o upgrade **não** apagou, e isso era esperado: a
defasagem de Kotlin entre o Expo e o `play-services-ads` é estrutural, não um
bug de versão. Já foi observada dos dois lados da migração:

| Expo | Kotlin do projeto | play-services-ads | metadata |
|------|-------------------|-------------------|----------|
| 52   | 1.9               | 24.5.0            | 2.1      |
| 57   | 2.1               | 25.4.0            | 2.3      |

Detalhe completo em `ADMOB.md` e no cabeçalho de
`plugins/withKotlinMetadataCheck.js`.

> ✅ **Verificado em aparelho (19/10/2026):** build `development` do SDK 57
> (EAS `42bef35c`, commit `b26e06f`) instalado num Galaxy A15 com Android 16 —
> o mesmo aparelho que acusou o aviso. O aviso de 16 KB não apareceu, e as 46
> `.so` de 64 bits do APK têm segmentos LOAD alinhados em 16 KB (conferido por
> script; uma cópia adulterada para 4 KB foi reprovada, então o script pega o
> problema). `tsc` e `expo export` continuam cegos para essa classe de erro —
> a cada SDK novo, a prova é um build nativo, não eles.

## 1. Código — pronto

- [x] Roteamento funcionando (`app/_layout.tsx` e `app/index.tsx` existem)
- [x] `package` definitivo: `com.lhdiniz.testeqi` — **imutável após o 1º upload**
- [x] Nome do app: "Teste de QI"
- [x] `version: 1.0.0` — o `versionCode` é do EAS (`appVersionSource: "remote"`, §5)
- [x] Nenhuma compra no app (removidas loja e tela de desbloqueio)
- [x] Aviso de "apenas entretenimento" visível na home, no resultado e em Sobre
- [x] Nenhuma permissão sensível declarada
- [x] Link da política de privacidade dentro do app
- [x] AdMob integrado com consentimento UMP (ver `ADMOB.md`)
- [x] Trocar os IDs de teste do AdMob pelos reais — App ID no `app.json`, ad
      units no `.env.local`. Confirmado no bundle com `expo export --clear`
- [x] Publicar a mensagem de consentimento UMP no console do AdMob (`ADMOB.md` §5)
      — "Regulamentações europeias", en + es + pt-PT, botão "Não consentir"
      ligado em todos os países. Sem ela o app logava "no form(s) configured"
      a cada abertura; depois, 0 erros em 3 aberturas e o UMP grava
      `IABTCF_gdprApplies=0` no Brasil
- [ ] Vincular o app à ficha da Play Store depois de publicar — o status hoje é
      "Requer revisão", e a revisão só começa quando o app estiver vinculado

## 2. Arte — ícone e feature graphic prontos, faltam as capturas

O ícone é a grade 3×3 com a célula faltando, do prompt principal de
`ICON-BRIEF.md`. Todos os derivados saem do mesmo arquivo de origem.

- [x] Ícone 512×512 PNG, sem transparência, sem cantos arredondados — `store/play-icon-512.png`
- [x] `assets/images/icon.png` (1024×1024) e `adaptive-icon.png` (foreground 1024×1024, dentro do círculo seguro de 66%)
- [x] `splash-icon.png` coerente com o ícone
- [x] Feature graphic 1024×500 — `feature-graphic-pt-BR.png`, `-es-419`, `-en-US`,
      mais `feature-graphic-base.png` sem texto, para outros idiomas
- [ ] 6 capturas por idioma, com legendas (roteiro em `ASO.md` §4)

O violeta do arquivo gerado saiu em `#523CE6`; os derivados foram normalizados
para o `#5B4FE9` da marca, senão o `icon.png` e o fundo do ícone adaptativo
(definido no `app.json`) apareceriam em tons diferentes no mesmo aparelho.

## 3. Política de privacidade — no ar, falta colar no Play Console

A página pronta (HTML autocontido, pt + en, tema claro/escuro) está em
`store/privacy-page/index.html`.

- [x] Subir para `lucashdo.com/teste-de-qi/privacy` — no repo `bento-portifolio`,
      em `artifacts/portfolio/public/teste-de-qi/privacy.html` (`.html` para o
      Pages servir a URL sem barra final, sem redirect). Mudou aqui? Copie lá.
- [x] Confirmar que abre sem login — `curl` sem cookie: 200, 0 redirects. Antes
      a mesma URL devolvia 200 com o shell do portfólio: status 200 não prova
      que a política está no ar, o `<title>` prova
- [x] Conferir que a URL bate com `PRIVACY_POLICY_URL` em `constants/app.ts`
      (e é a mesma cadastrada na mensagem de consentimento do AdMob)
- [ ] Colar a URL no Play Console (Política do app → Política de privacidade)

O que o Google verifica: página pública, sem login, não editável por terceiros,
que cite o app pelo nome e descreva a coleta do AdMob. Link quebrado depois de
publicado é violação de política — por isso o domínio próprio é preferível ao
GitHub Pages, que muda de URL se você renomear o repositório.

## 4. Play Console — tudo pronto menos as capturas e o AAB

Conta **pessoal** "Amayacrab" (é o nome que aparece como desenvolvedor na
loja). App criado em 19/10/2026 como "Teste de QI - Quiz de Lógica".

- [x] Conta de desenvolvedor verificada
- [x] Criar o app, **Grátis** (irreversível). Declarações aceitas: Políticas do
      Programa, Termos da Assinatura de apps do Google Play (o Google guarda a
      chave final; a keystore do EAS vira chave de upload) e leis de exportação
- [x] Ficha pt-BR (padrão), es-419 e en-US: título, descrições, ícone e um
      feature graphic por idioma, tudo de `store/`
- [ ] **Capturas de tela nos 3 idiomas** — esperam o redesenho da UI
      (`docs/pitches/ui-redesign.md`)
- [x] Categoria Educação, contato `lucas.diniz.hdo@gmail.com`, site
      `https://lucashdo.com` (o site da ficha é onde o AdMob procura o
      `app-ads.txt`)
- [x] Data safety, conforme a doc oficial do AdMob (versão de 16/10/2026):
      local aproximado (IP), interações no app, diagnóstico e IDs do
      dispositivo — coletados **e** compartilhados, obrigatórios, para
      análise, publicidade e prevenção a fraude; criptografados em trânsito
- [x] ID de publicidade: usa (a permissão `AD_ID` vem do play-services-ads)
- [x] Classificação IARC: **Livre** no Brasil, ESRB E, PEGI 3, USK 0
- [x] Público-alvo: **16–17 e 18+**, não 13+. Com 13–15 o Play avisa que, onde
      menor de 16 conta como criança (UE), a Política para Famílias se aplica e
      o anúncio para esses usuários vira não personalizado — paga menos.
      16+ mantém o público jovem e o anúncio normal para todos
- [x] Anúncios: **"Contém anúncios" — SIM**
- [x] Acesso: nada restrito, sem login. Governo, finanças e saúde: não

## 5. Build

O `eas.json` já está no repositório com três perfis. **Não rode
`eas build:configure`** — ele sobrescreve o arquivo.

| Perfil | Saída | Para quê |
|---|---|---|
| `development` | APK + dev client | O app não roda no Expo Go desde que o AdMob entrou; é este perfil que devolve um app rodável na sua máquina |
| `preview` | APK | Instalável direto, para testar em aparelho real e para os testadores |
| `production` | AAB | O que sobe na Play Store |

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile development   # primeiro: prova que o AdMob compila
eas build --platform android --profile production    # gera o .aab
```

### Antes do primeiro build de produção

O `.env.local` é ignorado pelo git, e o **EAS empacota o projeto a partir do
git** — ou seja, os ad unit IDs não chegam ao build na nuvem, e o app cai nos
IDs de teste sem dar erro nenhum. Registre as variáveis no próprio EAS:

```bash
eas env:set --name EXPO_PUBLIC_ADMOB_BANNER_ANDROID --value ca-app-pub-2600827684802809/6014793287 --environment production --visibility plaintext
eas env:set --name EXPO_PUBLIC_ADMOB_INTERSTITIAL_ANDROID --value ca-app-pub-2600827684802809/7500737524 --environment production --visibility plaintext
```

(`env:create` também funciona, mas está depreciado a partir do eas-cli 22.)

`plaintext` é correto aqui: valores `EXPO_PUBLIC_*` são inlinados no bundle que
vai para o aparelho de todo mundo, então não são segredo — tratá-los como
segredo só esconde o problema.

- [x] Registrar as duas variáveis no EAS — feitas no ambiente `production`.
      Ficaram **de fora** de `preview` de propósito: se o APK dos testadores
      servisse anúncio real, 12 pessoas clicando vira tráfego inválido
- [x] Deixar o EAS gerar e guardar a keystore — gerada na nuvem no 1º build.
      **Perder a keystore = perder o app**, não há como assinar atualização
      com outra chave
- [x] **Primeiro build nativo concluído** — EAS `e32118c6`, perfil
      `development`, APK gerado. Foi a primeira vez que o AdMob compilou.
      Esse build é do SDK 52 e não vale mais como prova
- [x] **Rodar um build `development` no SDK 57** — EAS `42bef35c`, commit
      `b26e06f`, 19/10/2026
- [x] Instalar o APK num aparelho e confirmar que o app abre e o banner carrega
      — Galaxy A15, Android 16: teste completo de 30 questões, banner em todas
      as telas, intersticial antes do resultado, histórico e tema claro
- [ ] Gerar o AAB de produção e testá-lo em aparelho real antes de subir
- [ ] Build `preview` e depois `production`
- [ ] Testar o `.aab` num aparelho real antes de enviar

### O que o EAS envia, e o que ele deixa para trás

O EAS empacota a **pasta de trabalho**, respeitando o `.gitignore` — não o
último commit. Mudanças sem commit vão junto; a página do build marca isso com
um asterisco no hash (`8e5e90e*`).

O que fica de fora é o que o `.gitignore` cobre. Na prática, isso significa
exatamente uma coisa neste projeto: **o `.env.local` não sobe**, e é por isso
que os ad unit IDs precisam estar registrados como variáveis do EAS.

### Por que `appVersionSource: "remote"`

Durante os 14 dias de teste fechado você vai subir várias versões, e cada uma
precisa de um `versionCode` inédito. Com `remote` + `autoIncrement`, o EAS
cuida disso. Com o controle manual no `app.json`, o erro só aparece no upload,
depois de esperar o build inteiro. Por isso o `app.json` não tem `versionCode`:
o EAS o ignoraria e ainda avisaria a cada build. Não recoloque.

## 6. Teste fechado — o gargalo real

Contas pessoais criadas depois de novembro de 2023 precisam de **12 testadores
rodando o app por 14 dias seguidos** antes de poder publicar em produção.

- [x] Faixa "Teste fechado - Alpha": Brasil, lista "Testadores Teste de QI",
      feedback em `lucas.diniz.hdo@gmail.com`. Falta só criar a versão (AAB)
      e enviar para revisão
- [ ] Juntar 12 e-mails Google (amigos, família, grupos de dev) — hoje a
      lista tem 1, o do dono. O painel do Play confirma a regra: 12 que
      **aceitaram** participar, por 14 dias
- [ ] Manter os 14 dias sem interrupção — se um testador sair, o contador
      pode voltar
- [ ] Só então solicitar acesso à produção

Comece isso **cedo**. É o item de maior prazo do projeto e não depende de código.

> **Superado em 19/10/2026** pelas decisões D6–D9 (`docs/architecture/ARCHITECTURE.md`)
> e por `docs/research/scoring-modes/README.md`: os modos passam a ser
> **Rápido 20 / Normal 40 / Detalhado 90**, o banco cresce para 188 questões, o
> cálculo vira EAP com faixa, entra uma tarefa de velocidade opcional, e o
> lançamento espera tudo isso. O texto abaixo fica como registro da análise
> anterior (15/30/60).

### Trabalho para rodar durante os 14 dias

O contador corre sozinho, então este é o momento de mexer no app sem custo de
prazo. Decidido: **três modos de teste — Rápido 15, Padrão 30, Completo 60.**

Por que 60 e não 75 ou 110: o banco tem 110 questões (padrões 30, semelhanças
20, matrizes 20, vocabulário 20, compreensão 20), e o `BLUEPRINT` mantém a
proporção por categoria. Em 75 a fatia de padrões daria exatamente 30 — todo
teste usaria o pool inteiro da maior categoria, e o rejogo perderia variedade.
Em 60, padrões usa 24 de 30 e as demais sobram. Passar disso exige ampliar o
banco de padrões, a um custo de 5 SVGs por questão nova.

- [ ] `hooks/useQuestionSelection.ts` — um `BLUEPRINT` por modo
- [ ] **`utils/iqCalculator.ts` — `RATIO_SPREAD` por modo.** Hoje é `0.18` fixo.
      O ruído amostral do acerto cai com √n, então o mesmo divisor aplicado a 15
      e a 60 questões faz o modo curto cuspir scores mais extremos e o longo
      achatar todo mundo perto de 100. Sem isso, a mesma pessoa tira 132 no
      Rápido e 106 no Completo — e isso vira avaliação de 1 estrela dizendo que
      o app é aleatório
- [ ] Seletor de modo na home
- [ ] Guardar o modo em `types/storage.ts`, senão o histórico compara maçã com
      laranja
- [ ] Chaves novas nos **três** arquivos de `assets/i18n/translations/`
- [ ] Atualizar as 3 fichas, os 3 feature graphics e o README — todos dizem
      "30 questões" hoje. Na descrição curta, "15, 30 ou 60" cabe em 66 dos 80
      caracteres e é diferencial real: o concorrente típico tem 20–30 fixas

## 7. Depois de publicar

- [ ] Monitorar Android vitals (ANR e crash rate) na primeira semana
- [ ] Deixar título e descrição parados por 30 dias antes de avaliar ASO

---

## Ordem cronológica sugerida

Como o teste fechado leva 14 dias parado, vale disparar em paralelo:

```
Dia 1     Conta de desenvolvedor + verificação de identidade
Dia 1-3   Ícone, feature graphic e capturas
Dia 3     Publicar política de privacidade
Dia 4     Primeiro build EAS + subir para teste fechado
Dia 4-18  14 dias de teste fechado  ← roda sozinho
Dia 5-15  Integrar AdMob e subir novas versões na faixa de teste
Dia 18    Solicitar produção
```
