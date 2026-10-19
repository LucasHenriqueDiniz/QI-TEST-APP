---
tags: [fetch, ui-redesign]
source: https://developer.android.com/guide/playcore/in-app-review
fetched: 2026-10-19
kind: primary
---

# Google Play In-App Review API (Android Developers)

> Fetched 2026-10-19 · Google's own guidance on when and how to ask for a rating inside the app. Read because ASO.md wants the review request on the Results screen, and a redesign of Results must not break these rules.

## What it says

Introduction:

> "Generally, the in-app review flow (see figure 1) can be triggered at any time throughout the user journey of your app."

When to request an in-app review:

> "Trigger the in-app review flow after a user has experienced enough of your app or game to provide useful feedback."

> "Don't prompt the user excessively for a review. This approach helps minimize user frustration and limit API usage (see the section on quotas)."

> "Your app shouldn't ask the user any questions before or while presenting the rating button or card, including questions about their opinion (such as "Do you like the app?") or predictive questions (such as "Would you rate this app 5 stars")."

Design guidelines:

> "Surface the card as-is, without tampering or modifying the existing design in any way, including size, opacity, shape, or other properties."

> "Don't add any overlay on top of the card or around the card."

> "The card and the card's background should be on the topmost layer. Once the card has surfaced, don't programmatically remove the card. The card is removed automatically based on either the user's explicit action, or an internal Play Store mechanism."

Quotas:

> "Google Play enforces a time-bound quota on how often a user can be shown the review dialog. Because of this quota, calling the `launchReviewFlow` method more than once during a short period of time (for example, less than a month) might not always display a dialog."

> "you should not have a call-to-action option (such as a button) to trigger the API, as a user might have already hit their quota and the flow won't be shown, presenting a broken experience to the user. For this use case, redirect the user to the Play Store instead."

## What it does not say

- It does not say whether gating the request on a "good" result (e.g. score above average) is allowed or disallowed. It only forbids asking opinion/predictive questions before or while the card shows. Gating on an internal signal without asking the user anything is not addressed explicitly.
- It does not give the quota value ("an implementation detail").
- It does not cover the Expo wrapper (`expo-store-review`), which is not installed in this repo.
