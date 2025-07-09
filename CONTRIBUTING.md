# Contributing to Versate Platform

We're excited that you're interested in contributing to Versate! Before you get started, please take a moment to read through this guide to understand how you can contribute effectively.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)
- [License](#license)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

1. **Fork the Repository**
   - Click the "Fork" button in the top-right corner of the repository page
   - Clone your forked repository to your local machine:
     ```bash
     git clone https://github.com/your-username/versate-platform.git
     cd versate-platform
     ```

2. **Set Up the Development Environment**
   - Install Node.js (v16 or later)
   - Install dependencies:
     ```bash
     npm install
     # or
     yarn install
     ```
   - Set up environment variables (see [.env.local.example](.env.local.example))

3. **Start the Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The application will be available at `http://localhost:3000`

## Development Workflow

1. **Create a Branch**
   Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-number-description
   ```

2. **Make Your Changes**
   - Follow the [Code Style](#code-style) guidelines
   - Write tests for new features
   - Update documentation as needed

3. **Run Tests**
   ```bash
   npm test
   # or
   yarn test
   ```

4. **Lint Your Code**
   ```bash
   npm run lint
   # or
   yarn lint
   ```

5. **Commit Your Changes**
   Follow the [Commit Message Guidelines](#commit-message-guidelines)

6. **Push to Your Fork**
   ```bash
   git push origin your-branch-name
   ```

7. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill out the PR template
   - Submit the PR

## Code Style

- Use **TypeScript** for type safety
- Follow the [Next.js Style Guide](https://nextjs.org/docs/basic-features/eslint)
- Use **Prettier** for code formatting
- Write meaningful comments for complex logic
- Keep components small and focused

### Linting and Formatting

```bash
# Run ESLint
npm run lint
# or
yarn lint

# Format code with Prettier
npm run format
# or
yarn format
```

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. Example commit messages:

```
feat: add user authentication
fix: resolve login redirect issue
docs: update README with setup instructions
style: format button component
refactor: improve error handling
perf: optimize image loading
test: add unit tests for auth service
chore: update dependencies
```

## Pull Request Process

1. Ensure your code passes all tests
2. Update the documentation if needed
3. Ensure your branch is up to date with the main branch
4. Request reviews from at least one maintainer
5. Address any feedback or requested changes
6. Once approved, a maintainer will merge your PR

## Reporting Bugs

Found a bug? Please help us by submitting an issue. Include:

1. A clear, descriptive title
2. Steps to reproduce the issue
3. Expected vs. actual behavior
4. Screenshots if applicable
5. Browser/OS version

## Feature Requests

We welcome feature requests! Please:

1. Check if the feature already exists
2. Explain why this feature would be valuable
3. Include any relevant examples or mockups

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
