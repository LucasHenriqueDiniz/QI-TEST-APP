# AdMob — o que já está feito e o que falta

## Estado atual

O código está **inteiro e funcionando com os IDs de teste oficiais do Google**.
Você não precisa mexer em nada de programação — só criar a conta, gerar 3 IDs e
colá-los em dois lugares.

| Peça | Arquivo | Estado |
|---|---|---|
| SDK | `react-native-google-mobile-ads@16.4.0` | instalado |
| Plugin nativo | `app.json` | configurado (App ID de teste) |
| Inicialização + consentimento UMP | `context/AdsContext.tsx` | pronto |
| Banner | `components/ui/AdSlot.tsx` | pronto |
| Intersticial com trava de frequência | `hooks/useGatedInterstitial.ts` | pronto |
| Opções de privacidade nos Ajustes | `app/settings.tsx` | pronto |
| Política de privacidade com seção de anúncios | `store/privacy-page/` | pronta |

---

## Onde os anúncios aparecem, e por quê

**Banner ancorado** no rodapé de Início, Teste, Resultado e Histórico. Formato
`ANCHORED_ADAPTIVE_BANNER`, que se ajusta à largura do aparelho e rende mais que
o banner fixo de 320×50.

O contêiner tem altura zero até o anúncio carregar. Sem isso, sobraria uma faixa
cinza toda vez que a requisição falhasse — offline, sem preenchimento ou
consentimento negado — que é exatamente quando o app precisa parecer normal.

**Intersticial** só no botão "Refazer teste", com duas travas:

- Nunca no primeiro teste (`INTERSTITIAL_AFTER_TESTS`)
- No máximo um a cada 3 minutos (`INTERSTITIAL_COOLDOWN_MS`)

### O que eu deliberadamente não fiz

**Intersticial entre o fim do teste e o resultado.** É o ponto de maior receita
e o mais tentador — e também o momento em que a pessoa decide se o app presta.
Bloquear o resultado com um anúncio de 5 segundos aumenta desinstalação, e taxa
de desinstalação pesa no ranqueamento da Play Store. Você perderia em ASO mais
do que ganharia em eCPM.

Se quiser testar mesmo assim, é uma linha em `app/test.tsx`: envolva o
`router.replace("/results")` com o `run()` do `useGatedInterstitial`.

**Anúncio premiado (rewarded).** Não faz sentido aqui: o app é 100% gratuito e
não há nada bloqueado para desbloquear. Rewarded sem recompensa é só um
intersticial com passos a mais.

---

## Passo a passo no console do AdMob

### 1. Criar a conta

<https://admob.google.com> → entrar com a conta Google → aceitar os termos.
Vai pedir endereço e fuso horário; use os dados reais, porque o pagamento é
verificado contra eles depois.

### 2. Registrar o app

**Apps → Adicionar app → Android**

Escolha **"Não"** quando perguntar se já está publicado na loja — o app ainda
não está. Você reconecta depois, quando publicar.

Nome: `Teste de QI`

Ao final, o console mostra o **App ID**, no formato `ca-app-pub-XXXXXXXX~YYYYYYY`
(repare no **til `~`**, não barra). Guarde.

### 3. Criar as ad units

**Blocos de anúncios → Adicionar bloco de anúncios**, duas vezes:

| Formato | Nome sugerido | Configuração |
|---|---|---|
| Banner | `testeqi-banner` | deixe os padrões |
| Intersticial | `testeqi-interstitial` | deixe os padrões |

Cada um devolve um **ad unit ID** no formato `ca-app-pub-XXXXXXXX/ZZZZZZZ`
(com **barra `/`**). São esses dois que vão no `.env.local`.

> A confusão mais comum: App ID usa `~`, ad unit ID usa `/`. Trocar um pelo
> outro faz o SDK travar na inicialização.

### 4. Colar no projeto

**a)** No `app.json`, troque o App ID de teste pelo real:

```json
[
  "react-native-google-mobile-ads",
  {
    "androidAppId": "ca-app-pub-SEUID~SEUAPPID",
    "iosAppId": "ca-app-pub-SEUID~SEUAPPID",
    "userTrackingUsageDescription": "Isto permite exibir anúncios mais relevantes para você."
  }
]
```

**b)** Crie `.env.local` na raiz (já ignorado pelo git):

```
EXPO_PUBLIC_ADMOB_BANNER_ANDROID=ca-app-pub-SEUID/SEUBANNER
EXPO_PUBLIC_ADMOB_INTERSTITIAL_ANDROID=ca-app-pub-SEUID/SEUINTERSTICIAL
```

Não coloque no `.env` versionado. Ad unit ID não é segredo crítico, mas o hábito
de separar evita o dia em que uma chave de verdade for parar no repositório.

### 5. Configurar o consentimento (UMP)

**Privacidade e mensagens → Mensagem de consentimento do GDPR → Criar mensagem**

Selecione o app, escolha os idiomas (pt, en, es), cole a URL da política de
privacidade e publique. Também crie a mensagem de **IDFA** se for lançar no iOS.

Sem isso publicado, `AdsConsent.gatherConsent()` não tem formulário para
apresentar e os usuários europeus recebem anúncios não personalizados — ou
nenhum.

### 6. Testar antes de publicar

Enquanto `__DEV__` for verdadeiro, o app usa IDs de teste **mesmo com os reais
configurados**. Isso é proposital: clicar nos próprios anúncios reais é a
maneira mais rápida de ter a conta suspensa por tráfego inválido.

Para testar com IDs reais sem risco, registre seu aparelho como dispositivo de
teste em **Configurações → Dispositivos de teste** no console.

```bash
eas build --platform android --profile preview   # gera APK instalável
```

### 7. Atualizar a Play Store antes de enviar

Três coisas mudam de estado quando o AdMob entra:

- [ ] **Ficha do app → "Contém anúncios": SIM** (estava "Não")
- [ ] **Data safety**: marcar `Advertising ID` em "Dados coletados" e
      `Approximate location` se aplicável; marcar como **compartilhado com
      terceiros** (Google)
- [ ] **Política de privacidade**: publicar a versão em
      `store/privacy-page/index.html`, que já contém a seção 3 sobre AdMob

Declarar "não contém anúncios" num app com AdMob é uma das causas mais comuns de
suspensão. Não esqueça esse checkbox.

---

## Expectativa realista de receita

Com os números de mercado atuais para um app de quiz sem tráfego pago:

| | Brasil | EUA |
|---|---|---|
| eCPM banner | US$ 0,20 – 0,80 | US$ 1 – 3 |
| eCPM intersticial | US$ 1 – 4 | US$ 5 – 15 |

Na prática, 1.000 usuários ativos por mês nesse formato rendem algo entre US$ 5
e US$ 25. É dinheiro de café — o valor do exercício está em passar por todo o
ciclo de publicação, não na receita. Vale calibrar a expectativa antes de medir,
para não concluir que "o app é ruim" quando na verdade é o mercado que é assim.

O único jeito de isso virar número relevante é volume, e volume vem de ASO e
retenção — não de colocar mais anúncios. Encher o app de intersticial derruba
retenção, que derruba ranqueamento, que derruba instalações. É um laço que se
fecha contra você.
