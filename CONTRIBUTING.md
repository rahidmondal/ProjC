
# Contribution Guidelines 


## Guidelines for Reporting Issues

If you find a bug or have a feature request, please create an issue detailing the following:

### What

- Clearly describe the problem or the feature you are requesting.
- Include any relevant error messages or screenshots.

### Where

- Specify where the issue occurs, such as the module or component affected.
- Provide the version of the software where the issue was found.

### How

- Describe the steps to reproduce the issue.
- Include any relevant code snippets or configurations.

By providing this information, you help us understand the issue better and address it more efficiently.

## Branch Naming Conventions

Please follow these conventions when naming your branches:

- `fix/<issue-name>`: For bug fixes
- `feature/<feature-name>` or `feature/<issue-name>`: For new features
- `hot-fix/<issue-name>`: For urgent fixes that need to be addressed immediately

### Branch Management

- The `main` branch is updated when a new release is completed.
- The `dev` branch is the base for any new issue or feature development.

Both `main` and `dev` branches are locked and do not accept direct commits without a pull request.


## Guidelines for Commit Messages

Please adhere to the following guidelines when writing your commit messages:

### Commit Message Format

Each commit message should consist of a header, a body (optional), and a footer (optional). The header has a specific format that includes a type, an optional scope, and a subject:

```
<type>(<scope>(optional)): <subject>
<BLANK LINE>
<body> (optional)
<BLANK LINE>
<footer> (optional)
```

#### Types

The type must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing or correcting existing tests
- **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- **ci**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

##### Scope

The scope provides additional contextual information and should be the name of the module or component affected (e.g., `core`, `runtime`, `cli`, etc.).

##### Subject

The subject contains a succinct description of the change:

- Use the imperative, present tense: "change" not "changed" nor "changes"
- Do not capitalize the first letter
- Do not end the subject with a period

##### Body

The body is optional and should include the motivation for the change and contrast this with previous behavior.

##### Footer

The footer is optional and should include any information about breaking changes and is also the place to reference GitHub issues that this commit closes.

Example:

```
feat(core): add new time tracking feature

This feature allows users to track time more efficiently.

Closes #123
```


## Version Bumping

We follow a versioning format of v`major.minor.fix`.
```
v0.2.5
v0.3.0
```

### Versioning Rules

- **Major**: Incremented for significant changes or breaking changes.
- **Minor**: Incremented when any new feature is added.
- **Fix**: Incremented for all bug fixes.

### Commit for Version Bump

The last commit in a given issue should be a `chore` commit that bumps the version number.

Example:

```
chore(release): bump version to v0.4.1 from v0.4.1
```