# Specification Documentation (`spec_docs`)

This directory contains the technical specifications and design documents for the **Keishi** browser game.

## Directory Structure
*   `design_spec.md`: The core design specification derived from the official rule book. Includes game mechanics and technical architecture.
*   `development_tasks.md`: A checklist of development tasks broken down by phase.
*   `template.md`: A template for creating new specification documents.

## Documentation Guidelines

### Creating New Specifications
When adding new features or modifying existing rules, please follow these steps:

1.  **Copy the Template**: Duplicate `template.md` and rename it to a descriptive filename (e.g., `online_multiplayer_spec.md`).
2.  **Fill in Details**: Complete the sections as described in the template. Ensure clear distinction between UI, Logic, and Data.
3.  **Review**: Ensure the new spec does not contradict the core rules in `design_spec.md` unless a rule change is explicitly intended.

### Updating Existing Documents
*   **`design_spec.md`**: Update this file only when there are changes to the core game rules or fundamental architecture.
*   **`development_tasks.md`**: Update this file to track progress. Mark tasks as completed `[x]` as you finish them. Add new tasks as they arise.

## Version Control
Always commit changes to documentation alongside the code changes they describe.
