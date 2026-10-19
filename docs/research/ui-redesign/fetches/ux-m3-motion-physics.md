---
tags: [fetch, ui-redesign]
source: https://m3.material.io/styles/motion/overview/how-it-works
fetched: 2026-10-19
kind: primary
---

# Motion physics system — How it works (Material Design 3)

> Fetched 2026-10-19 · Google's M3 spec page for the spring-based motion system introduced with M3 Expressive; read to pick the motion scheme and spring tokens for answer feedback, transitions and the result hero moment. Read via the Browser pane (JS-rendered).

## What it says

> "Material introduced the motion physics system with M3 Expressive. This new physics-based system makes interactions and transitions feel more alive, fluid, and natural."

> "The physics system is replacing the previous system based on easing and duration."

Availability table (as rendered): Android Views (MDC-Android) "Available. Not added to components"; Flutter "Unavailable"; Jetpack Compose "Available"; Web "Compatible with Compose springs."

Schemes:

> "The physics system has two preset motion schemes: expressive and standard. The motion scheme you choose defines how your product feels. While most motion in a product should use the same scheme, products can make advanced customizations to swap the scheme to emphasize key moments."

> "Expressive is Material's opinionated motion scheme, and should be used for most situations, particularly hero moments and key interactions."

> "The expressive motion scheme overshoots the final values to add bounce"

> "Standard feels more functional with minimal bounce, and should be used for utilitarian products."

Springs:

> "Motion schemes use springs. A spring is a combination of three attributes which control all motion behavior: stiffness, damping, and initial velocity."

> "Springs feel natural. Springs are designed to be predictable, like how objects move and bounce. They handle gestures, interruptions, and retargeting animations seamlessly."

Tokens:

> "There are tokens for spatial movement and effects, with three durations each: default, fast, and slow."

> "For example, to apply fast, spatial, expressive motion, call the "expressive" motion scheme, then use the token: md.sys.motion.spring.fast.spatial."

> "Spatial spring tokens are used for animations that move something on screen, for example the x and y position, rotation, size, rounded corners. This spring overshoots the final value and bounces into place."

> "Effects spring tokens are used to animate properties such as color and opacity animations, where there shouldn't be any overshoot."

> "Spatial and effect spring tokens come in three speeds: default, fast, and slow. Most motion should use the default speed, while smaller elements may use fast and larger elements may use slow."

Speed table (verbatim rows): Default — "Animations that partially cover the screen, such as bottom sheet and expanded navigation rail" / "Opacity of the content within a navigation rail"; Fast — "Small components, such as switches and buttons" / "Color change of the switch handle"; Slow — "Full-screen animations" / "Full-screen content refresh".

> "On Jetpack Compose, 21 Material components use the motion physics system by default."

> "On Jetpack Compose, to use one scheme for most of the product, such as expressive, but on certain elements swap it for another scheme, like standard, override the CompositionLocal for that particular composable, screen, or element."

## What it does not say

- The page does not give the numeric stiffness/damping values (they are on the "Specs" tab, not read).
- No guidance on reduced-motion / "remove animations" accessibility settings on this page.
- Nothing on how bounce affects perceived speed or satisfaction in timed or test contexts.
