# Modern Web Design Terminology

Here are the industry terms and explanations for the design and animation techniques used in modern "high-end" web interfaces (like Linear, Raycast, and Aura).

## 1. "Scroll-Triggered Animation" or "Scroll Reveal"
The behavior where content loads or animates only when it enters the viewport is called **Scroll-Triggered Animation** or **Scroll Reveal**.

*   **How it works:** An "Observer" (usually the `IntersectionObserver` API) watches for when an element crosses the bottom of the screen (the "fold") and triggers the animation class (e.g., adds an `.is-visible` class).
*   **Why use it:** It improves performance (the browser doesn't have to animate everything at once) and keeps the user engaged as they explore the page, providing a sense of discovery.

## 2. "Staggered Animation" or "Cascade Effect"
The "Aura-like" loading where items appear one after another (e.g., the letters in the title or the cards in the grid) is called a **Staggered Animation**.

*   **How it works:** You apply the same animation to a group of elements but add a small, increasing `animation-delay` to each subsequent item (e.g., 0.1s, 0.2s, 0.3s).
*   **Effect:** This creates a "wave" or "cascade" effect that feels fluid and organic, rather than robotic or overwhelming.

## 3. "Linear-Style Design"
The specific visual style—characterized by smooth `blur-in` effects, slide-up motions, high-quality typography, and "glassmorphism" (translucent backgrounds)—is often referred to colloquially as **"Linear-Style Design"** (named after the project management tool *Linear*, which popularized this aesthetic).

*   **Key Characteristics:**
    *   **Blur-Up:** Elements often transition from `blur(4px)` to `blur(0)` while fading in, giving a soft, premium feel.
    *   **Easing:** The motions use custom "cubic-bezier" curves (e.g., `cubic-bezier(0.2, 0.65, 0.3, 0.9)`) to make the movement feel snappy yet smooth, mimicking real-world physics rather than standard linear or ease-in-out timing.
    *   **Minimalism:** Heavy focus on negative space, high contrast typography, and subtle micro-interactions (like borders glowing on hover).
