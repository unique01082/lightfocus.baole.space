# Frequently Asked Questions

## General

### Is my data stored locally or on a server?
All **tasks** are stored on the LightFocus server (authenticated account).
**Settings** (agent name, personality, etc.) are stored in your browser's localStorage for instant access.
**ARIA-7's memory** (your profile, mood history, goals) is stored securely on the AI server.

### Do I need an account?
Yes — LightFocus uses Authentik for authentication. Create an account or sign in at `/auth`.

### Can I use LightFocus offline?
The solar system renders offline, but task sync, AI chat, and memory features require a connection.

---

## Tasks & Ranking

### Why did my task change orbit?
The bullseye rank recalculates automatically when a task's priority, complexity, or due date changes.
As a deadline approaches, the urgency score increases and the planet moves inward.

### How do I change the ranking weights?
Go to **Settings → Ranking** to adjust how much weight priority, complexity, and urgency each contribute.

### Can I manually override a task's rank?
Not currently — the rank is always algorithmic. This is by design to keep your priorities honest.

---

## ARIA-7 & Memory

### What does ARIA-7 remember?
ARIA-7 remembers information she learns through conversations: your mood patterns, life goals,
work habits, upcoming events, and anything you've explicitly shared.
You can see and edit all memories in **Settings → Memory**.

### How do I delete a specific memory?
Go to **Settings → Memory**, find the entry, and click **del** (or **edit** to modify the value).

### Can I export my memories?
Not yet — export is on the roadmap. You can view the raw JSON for any memory entry in the settings panel.

### Why is ARIA-7 not responding in my language?
Set your preferred language in **Settings → Agent → Language**. ARIA-7 will respond in that language.

---

## Performance

### The solar system is laggy — what can I do?
- Lower the bloom intensity in Mission Control
- Reduce the number of visible tasks (complete or archive old ones)
- Turn off moon labels if you have many subtasks

### How many tasks can I have?
There's no hard limit, but visual performance degrades above ~50 active tasks.
