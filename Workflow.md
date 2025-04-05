# 🧪 Team Workflow Guide

## 🔧 How We Work
- `main`: only stable, released code
- `dev`: active development
- All new branches start from `dev` and are merged back via PRs.

---

## 🌱 Branch Naming

Use consistent branch names:

- `feature/<name>` - new functionality
- `fix/<name>` - bug fixes
- `hotfix/<name>` - critical urgent fixes
- `improvement/<name>` - UI/UX or general improvements
- `test/<name>` - adding tests



**Examples:**
```
feature/user-profile
fix/login-bug
hotfix/payment-crash
```

---

## ✍️ Commit Format
Each commit message should consist of a header, a body (optional), and a footer (optional). The header has a specific format that includes a type, an optional scope, and a subject:

```
<type>(<scope>(optional)): <subject>
<BLANK LINE>
<body> (optional)
<BLANK LINE>
<footer> (optional)
```

**Examples:**
```
feat(auth): add social login
fix(ui): fix dropdown overflow
chore(ci): update GitHub Actions version
```

### ✅ Allowed Commit Types
- `feat` – new feature
- `fix` – bug fix
- `refactor` – internal code restructure
- `style` – formatting only
- `docs` – documentation only
- `test` – adding or updating tests
- `chore` – non-functional updates (e.g., version bump, config)
- `ci` – CI/CD changes
- `build` – build scripts or dependency updates
- `revert` – revert previous commits
- `perf` – performance improvements
- `merge` – manual branch merges

---

## 🚀 Versioning & Releases
We use a versioning pattern: `v<major>.<minor>.<patch>`

- **Patch** – small feature or fixes
- **Minor** – module/milestone complete
- **Major** – stable public release



## 📝 Changelog Format
Each release (on `dev → main` merge) updates `CHANGELOG.md`
```
## v0.3.2 – April 4, 2025
- Added notification settings
- Fixed crash on mobile
- Improved token refresh logic
```

---

## ✅ Final Checklist
- [ ] Branch is correctly named
- [ ] Commits follow format
- [ ] PR targets `dev`
- [ ] Version bumped only when merging to `main`
- [ ] CHANGELOG updated

This doc helps us stay fast and consistent. If in doubt, refer here or ask the team. Let’s build cool stuff 🚀