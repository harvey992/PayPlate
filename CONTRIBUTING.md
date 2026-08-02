# Contributing — C#-style frontend conventions

This repository is primarily a TypeScript React app. To make the frontend codebase feel and read more like C# codebases (per the project direction), we apply a few naming and structural conventions inspired by C# best practices.

Please follow these guidelines when contributing:

- Types and Interfaces
  - Use PascalCase for type and interface names (e.g., `Restaurant`, `MenuItem`).
  - Prefer `interface` over `type` for object shapes when possible (easier to extend/mimic C# interfaces).

- Naming
  - Use PascalCase for React components and types; camelCase for functions and local variables.
  - Prefix boolean-returning functions with `is`/`has` where appropriate (e.g., `isPaid`, `hasDiscount`).

- Files and folders
  - Keep files named after the default export (e.g., `RestaurantCard.tsx` exports `RestaurantCard`).

- Architecture
  - Favor small, testable units that map to single-responsibility classes or components.
  - Use interfaces for service contracts (e.g., `IPayplateService`) where server integration is required.

- Formatting & lint
  - Run `npm run lint` before submitting PRs.
  - Keep changes backwards-compatible where possible; avoid disruptive renames without a migration plan.

These rules are recommendations intended to create a consistent developer experience for teams familiar with C# patterns. They do not change runtime behavior.
