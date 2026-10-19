---
tags: [fetch, ui-redesign]
source: https://developers.facebook.com/docs/instagram-platform/sharing-to-stories/
fetched: 2026-10-19
kind: primary
---

# Sharing to Stories – Instagram Platform (Meta for Developers)

> Fetched 2026-10-19 · Meta's developer doc for sending an image/sticker from an Android app straight into the Instagram Stories composer; read for the exact asset dimensions and the integration constraints of a 9:16 result card. The page redirected to `developers.facebook.com/documentation/instagram-platform/sharing-to-stories` and rendered in Portuguese (pt-BR locale) in the Browser pane; quotes are verbatim pt-BR with an English gloss. Page header: "Updated: 30 de jun de 2026".

## What it says

App ID requirement:

> "Desde janeiro de 2023, é preciso fornecer um ID do app do Facebook para compartilhar conteúdo no Instagram Stories. [...] Se você não fornecer um ID do app, os usuários verão a mensagem de erro "O app de origem não é compatível com o compartilhamento nos Stories" ao tentar compartilhar conteúdos no Instagram."

(Gloss: since January 2023 a Facebook App ID is required; without it users see the error "The source app is not compatible with sharing to Stories".)

Composer layers:

> "O compositor de story do app do Instagram é composto por uma camada de plano de fundo e uma camada de figurinha."

> "A camada de fundo preenche a tela, e você pode personalizá-la com uma foto, um vídeo, uma cor sólida ou gradiente."

> "A camada de figurinha pode conter uma imagem e pode ser ainda mais personalizada pelo usuário no Compositor de Stories."

(Gloss: the composer has a full-screen background layer — photo, video, solid colour or gradient — and a sticker layer the user can further edit.)

Asset specs (Android data table):

> "Uri para um ativo de imagem (JPG, PNG) ou de vídeo (H.264, H.265, WebM). Dimensões mínimas 720 x 1.280. As proporções de imagem recomendadas são 9:16 ou 9:18. Os vídeos podem ser de 1.080p e ter até 20 segundos de duração. O Uri precisa ser um Uri de conteúdo para um arquivo local do dispositivo."

(Gloss: background asset JPG/PNG or video; minimum 720×1280; recommended ratio 9:16 or 9:18; video up to 1080p and 20 s; must be a content Uri to a local file.)

> "Uri para um ativo de imagem (JPG, PNG). Dimensões recomendadas: 640 x 480. A imagem aparece como uma figurinha sobre o plano de fundo."

(Gloss: sticker asset recommended 640×480, shown over the background.)

> "Caso você não especifique as cores da camada de fundo, o padrão será #222222."

Android mechanism (code sample on page): `new Intent("com.instagram.share.ADD_TO_STORY")` with `intent.putExtra("source_application", sourceApplication)`, `setDataAndType(backgroundAssetUri, MEDIA_TYPE_JPEG)`, optional `"interactive_asset_uri"`, `"top_background_color"`, `"bottom_background_color"`, and `Intent.FLAG_GRANT_READ_URI_PERMISSION`.

## What it does not say

- No safe-zone guidance (areas covered by Instagram's own UI) — third-party guides cite ~250 px top/bottom on a 1080×1920 canvas, but I did not find a Meta page stating it.
- Nothing on WhatsApp Status sharing (WhatsApp is not covered here); for WhatsApp the generic Android Sharesheet with an image is the path (`ux-android-sharesheet.md`).
- Nothing about what makes users actually share; it is purely an integration spec.
- The App ID requirement means a direct "Share to Instagram Stories" button adds a Facebook app registration dependency; the generic Sharesheet avoids it.
