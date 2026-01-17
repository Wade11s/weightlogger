# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

## Project Overview

**Weight Logger** - A beautiful cross-platform weight tracking desktop application built with Tauri + React.

**Current Status**: All core features implemented and archived (2026-01-17). The `add-weight-tracker` change has been completed (42/46 tasks, remaining Windows build handled by GitHub Actions).

## OpenSpec Workflow

This project uses OpenSpec for spec-driven development. Key concepts:

- **`openspec/specs/`** - Current truth: what IS built
- **`openspec/changes/`** - Proposals: what SHOULD change
- **`openspec/changes/archive/`** - Completed changes

### Three-Stage Workflow

1. **Stage 1: Creating Changes** - Create proposals for features, breaking changes, architecture shifts
2. **Stage 2: Implementing Changes** - Track progress with tasks.md, implement sequentially
3. **Stage 3: Archiving Changes** - After deployment, move changes to archive

### Quick Reference

```bash
openspec list                  # List active changes
openspec list --specs          # List specifications
openspec show [item]           # Display change or spec
openspec validate [item]       # Validate changes or specs
openspec validate [item] --strict  # Comprehensive validation
openspec archive <change-id> --yes  # Mark complete (non-interactive)
```

### When to Create Proposals

Create a proposal when:
- Adding features or functionality
- Making breaking changes (API, schema)
- Changing architecture or patterns
- Optimizing performance (changes behavior)
- Updating security patterns

Skip proposal for:
- Bug fixes (restore intended behavior)
- Typos, formatting, comments
- Non-breaking dependency updates
- Configuration changes
- Tests for existing behavior

### Key Commands

```bash
# Explore current state
openspec spec list --long    # List all specs
openspec list                # List active changes

# Create change proposal (manual scaffolding)
mkdir -p openspec/changes/[change-id]/specs/[capability]
# Then create: proposal.md, tasks.md, spec deltas

# Validate before requesting approval
openspec validate [change-id] --strict
```

### Spec Format

Spec deltas use these operations:
- `## ADDED Requirements` - New capabilities
- `## MODIFIED Requirements` - Changed behavior (always include full requirement text)
- `## REMOVED Requirements` - Deprecated features
- `## RENAMED Requirements` - Name changes only

Every requirement MUST have at least one scenario using `#### Scenario:` format (4 hashtags).

## Development Commands

```bash
# Development
npm run dev              # Start Vite dev server (port 1420)
npm run tauri dev        # Run Tauri in development mode

# Building
npm run build            # Build frontend (TypeScript + Vite)
npm run tauri build      # Build production Tauri app (macOS/Windows)

# Code Quality
npm run lint             # Run ESLint validation
```

## Architecture

**Tauri Desktop Application** - Cross-platform weight tracker using React frontend with Rust backend.

### Tech Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Tauri 2.2 (Rust)
- **UI**: Tailwind CSS with custom rose/sage color palette
- **Charts**: Plotly.js for interactive trend visualization
- **Data Storage**: Local JSON files via Tauri filesystem API

### Frontend Structure
- `src/components/` - React components (CalendarView, TrendChart, modals)
- `src/services/api.ts` - Tauri command invocations (API layer)
- `src/types/index.ts` - TypeScript interfaces
- `src/utils/` - Helper functions (BMI calculations, date utilities)

### Tauri Commands
The backend exposes commands that the frontend calls via `src/services/api.ts`:
- Weight CRUD operations (read, write, delete entries)
- Profile management (height, gender, target weight)
- Data import/export (JSON, CSV formats)

### UI Language
The application interface is in **Chinese (Simplified)**. When modifying UI text, maintain Chinese language consistency.

### CI/CD

**GitHub Actions** (`.github/workflows/build.yml`):
- Automatically builds macOS (DMG) and Windows (MSI/NSIS) installers
- Also provides standalone Windows .exe (no installation, requires WebView2)
- Triggers on push to main branch or version tags
- Artifacts available for download from Actions page

### Performance Optimizations

Several components use `React.memo` to prevent unnecessary re-renders:
- `TrendChart.tsx` - Expensive Plotly.js rendering
- `CalendarView.tsx` - Complex calendar logic
- `StatisticsSummary.tsx` - Statistical calculations

### Important Notes

- **No test data in builds**: The `.gitignore` excludes `.weightlogger/` directory
- **Cross-platform builds**: Use GitHub Actions for automated macOS and Windows builds
- **Standalone .exe**: Windows artifact includes standalone executable (no install, needs WebView2)
- **Development complete**: Core features are implemented; new features should follow OpenSpec workflow
