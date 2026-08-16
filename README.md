# Teste de QI

Aplicativo de teste de QI em React Native (Expo Router), com 30 questões
sorteadas por rodada entre um banco de mais de 100, resultado com percentil e
desempenho por área, histórico de evolução e três idiomas.

Gratuito e sem compras. Funciona offline — nenhum dado sai do aparelho.

| | |
|---|---|
| **Package** | `com.lhdiniz.testeqi` (imutável após o 1º upload) |
| **Expo SDK** | 52 |
| **Idiomas** | pt · en · es |

## Rodando localmente

```bash
yarn install
yarn start          # Metro; abra no Expo Go ou num dev build
yarn android        # direto no emulador/aparelho Android
```

Verificações:

```bash
npx tsc --noEmit                          # tipos
npx expo export --platform android        # confirma que o bundle fecha
```

## Estrutura

```
app/                 6 telas planas (expo-router)
  _layout.tsx        Stack raiz + ThemeProvider
  index.tsx          Home
  test.tsx           Teste
  results.tsx        Resultado
  history.tsx        Histórico
  settings.tsx       Ajustes

components/ui/       Primitivas (Button, Card, Screen, ProgressBar, ScoreCurve…)
constants/theme.ts   Tokens de design — fonte única de cor/espaço/tipografia
context/             ThemeContext (claro/escuro/sistema, persistido)
data/questions.ts    Metadados das questões (categoria, peso, dificuldade)
assets/i18n/         Textos das questões e da interface, por idioma
assets/questions/    150 SVGs das matrizes de padrão
utils/iqCalculator   Pontuação, percentil e recorte por categoria
store/               Material de publicação (ASO, fichas, privacidade)
```

### Convenções

- **Cores só via `useAppTheme()`.** Nada de hex solto nas telas — os tokens
  ficam em `constants/theme.ts` e existem em claro e escuro.
- **Texto só via `<ThemedText variant="…">`.** A escala tipográfica define
  `lineHeight` explicitamente porque o padrão do Android corta acentos.
- **Todo texto visível passa por `t()`.** Chaves novas vão nos três arquivos de
  `assets/i18n/translations/`.

## Como a pontuação é calculada

`utils/iqCalculator.ts` soma o peso das questões acertadas, divide pelo peso
total **das questões respondidas** (um teste interrompido não é penalizado),
converte para z-score contra uma calibração fixa e mapeia para a escala de média
100 e desvio 15. O percentil sai da CDF normal.

Não é um teste normatizado — não há amostra populacional. As constantes de
calibração (`EXPECTED_RATIO`, `RATIO_SPREAD`) são o único ponto a ajustar se um
dia houver dados reais.

## Publicação

Todo o material está em `store/`:

- `ASO.md` — estratégia de palavras-chave e por que os textos são o que são
- `listing-pt-BR.md`, `listing-es-419.md`, `listing-en-US.md` — prontos para colar
- `privacy-page/` — política de privacidade em HTML, pronta para hospedar
- `ADMOB.md` — integração de anúncios e passo a passo do console
- `ICON-BRIEF.md` — prompts para gerar ícone e feature graphic
- `CHECKLIST.md` — passo a passo até a produção
- `screenshots/` — rascunhos gerados do build web, para enquadramento

## Anúncios

AdMob integrado via `react-native-google-mobile-ads`, rodando com os **IDs de
teste oficiais do Google**. Para ativar os IDs reais, crie `.env.local`
(ignorado pelo git) e troque o App ID no `app.json` — passo a passo em
`store/ADMOB.md`.

Em `__DEV__` o app usa IDs de teste mesmo com os reais configurados: servir
anúncio real em build de desenvolvimento é violação dos termos do AdMob.

| Peça | Onde |
|---|---|
| Inicialização + consentimento UMP | `context/AdsContext.tsx` |
| Banner ancorado adaptativo | `components/ui/AdSlot.tsx` |
| Intersticial com trava de frequência | `hooks/useGatedInterstitial.ts` |
| IDs e limites | `constants/ads.ts` |

Banner ancorado no rodapé das cinco telas; só ocupa altura depois de carregar,
para não deixar faixa vazia quando a requisição falha.

O intersticial aparece entre o fim do teste e o resultado, inclusive no primeiro
teste — decisão deliberada para um app de sessão única, explicada em
`store/ADMOB.md`. O resultado é gravado no histórico antes do anúncio, então
nada se perde se ele falhar.
