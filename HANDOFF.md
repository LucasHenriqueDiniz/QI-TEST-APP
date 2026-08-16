# Prompt de continuação — sessão local

Cole o bloco abaixo numa sessão do Claude Code aberta na raiz deste projeto.

---

```
Estou continuando o projeto Teste de QI, um app React Native (Expo Router, SDK 52)
de teste de QI que vai ser publicado na Play Store. O trabalho anterior foi feito
numa sessão remota; leia primeiro o README.md e os arquivos em store/ para se
situar — em especial store/CHECKLIST.md, que é a lista viva do que falta.

CONTEXTO RÁPIDO

O app foi reconstruído do zero visualmente: 6 telas planas (index, test, results,
history, settings), design system único em constants/theme.ts, tema claro/escuro,
3 idiomas (pt/en/es) e AdMob integrado rodando com IDs de teste do Google.
Não há compras no app — é gratuito e monetizado só por anúncio.

O foco declarado do dono do projeto é ASO (ranqueamento na Play Store), não
receita — o app é um teste para medir quanto rende algo publicado com esforço
mínimo de marketing.

TAREFA IMEDIATA: ícone

Tenho um ícone gerado por IA na minha pasta de Downloads. Preciso que você:

1. Me pergunte o caminho do arquivo, ou o localize em ~/Downloads
2. Verifique se está adequado: quadrado, sem transparência no fundo, sem cantos
   arredondados desenhados, sem texto, e legível quando reduzido a 48x48
3. Gere os derivados que o Expo e a Play Store esperam:
   - assets/images/icon.png — 1024x1024, ícone completo com fundo
   - assets/images/adaptive-icon.png — 1024x1024, SÓ o símbolo em fundo
     transparente, ocupando no máximo 66% da largura (o Android recorta as
     bordas em círculo/squircle conforme o launcher)
   - assets/images/splash-icon.png — só o símbolo, ~512x512 transparente
   - assets/images/favicon.png — 48x48
   - store/play-icon-512.png — 512x512, 32 bits, SEM transparência (é o que
     sobe no Play Console)
4. Rode `npx expo export --platform android` para confirmar que nada quebrou

Use sharp (npm i -D sharp) ou Pillow (pip install Pillow), o que for mais fácil.
O fundo violeta da marca é #5B4FE9 e já está configurado no app.json em
android.adaptiveIcon.backgroundColor.

DEPOIS DO ÍCONE, em ordem de bloqueio:

1. Feature graphic 1024x500 (prompts em store/ICON-BRIEF.md)
2. Capturas de tela reais do emulador, com legendas — roteiro em store/ASO.md §4
   (as em store/screenshots/ são rascunhos gerados do build web, só pra
   enquadramento)
3. Publicar store/privacy-page/index.html em lucashdo.com/teste-de-qi/privacy e
   conferir que bate com PRIVACY_POLICY_URL em constants/app.ts
4. Criar eas.json com perfis development (APK), preview (APK) e production (AAB)
5. Primeiro eas build — é o que vai provar que o AdMob compila nativamente,
   coisa que a sessão remota não conseguiu verificar por falta de Android SDK
6. Trocar os IDs de teste do AdMob pelos reais (passo a passo em store/ADMOB.md)

CONVENÇÕES DO PROJETO — siga sem exceção

- Cor, espaçamento e tipografia só via useAppTheme(). Nada de hex solto nas
  telas; os tokens vivem em constants/theme.ts e existem em claro e escuro.
- Texto só via <ThemedText variant="...">. A escala define lineHeight
  explicitamente porque o padrão do Android corta acentos em pt/es.
- Todo texto visível passa por t(). Chave nova vai nos TRÊS arquivos de
  assets/i18n/translations/ (pt, en, es) — nunca só num.
- Comentários em português, e só onde explicam um porquê não óbvio.

VERIFICAÇÃO — rode antes de dizer que terminou

  npx tsc --noEmit
  npx expo export --platform android

Ambos precisam passar limpos. O bundle atual fica em torno de 5.07 MB.

ARMADILHAS CONHECIDAS

- O app NÃO roda no Expo Go desde que o AdMob entrou. Precisa de dev build.
- app.json tem package "com.lhdiniz.testeqi" — é imutável depois do primeiro
  upload na Play Store. Nunca mude.
- Em __DEV__ o app força ad unit IDs de teste mesmo com os reais no .env.local.
  Isso é proposital: servir anúncio real em build de dev faz a conta do AdMob
  ser suspensa por tráfego inválido.
- O App ID do AdMob usa til (ca-app-pub-XXX~YYY) e vai no app.json; os ad unit
  IDs usam barra (ca-app-pub-XXX/YYY) e vão no .env.local. Trocar um pelo outro
  faz o SDK travar na inicialização.
- Não crie pull request sem eu pedir.

Comece lendo README.md e store/CHECKLIST.md, depois me diga onde está o ícone.
```

---

## O que já está pronto (para sua referência, não precisa colar)

| Área | Estado |
|---|---|
| Roteamento e telas | 6 telas, redesenhadas, claro/escuro |
| Design system | `constants/theme.ts`, fonte única |
| i18n | pt/en/es completos |
| Cálculo | percentil + recorte por categoria |
| AdMob | integrado, IDs de teste, consentimento UMP |
| ASO | estratégia + 3 fichas dentro dos limites |
| Privacidade | página HTML pronta, falta hospedar |
| Ícone e arte | **pendente** |
| Build nativo | **nunca executado** |
