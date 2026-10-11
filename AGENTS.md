# Repository Guidelines

## Project Structure & Module Organization

- `src/Main.ts` is the application entry point. Discord slash commands, event listeners, and interactive components live in `src/commands/`, `src/events/`, and `src/components/`.
- `src/services/` contains database and cache services; `src/models/` holds types and entities; `src/globals/` contains shared clients, configuration, and managers.
- `public/translations/` contains JSONC and Markdown translations, schemas, and translation documentation.
- `tests/` contains Bun tests and `TestEnvironment.ts`. `dist/` is generated build output.
- Root Docker Compose files configure the application and optional services. `development/` and `deployment/` contain environment-specific infrastructure.

## Build, Test, and Development Commands

Use Bun 1.3 or newer. Install dependencies with `bun install --frozen-lockfile`.

- `bun run dev`: run the TypeScript entry point with file watching.
- `bun run build`: bundle and minify the application into `dist/`.
- `bun run start`: run the built application.
- `bun run test`: execute the Bun test suite.
- `bun run lint`: check TypeScript, JSON, and Markdown with ESLint.
- `bun run format:check`: check Prettier formatting; `bun run format` applies formatting repository-wide.
- `bunx tsc --noEmit --project tsconfig.json`: check types without generating files.

## Coding Style & Naming Conventions

Use strict TypeScript and ES modules. Follow Prettier: four-space indentation, double quotes, no semicolons, and a 120-character line width for TypeScript. JSON and YAML use an 80-character width.

Use PascalCase for classes and corresponding filenames, such as `VerifyButtonComponent.ts`; use camelCase for methods and variables. Follow existing feature folders and descriptive suffixes such as `Service`, `EventListener`, and `Command`. Use the configured `@/oliverperzyk/*` import alias where appropriate.

## Testing Guidelines

Do not add tests unless the user explicitly instructs you to do so.

When instructed to add tests, use `bun:test` and name test files `*.test.ts` under `tests/`, grouped by feature. Bun automatically preloads `tests/TestEnvironment.ts`. Existing tests validate JSON and Markdown translations; update relevant translation assets together. No numeric coverage threshold is configured.

## Commit & Pull Request Guidelines

Follow the history's conventional prefixes: `fix`, `refactor`, `chore`, and `ci`, with optional scopes, for example `fix(compose): correct service dependencies`.

Describe the problem, resulting behavior, and validation in each pull request. Link relevant issues and include screenshots for visible Discord interaction changes. Run formatting, linting, type checks, and tests before requesting review; CI also validates Dockerfiles and Compose configurations.

## Security & Configuration

Copy `.env.example` to `.env` and supply local Discord credentials and service URLs before running. Never commit tokens or credentials. Keep configuration examples free of secrets and avoid editing generated `dist/` files.
