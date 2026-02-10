This is a smoke test built by Playwright and TypeScript. It is not intended to test every single interactions and features on gitlab.com, instead it focuses on test core navigation without testing full functionality using minimal assertions and stable interactions.

This project shows i can design maintainable UI tests. I separated tests from page logic, used stable selectors, and kept assertions minimal to reduce flakiness.

Additional comments were intentionally added to document design decisions and learning steps.

Folder layout:
    - I used the Install: Playwright command from the Command Center to generate a base Playwright project, which defines the initial folder structure
    - Created a "page" folder within tests for Page Objects (reusable page interactions). This is handling the "how" i test part of this project like the interactions details
    - Created a spec.ts file for the actual tests cases executed by Playwright. This is handling the "what" i test part of this project like the intent and flow
    
POM (Page Object Model) keeps tests readable and makes changes easier to update, resulting in more consistent code. In a team environment, this approach allows others to add new pages and specs without duplicating unnecessary logic, improving scalability. Although this is a small, personal project, it follows patterns commonly used in professional automation environments.

This project is intentionally small in scope and is meant to reflect how I approach test design, structure, and maintainability.

Registration submission is intentionally not automated, as this project tests a publicly available website without access to a test environment. The test focuses on form presence and validation behavior instead.