---
tags: [fetch, ui-redesign]
source: https://support.google.com/admob/answer/7313578?hl=en
fetched: 2026-10-19
kind: primary
---

# Policies for ad units that offer rewards - Google AdMob Help

> Fetched 2026-10-19 · AdMob's rewarded-ads policy; read in case the redesign offers "watch an ad to unlock the detailed report" instead of (or in addition to) the forced interstitial.

## What it says

### Rewards requirements

> "Direct monetary items may not be offered as rewards under any circumstance."

> "Indirect or non-monetary items may be offered as rewards, provided that:
> - The reward is only redeemable and usable for an item or service within the publisher's platform, website or app;
> - The reward is non-transferable [...]"

### Implementation requirements

> "Publishers must provide clear, accurate and conspicuous disclosure of the action(s) required and reward(s) offered prior to each instance of Rewarded Ads being presented."

> "Rewarded Ads, except those implemented via the rewarded interstitial format, must only be served after a user affirmatively and unambiguously opts in (such as by tapping a button that represents "yes" or "accept"). In addition:
> - Rewarded Ads must not oblige users to interact with it (for example, it must be possible to skip or dismiss them).
> - Rewarded Ads implemented via the rewarded interstitial format must present an introductory screen containing an option representing "no" or "don't accept", with sufficient time for the user to opt out. This option must not be hidden, obstructed, or non-functional.
> - Skipping the Rewarded Ad or selecting the "no" or "don't accept" option must not impede or interfere with the normal usage of the platform, website or app."

> "Publishers must not include any text or icons, other than to describe the reward(s) offered, to mislead or incentivize users towards a particular choice (such as by indicating "watch this ad to support our business")."

> "Publishers must deliver the promised reward(s) to the user upon completion of the required action(s)."

## What it does not say

- Whether gating the *core* result (the IQ score itself) behind a rewarded ad is allowed. The rule "Skipping the Rewarded Ad ... must not impede or interfere with the normal usage of the ... app" suggests the base result must remain reachable without the ad; only extras can be the reward. The page gives no quiz example.
- "Sufficient time" for the rewarded-interstitial opt-out is not quantified.
