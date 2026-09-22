# Prompt para redesenho da interface (bolt.new / v0 / similar)

Cole o bloco abaixo. Ele descreve o app, o design system atual e as restrições
que não podem ser quebradas.

> **Ressalva:** ferramentas desse tipo são fortes em web e irregulares em React
> Native. O prompt pede os **mesmos nomes de token** que já existem em
> `constants/theme.ts`, para que portar o resultado seja trabalho mecânico
> mesmo que a saída venha em web. Trate o retorno como **direção visual**, não
> como código para colar.

---

```
Preciso redesenhar a interface de um app React Native (Expo Router, TypeScript)
de teste de QI que vai para a Play Store. O app funciona bem, mas está
visualmente genérico: parece um formulário, não um produto. Quero algo bonito
e atrativo, que aumente a taxa de clique na loja e a sensação de valor.

## O que o app é

Teste de QI gratuito, offline, sem cadastro. 30 questões sorteadas de um banco
de 110, em 5 categorias: raciocínio visual (matrizes de padrão em SVG), lógica
numérica, semelhanças, vocabulário e compreensão. No fim mostra pontuação,
percentil e desempenho por área. Tem histórico com evolução. 3 idiomas
(pt/en/es). Monetizado só por banner e um intersticial.

## As 5 telas

1. **Home** — título, subtítulo, 3 bullets de valor, chips das 5 categorias
   medidas, botão "Começar teste", link "Sobre o teste", ícones de histórico e
   ajustes no topo
2. **Teste** — barra de progresso, número da questão, enunciado (texto ou SVG
   de matriz), 4 alternativas selecionáveis, botão avançar
3. **Resultado** — número do QI em destaque, curva de distribuição normal com
   a posição da pessoa, percentil, acertos, desempenho por categoria, botões
   de refazer e compartilhar
4. **Histórico** — lista de tentativas, sparkline de evolução, estado vazio
5. **Ajustes** — tema (claro/escuro/sistema), idioma, idade, links legais

## Design system que já existe — ESTENDA, não substitua

Use exatamente estes nomes de token, para eu conseguir portar:

Cores (claro / escuro):
  background   #FFFFFF / #0D0D18      surface   #F7F7FC / #171728
  surfaceAlt   #EFEFF7 / #1F1F36      border    #E4E4EF / #2C2C48
  text         #14142B / #F3F3F8      textMuted #63637E / #A2A2C0
  textFaint    #9797AF / #6E6E8E
  primary      #5B4FE9 / #6E63F0      primarySoft #EDEBFE / #221F44
  accent       #E8890C / #F0A93C      success #0F9D58 / #2DBE7B
  danger       #D92D46 / #F2536B

Espaçamento (passos de 4): xs 4, sm 8, md 12, lg 16, xl 24, xxl 32, xxxl 48
Raios: sm 8, md 12, lg 16, xl 24, pill 999
Tipografia: display 44/50, title 30/38, heading 22/30, subheading 18/26,
            body 16/24, caption 14/20, overline 12/16

Se propuser tokens novos, liste-os separadamente com nome e valor nos dois temas.

## O que quero que melhore

- **Hierarquia visual.** Hoje tudo tem o mesmo peso. A tela de resultado
  precisa ter um momento de impacto — o número do QI é a recompensa
- **Profundidade.** Cards chapados, sem elevação, sem gradiente, sem textura
- **Movimento.** Nenhuma animação hoje. Transição entre questões, revelação do
  resultado, progresso — tudo pode ganhar vida sem virar circo
- **A tela de teste é a mais vista** (30 vezes por sessão) e a mais sem graça.
  Ela precisa dar ritmo e sensação de avanço
- **Personalidade.** O app não tem nenhuma. Marca violeta e nada mais

## Restrições que NÃO podem ser quebradas

- **React Native, não web.** Sem CSS grid, sem hover, sem position: fixed.
  Estilos via StyleSheet ou objetos inline
- **Tema claro e escuro obrigatórios**, com contraste AA nos dois. O app tem
  seletor de tema e muita gente usa escuro
- **`lineHeight` sempre explícito** na tipografia. O padrão do Android corta
  acentos em português e espanhol
- **Texto cresce ~30% em pt e es** em relação ao inglês. Nada de layout que
  quebre com texto longo — sem largura fixa em botão ou chip
- **Um banner de anúncio ancorado no rodapé de todas as telas**, altura
  variável (só ocupa espaço depois de carregar). Reserve esse espaço no layout
- **Sem texto dentro de imagem** — tudo passa por i18n
- Alvo: celular, retrato apenas, `minSdk 24`

## O que entregar

1. As 5 telas implementadas, com dados de exemplo realistas em português
2. Os componentes reutilizáveis separados (botão, card, chip, barra de
   progresso, curva de resultado, sparkline)
3. Uma lista dos tokens novos que você introduziu
4. Uma nota curta explicando as decisões de hierarquia da tela de resultado

Priorize Home e Resultado — são as que viram captura de tela na loja e
determinam a instalação.
```

---

## Ao trazer o resultado de volta

O que importa preservar do projeto, independente do que a ferramenta devolver:

- Cor, espaço e tipografia **só** via `useAppTheme()` — nada de hex solto
- Texto **só** via `<ThemedText variant="…">`
- Todo texto visível passa por `t()`, com a chave nos **três** arquivos de
  `assets/i18n/translations/`
- `components/ui/AdSlot.tsx` continua no rodapé das cinco telas

Uma oportunidade que o redesenho pode aproveitar: o app hoje **não carrega
fonte customizada**, usa a do sistema. Uma família própria (via `expo-font`) é
o item isolado que mais muda a percepção de acabamento.
