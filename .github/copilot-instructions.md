<!--
This file is generated to help AI code agents contribute to the `node-project` repo.
Focus: keep instructions concise and practical for contributors and AI agents.
-->

# Copilot Instructions: node-project

Purpose: This repository contains simple client-side HTML/JS projects in two folders:
- `html-projects/`: small demo pages (calculator, rock-paper, sudoku, etc.)
- `practice/`: playground/demo files

Goal for AI agents: implement small features, fix bugs, add demos, maintain consistent plain-JavaScript style, and avoid large restructuring.

---

## Big picture
- This is a static front-end project; there is no build step or bundler.
- Each page (e.g., `sudoku.html`) is standalone and includes its own script(s) and optional CSS.
- Keep changes isolated to the page-level unless you are intentionally refactoring shared utilities (document that change in a README/RFC).

## Conventions & Patterns
- JavaScript files are ESM-compatible but are used as plain script tags (no module loaders).
- Use simple DOM APIs (querySelector / addEventListener); avoid dependencies.
- Keep code short and self-contained; components are not modularized across pages.
- CSS is page-local and kept simple—if adding a page, add a corresponding `.css` file.
- For UI updates use classes to reflect states (e.g., `.invalid`, `.read-only`).

## Where to work (key files)
- `html-projects/sudoku.html` — new Sudoku page that uses `sudoku.js`.
- `html-projects/sudoku.js` — main logic (generation, solver, UI rendering, event handlers).
- `html-projects/sudoku.css` — style for the Sudoku page.
- `html-projects/` other pages (`calculator.html`, `rock-paper.html`) provide small patterns you can copy from.

## Developer workflows (how to run/test)
- No build: open pages directly in a browser using a local HTTP server for best results.
- Quick local server commands (PowerShell):
  ```powershell
  Set-Location "c:\Users\RS24451\OneDrive - RuralShores Business Services Pvt Ltd\Documents\MynodeProjects"
  python -m http.server 8000
  # then open http://localhost:8000/html-projects/sudoku.html
  ```
- Alternatively, use VS Code Live Server extension.

## Testing & Debugging
- Manual testing: interact with UI, use `console.log` and the browser devtools.
- Keep non-trivial logic (e.g., Sudoku solver) under small modular functions to make unit tests easy to add.

## Patch-level expectations for AI agents
- Keep code in plain JS and in repository style (no frameworks).
- Add comments above functions to explain purpose and any algorithmic choices.
- Keep UI changes isolated to a single page where possible.
- If you add new pages, add an entry to `html-projects/README.md` listing the page and purpose.
- If you change a public API (e.g., exported function names) document it clearly in README.

## Example change scenario: Add Sudoku features
- Modify `html-projects/sudoku.js` only to add logic or UI event handling.
- For new UI elements add them to `html-projects/sudoku.html` and style in `sudoku.css`.
- Use consistent naming for HTML elements (ids like `#sudoku`, `#newGameBtn`, `#hintBtn`).
- Validate numeric input by the `input` event; allow only digits 1-9.

## External dependencies & integration
- There are none; avoid adding dependencies unless a feature requires it and the maintainer approves.

## Commit & Pull Request guidance
- Keep PRs focused (one feature/bug per PR).
- Include a short README update if the feature affects the developer experience.
- For significant changes include a short demonstration/gif or a quick local test guide.

## When in doubt
- Keep changes minimal; prefer small incremental modifications.
- If a change is large, document it in a short PR description and create a matching README or comment block.

---

If you want me to expand on any section or add more project-specific conventions (e.g., variable naming, function style), say which area and I’ll update this file.