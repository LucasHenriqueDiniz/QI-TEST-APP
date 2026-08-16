# Checklist de publicação

Ordem sugerida. Os itens marcados já estão feitos no código.

## 1. Código — pronto

- [x] Roteamento funcionando (`app/_layout.tsx` e `app/index.tsx` existem)
- [x] `package` definitivo: `com.lhdiniz.testeqi` — **imutável após o 1º upload**
- [x] Nome do app: "Teste de QI"
- [x] `versionCode: 1` e `version: 1.0.0`
- [x] Nenhuma compra no app (removidas loja e tela de desbloqueio)
- [x] Aviso de "apenas entretenimento" visível na home, no resultado e em Sobre
- [x] Nenhuma permissão sensível declarada
- [x] Link da política de privacidade dentro do app

## 2. Arte — falta fazer

O app ainda usa os ícones padrão do Expo. **Isso reprova na revisão de
qualidade** e derruba a taxa de clique na busca.

- [ ] Ícone 512×512 PNG, sem transparência, sem cantos arredondados
- [ ] `assets/images/icon.png` (1024×1024) e `adaptive-icon.png` (foreground 1024×1024, área segura central de 66%)
- [ ] `splash-icon.png` coerente com o ícone
- [ ] Feature graphic 1024×500 — obrigatório
- [ ] 6 capturas por idioma, com legendas (roteiro em `ASO.md` §4)

Sugestão de direção: fundo violeta `#5B4FE9` (a cor de marca já usada no app)
com uma lâmpada ou matriz de padrão em branco. O ícone precisa ser legível a
48×48 — nada de texto.

## 3. Política de privacidade — falta publicar

- [ ] Publicar `store/PRIVACY.md` numa URL pública

  Caminho mais rápido, sem custo: ative **GitHub Pages** no repositório
  (Settings → Pages → branch `master`, pasta `/docs`), mova o arquivo para
  `docs/privacidade.md` e a URL fica
  `https://lucashenriquediniz.github.io/qi-test-app/privacidade`.

  Essa é a URL já configurada em `constants/app.ts` — se publicar em outro
  endereço, atualize `PRIVACY_POLICY_URL` lá.

- [ ] Colar a URL no Play Console (Política do app → Política de privacidade)

## 4. Play Console

- [ ] Criar conta de desenvolvedor (US$ 25, pagamento único)
- [ ] Verificação de identidade (pode levar alguns dias)
- [ ] Criar o app, escolher **Grátis** (irreversível)
- [ ] Preencher a ficha com `listing-pt-BR.md`
- [ ] Adicionar as fichas es-419 e en-US
- [ ] Formulário **Data safety**: marcar "Nenhum dado coletado" e "Nenhum dado
      compartilhado" (verdade enquanto o AdMob não entrar)
- [ ] Questionário de classificação indicativa → deve sair "Livre"
- [ ] Público-alvo: 13+ (evita as exigências extras de apps infantis)
- [ ] Declaração de anúncios: **"Não contém anúncios"** por enquanto — lembre de
      trocar quando o AdMob entrar

## 5. Build

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile production   # gera .aab
```

- [ ] Deixar o EAS gerar e guardar a keystore (perder a keystore = perder o app)
- [ ] Testar o `.aab` num aparelho real antes de enviar

## 6. Teste fechado — o gargalo real

Contas pessoais criadas depois de novembro de 2023 precisam de **12 testadores
rodando o app por 14 dias seguidos** antes de poder publicar em produção.

- [ ] Criar faixa de teste fechado
- [ ] Juntar 12 e-mails Google (amigos, família, grupos de dev)
- [ ] Manter os 14 dias sem interrupção — se um testador sair, o contador
      pode voltar
- [ ] Só então solicitar acesso à produção

Comece isso **cedo**. É o item de maior prazo do projeto e não depende de código.

## 7. Depois de publicar

- [ ] Monitorar Android vitals (ANR e crash rate) na primeira semana
- [ ] Deixar título e descrição parados por 30 dias antes de avaliar ASO
- [ ] Integrar o AdMob (ver `store/PRIVACY.md`, seção final, para o que muda)

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
