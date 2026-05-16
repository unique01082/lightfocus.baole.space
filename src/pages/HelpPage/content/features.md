# Features

## 🎯 Bullseye Prioritisation

The bullseye algorithm automatically ranks tasks by combining:

- **Priority level** — the weight you assign (Critical → None)
- **Complexity** — how difficult the task is (1–5)
- **Due date urgency** — how close the deadline is

Rank 1–3 tasks glow with warm colours (red → yellow). Rank 4–7 cool off (cyan → gray).
You can tune the algorithm weights in **Settings → Ranking**.

---

## 🪐 Solar System Visualisation

Every task is rendered as a 3D planet using **Three.js** with:
- **Orbit rings** that match the bullseye rank
- **Planet size** scaling with complexity
- **Bloom glow** that intensifies for high-priority tasks
- **DOM labels** with rank-coloured borders and glow

Subtasks appear as **moons** orbiting their parent planet.

---

## 🤖 ARIA-7 — AI Companion

ARIA-7 is a conversational AI powered by large language models. She:
- Remembers your preferences, mood patterns, and goals in a **persistent memory store**
- Gives advice tailored to your communication style (casual / formal / direct / detailed)
- Proactively checks in based on your work schedule
- Follows up on tasks and milestones you've mentioned

Memory is stored securely on the server and can be managed from **Settings → Memory**.

---

## 📋 Task List Panel

The task list panel (click the list icon in the solar system view) groups tasks by bullseye rank.
You can filter, complete, or delete tasks without leaving the solar system view.

---

## 📊 Stats & Analytics

Visit the **Stats** page for a breakdown of your task distribution, completion rates, and historical trends.

---

## 🎛️ Mission Control

The top-left **Mission Control** panel in the solar system lets you:
- Adjust orbital animation **speed** (0–10×)
- Control **bloom** glow intensity or set it to auto
- Toggle **orbit rings** and **moon visibility**
- Pause / resume the animation
