# Home Page with Clickable Cards – Plan

## Overview
Turn the site landing page ([`docs/index.md`](docs/index.md)) into a card-based home page (Spanish) with one clickable card each for: Introduction, Parts 1–4, and Bob Prompts. The current introduction content moves to a new `docs/introduction.md`, so no content is lost. Styling follows the existing site: MkDocs Material (indigo palette), emoji for visual accents (as already used in `index.md`), Spanish copy, no custom CSS.

Approach: use Material's built-in `<div class="grid cards" markdown>` layout. The required extensions (`md_in_html`, `attr_list`) are already enabled in [`mkdocs.yml`](mkdocs.yml:59-60), so no new plugins/extensions are needed. Emoji characters are used rather than `:material-…:` icons because `pymdownx.emoji` is not enabled (avoids config changes).

## Findings
- `docs/index.md` is a real file (docs/ entries are real; `docs-advanced/` are symlinks, not touched).
- `mkdocs.yml` nav: `Intro: index.md`, Parts 1–4 (READMEs), `Bob Prompts: bob-prompts/helpful-prompts.md`.
- Build runs `mkdocs build --strict` ([`deploy-docs.yml`](.github/workflows/deploy-docs.yml:50)), so every link/nav path must resolve.
- Existing page metadata (titles/durations) to reuse in cards: Part 1 – Configuración del Entorno (15 min), Part 2 – Construir tu Primer Agente (20 min), Part 3 – Usar Reglas Personalizadas con Bob IDE (10 min), Part 4 – Orquestación Multi-Agente (30 min, ⭐ advanced).
- [`intro.md`](intro.md) at repo root is a separate README-style file; not part of the MkDocs site, left unchanged.

## Sub-Tasks

### 1. Move the introduction content to its own page
- **Intent:** Preserve the current intro so the home page can become a card grid.
- **Expected Outcomes:** `docs/introduction.md` contains the existing `docs/index.md` content unchanged (links still valid as it is in the same folder).
- **Todo List:**
  1. Create `docs/introduction.md` with the current `docs/index.md` content.
  2. Optionally change its closing "Primeros pasos" link only if needed (same directory, so relative links stay valid).
- **Relevant Context:** [`docs/index.md`](docs/index.md), image `Bobchestrate_Workshop_logo_new.png` and `Bobchestrate Workshop.pptx` live in `docs/` (same folder, links keep working).
- **Status:** [ ] pending

### 2. Build the card-based home page
- **Intent:** Provide a landing page with clickable cards to every section.
- **Expected Outcomes:** `docs/index.md` shows the logo, a short welcome, and a grid of 6 cards (Introducción, Partes 1–4, Prompts de Bob). Each card title/“Ir a …” link navigates to the right page. Part cards show duration; Part 4 flagged ⭐.
- **Todo List:**
  1. Replace `docs/index.md` with: H1 title, logo, one-line welcome (reuse existing wording), then `<div class="grid cards" markdown>` list.
  2. Each card: emoji + bold linked title, `---` divider, one-sentence description (reuse the descriptions from the current “Estructura del taller” table), duration, and a link.
  3. Cards: Introducción → `introduction.md`; Parte 1 → `part1-setup/README.md`; Parte 2 → `part2-first-agent/README.md`; Parte 3 → `part3-bob-custom-rules/README.md`; Parte 4 → `part4-multi-agent-orchestration/README.md`; Prompts de Bob → `bob-prompts/helpful-prompts.md`.
  4. Keep all copy in Spanish.
- **Relevant Context:** [`mkdocs.yml`](mkdocs.yml) extensions; Material "grid cards" syntax.
- **Status:** [ ] pending

### 3. Update navigation
- **Intent:** Keep the nav consistent with the new page split.
- **Expected Outcomes:** Tab “Home” → `index.md`, and “Intro” → `introduction.md` (or equivalent) appears in nav; no orphan/strict-build warnings.
- **Todo List:**
  1. In [`mkdocs.yml`](mkdocs.yml:66) change `- Intro: index.md` to `- Home: index.md` and add `- Introduction: introduction.md` (matching the advanced site's “Home” naming).
- **Relevant Context:** [`mkdocs-advanced.yml`](mkdocs-advanced.yml:60) already uses `Home: index.md`.
- **Status:** [ ] pending

### 4. Verify
- **Intent:** Ensure the site builds and cards render/link correctly.
- **Expected Outcomes:** `mkdocs build --strict -f mkdocs.yml` passes with no new warnings; cards render in light and dark mode.
- **Todo List:**
  1. Run `mkdocs build --strict --config-file mkdocs.yml`.
  2. Optionally preview with `mkdocs serve` and click each card.
- **Relevant Context:** [`.github/workflows/deploy-docs.yml`](.github/workflows/deploy-docs.yml)
- **Status:** [ ] pending
