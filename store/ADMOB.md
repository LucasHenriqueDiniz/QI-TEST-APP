# AdMob — o que já está feito e o que falta

## Estado atual

Integração completa. O projeto está no **Expo SDK 57 (RN 0.86.2)** com
`react-native-google-mobile-ads@^16.4.0`.

> ## ⚠ Uma trava mantém o build nativo de pé. Não mexa sem ler.
>
> ### O plugin `withKotlinMetadataCheck` é obrigatório
>
> O `play-services-ads` é publicado compilado com um Kotlin mais novo do que o
> que o Expo usa, e um compilador não lê metadata de versão superior à sua. O
> build morre em `:react-native-google-mobile-ads:compileDebugKotlin`:
>
> ```
> Module was compiled with an incompatible version of Kotlin.
> The binary version of its metadata is 2.3.0, expected version is 2.1.0.
> ```
>
> `plugins/withKotlinMetadataCheck.js` injeta `-Xskip-metadata-version-check`,
> que é a saída indicada pelo próprio compilador. Removê-lo quebra o build.
>
> **A defasagem é estrutural, não um bug de versão.** Já foi observada duas
> vezes, com uma migração de cinco versões maiores do Expo no meio:
>
> | Expo | Kotlin do projeto | play-services-ads | metadata |
> |------|-------------------|-------------------|----------|
> | 52   | 1.9               | 24.5.0            | 2.1      |
> | 57   | 2.1               | 25.4.0            | 2.3      |
>
> Subir os dois lados não resolve: o Google continua à frente. Perseguir uma
> versão do wrapper que "encaixe" congelaria o app num SDK de anúncios antigo,
> que o Google acaba depreciando.
>
> **Não tente resolver subindo o `kotlinVersion` do `expo-build-properties`.**
> Isso troca a versão das bibliotecas, não a do compilador — que o gradle plugin
> do RN fixa. Já foi tentado no SDK 52: o resultado é o mesmo erro invertido,
> agora derrubando o `expo-modules-core`.
>
> ### Trava que deixou de existir
>
> Até o SDK 52 o pacote precisava ficar **fixado em `15.7.0`**, sem circunflexo:
> da `16.0.2` em diante os specs de TurboModule importam `{ CodegenTypes } from
> 'react-native'`, namespace que só existe no **RN ≥ 0.80**, e o SDK 52 era RN
> 0.76.3. Como agora o projeto é RN 0.86, a trava caiu e o pacote voltou a
> aceitar circunflexo.
>
> ### Por que isso passa despercebido
>
> **`tsc` e `expo export` passam limpos com tudo quebrado.** Os specs só são
> lidos pelo codegen nativo e o Kotlin só é compilado no Gradle — nada disso
> toca o bundle JS. As duas verificações do projeto são cegas para essa classe
> de erro por construção. Só um build nativo detecta.
>
> ⚠ **O único build nativo já feito foi no SDK 52** (EAS `e32118c6`). Nada foi
> compilado nativamente desde a migração — rode um build EAS antes de assumir
> que está tudo de pé.

| Peça | Arquivo | Estado |
|---|---|---|
| SDK | `react-native-google-mobile-ads@^16.4.0` | instalado |
| Compat. Kotlin | `plugins/withKotlinMetadataCheck.js` | obrigatório |
| Plugin nativo | `app.json` | App ID **real** do Android; iOS segue no de teste |
| Ad unit IDs reais | `.env.local` | banner e intersticial criados |
| Inicialização + consentimento UMP | `context/AdsContext.tsx` | pronto |
| Banner | `components/ui/AdSlot.tsx` | pronto |
| Intersticial com trava de frequência | `hooks/useGatedInterstitial.ts` | pronto |
| Opções de privacidade nos Ajustes | `app/settings.tsx` | pronto |
| Política de privacidade com seção de anúncios | `store/privacy-page/` | pronta |

---

## Onde os anúncios aparecem, e por quê

**Banner ancorado** no rodapé de todas as cinco telas — Início, Teste,
Resultado, Histórico e Ajustes. Formato `ANCHORED_ADAPTIVE_BANNER`, que se
ajusta à largura do aparelho e rende mais que o banner fixo de 320×50.

O contêiner tem altura zero até o anúncio carregar. Sem isso, sobraria uma faixa
cinza toda vez que a requisição falhasse — offline, sem preenchimento ou
consentimento negado — que é exatamente quando o app precisa parecer normal.

**Intersticial entre o fim do teste e o resultado**, em `app/test.tsx`. É o
ponto de maior receita: 100% de quem termina o teste passa por ali, e a
expectativa pelo número segura a pessoa durante o anúncio.

O resultado é gravado no histórico **antes** do anúncio aparecer. Se o anúncio
falhar, ou o usuário matar o app durante ele, nada se perde — a navegação é o
único passo represado, e `useGatedInterstitial` a executa mesmo em caso de erro.

### Por que sem trava no primeiro teste

`INTERSTITIAL_AFTER_TESTS = 0`. A recomendação padrão seria poupar a primeira
sessão, porque é ela que define se a pessoa desinstala — e desinstalação pesa no
ranqueamento.

Só que essa lógica pressupõe um app de uso recorrente. Teste de QI é de sessão
única: a maioria faz o teste uma vez e não volta. Poupar o primeiro teste
significaria não monetizar quase ninguém, e a mudança não valeria nada.

**O custo existe e vale monitorar.** Anúncio na primeira experiência aumenta a
chance de avaliação de 1 estrela, e nota média é fator de ranqueamento — além
de aparecer direto no resultado de busca. Se as avaliações começarem a reclamar
de anúncio, subir `INTERSTITIAL_AFTER_TESTS` para `1` reverte a decisão numa
linha.

### O que ainda não existe

**Anúncio premiado (rewarded).** Não há o que desbloquear num app 100% gratuito
— rewarded sem recompensa é só um intersticial com passos a mais.

Para isso valer a pena seria preciso criar conteúdo que as pessoas queiram
depois do resultado. O candidato natural: **revisão das questões erradas, com a
resposta certa e a explicação**. A curiosidade é genuína naquele momento, e o
resultado principal continua grátis, então não é paywall disfarçado.

**Anúncio ao abrir (app open).** Disponível no SDK já instalado
(`useAppOpenAd`), mas irrita quem abre o app só para consultar o histórico.
Se for testar, vale mostrar apenas a partir da segunda abertura.

**Anúncio em notificação.** Não existe no AdMob, e a política de anúncios da
Play Store proíbe exibir anúncio fora da interface do app. Redes que oferecem
"push monetization" são caminho direto para remoção da loja.

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

**c)** Depois de mexer em qualquer `.env*`, rode o build com `--clear`:

```bash
npx expo export --platform android --clear
```

O cache do Metro **não invalida quando só variáveis de ambiente mudam**. As
`EXPO_PUBLIC_*` são inlinadas no bundle por transformação do Babel, e um
transform em cache devolve o valor antigo sem erro nenhum. Isso foi observado
neste projeto: o primeiro export depois de criar o `.env.local` saiu com o
**hash idêntico** ao anterior e com os ad unit IDs de teste dentro.

O modo de falha é silencioso e caro — um build de produção servindo ad unit de
teste não dá erro, não aparece no console e rende exatamente zero. Para conferir
sem depender de fé:

```bash
npx expo export --platform android --clear
grep -c "SEU-ID-DE-PUBLISHER" dist/_expo/static/js/android/*.hbc
```

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
