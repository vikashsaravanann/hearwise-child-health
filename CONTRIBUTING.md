# Contributing to HearWise

Thank you for your interest in helping us eliminate undetected childhood hearing loss in India. Every contribution — code, translation, documentation, or pilot feedback — moves us closer to screening every child before age 10.

## Code of Conduct

Be respectful, inclusive, and constructive. We are building tools for children and their teachers — keep that responsibility in mind in every discussion and review.

## Ways to Contribute

- 🐛 **Bug reports** — Open a GitHub issue with steps to reproduce, expected vs. actual behavior, and device/browser info.
- ✨ **Feature requests** — Open an issue describing the problem you're solving (not just the solution).
- 🌍 **Translations** — Help us add more Indian languages (Hindi, Telugu, Kannada, Bengali, Marathi, etc.). See `src/lib/i18n.ts`.
- 📖 **Documentation** — Improve setup guides, screening protocols, or pilot playbooks.
- 🧪 **Pilot feedback** — If you run a screening session, share what worked and what didn't.

## Development Setup

```bash
git clone https://github.com/vikashsaravanann/hearwise-child-health.git
cd hearwise-child-health
npm install
cp .env.example .env.local   # fill in Supabase keys
npm run dev
```

Open `http://localhost:8080`.

## Branch Strategy

- `main` — Production. Auto-deploys to Vercel.
- `dev` — Integration branch for upcoming releases.
- `feature/<short-name>` — One feature per branch. Open a PR into `dev`.
- `fix/<short-name>` — Bug fixes.

## Pull Request Checklist

Before opening a PR, make sure:

- [ ] `npm run lint` passes
- [ ] `npm run test` passes
- [ ] `npm run build` succeeds
- [ ] You've added/updated tests for new logic (especially in `src/lib/clinicalSafety.ts` or `src/lib/testEngine.ts`)
- [ ] UI changes work on a 360px-wide viewport (mobile-first)
- [ ] Both English and Tamil strings are added if you touched UI text
- [ ] No hardcoded colors — use semantic tokens from `src/index.css` and `tailwind.config.ts`

## Coding Standards

- **TypeScript strict** — no `any` unless unavoidable.
- **Mobile-first** — minimum 60px tap targets, no flashing animations (seizure safety).
- **Accessibility** — every interactive element must be keyboard-reachable and screen-reader labeled.
- **i18n** — all user-facing strings go through `t(key, lang)` from `src/lib/i18n.ts`.
- **Database** — never edit `src/integrations/supabase/types.ts` or `supabase/migrations/`. Use new migrations for schema changes.

## Clinical Safety

HearWise is a **screening** tool, not a diagnostic device. Any change to:

- The screening algorithm (`src/lib/testEngine.ts`)
- The clinical thresholds or readiness checks (`src/lib/clinicalSafety.ts`)
- The audiometric tone generation (`src/lib/audio.ts`)
- The parent-facing summary text

...requires review by someone with audiology or pediatric ENT background. Tag `@vikashsaravanann` on the PR.

## Reporting Security Issues

Do **not** open a public issue for security vulnerabilities. Email `security@hearwise.in` (or DM the maintainer) with details. We aim to respond within 72 hours.

## License

By contributing, you agree that your contributions will be licensed under the MIT License (see `LICENSE`).