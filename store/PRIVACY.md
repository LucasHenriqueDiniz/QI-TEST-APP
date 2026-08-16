# Política de Privacidade — Teste de QI

**Última atualização:** 16 de agosto de 2026
**Aplicativo:** Teste de QI (`com.lhdiniz.testeqi`)
**Contato:** lucas.diniz.hdo@gmail.com

> Este documento precisa estar publicado numa **URL pública** antes do envio à
> Play Store. Ver `store/CHECKLIST.md` para como publicar.

---

## Resumo

O Teste de QI **não coleta, não transmite e não armazena nenhum dado pessoal em
servidores**. Tudo o que o aplicativo guarda fica exclusivamente no seu
aparelho e é apagado quando você desinstala o app.

---

## 1. Dados armazenados no aparelho

O aplicativo grava as seguintes informações no armazenamento local do próprio
dispositivo (`AsyncStorage`):

| Dado | Para quê | Onde fica |
|---|---|---|
| Histórico de resultados (pontuação, percentil, acertos, data) | Mostrar sua evolução ao longo do tempo | Só no aparelho |
| Progresso de um teste em andamento | Permitir retomar de onde parou | Só no aparelho |
| Idade, se você informar | Aplicar um pequeno ajuste no cálculo | Só no aparelho |
| Idioma e preferência de tema | Lembrar suas escolhas | Só no aparelho |

Nenhuma dessas informações é enviada para a internet, para o desenvolvedor ou
para terceiros. Não há login, não há conta e o app nunca pede seu nome, e-mail
ou telefone.

## 2. Dados que o aplicativo NÃO coleta

- Nome, e-mail, telefone ou qualquer identificador pessoal
- Localização
- Lista de contatos, fotos, arquivos ou câmera
- Identificadores de publicidade
- Análises de uso, telemetria ou relatórios de falha

## 3. Permissões

O aplicativo não solicita nenhuma permissão sensível do Android. Ele funciona
integralmente sem acesso à internet.

## 4. Crianças

O aplicativo não coleta dados de ninguém, incluindo menores de 13 anos. O
conteúdo é adequado para todas as idades e não há compras nem comunicação entre
usuários.

## 5. Como apagar seus dados

Há duas formas, ambas imediatas e definitivas:

- **Ajustes → Apagar histórico**, dentro do aplicativo
- **Desinstalar o aplicativo**, o que remove todo o armazenamento local

Como nada é enviado para servidores, não existe cópia em outro lugar para
solicitar remoção.

## 6. Alterações nesta política

Mudanças serão publicadas nesta mesma página, com a data de atualização revista
no topo. Se o aplicativo passar a coletar qualquer dado, esta política será
atualizada **antes** da versão correspondente ir ao ar.

## 7. Contato

Dúvidas sobre privacidade: **lucas.diniz.hdo@gmail.com**

---

<a name="english"></a>

# Privacy Policy — IQ Test (English)

**Last updated:** August 16, 2026
**App:** IQ Test (`com.lhdiniz.testeqi`)
**Contact:** lucas.diniz.hdo@gmail.com

## Summary

IQ Test **does not collect, transmit or store any personal data on servers**.
Everything the app saves stays on your device only and is deleted when you
uninstall the app.

## 1. Data stored on your device

The app writes the following to local device storage (`AsyncStorage`): your
results history (score, percentile, correct answers, date), the progress of an
in-progress test, your age if you choose to provide it, and your language and
theme preferences. None of it is sent over the internet, to the developer, or to
any third party. There is no login and no account, and the app never asks for
your name, email or phone number.

## 2. Data the app does NOT collect

Name, email, phone or any personal identifier; location; contacts, photos, files
or camera; advertising identifiers; usage analytics, telemetry or crash reports.

## 3. Permissions

The app requests no sensitive Android permissions and works fully offline.

## 4. Children

The app collects no data from anyone, including children under 13. The content
is suitable for all ages, with no purchases and no user-to-user communication.

## 5. Deleting your data

Use **Settings → Clear history** inside the app, or uninstall the app to remove
all local storage. Since nothing is sent to servers, there is no copy elsewhere
to request removal of.

## 6. Changes

Changes will be posted on this page with a revised date at the top. If the app
ever begins collecting data, this policy will be updated **before** the
corresponding release ships.

## 7. Contact

Privacy questions: **lucas.diniz.hdo@gmail.com**

---

## ⚠️ Ao integrar o AdMob, atualize antes de publicar

O Google Mobile Ads coleta identificador de publicidade, endereço IP aproximado
e sinais de dispositivo. Quando o AdMob entrar, é obrigatório, **antes** de
enviar a versão com anúncios:

1. Reescrever as seções 2 e 3 acima descrevendo a coleta do AdMob e linkando a
   política do Google (`https://policies.google.com/technologies/partner-sites`)
2. Atualizar o formulário **Data safety** no Play Console (marcar "Advertising
   ID" e "Approximate location", se aplicável)
3. Implementar o consentimento via **Google UMP SDK** (obrigatório no EEE/Reino
   Unido; recomendado em todo lugar)
4. Se o app for marcado como voltado a crianças, configurar `tagForChildDirectedTreatment`
