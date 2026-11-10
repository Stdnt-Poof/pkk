# Backend rules (Laravel, PHP 8.3) — condensed

- Conventions: match sibling files; reuse existing components before writing new ones; descriptive names.
- No new base folders, no dependency changes, no documentation files unless explicitly requested.
- New files via `php artisan make:* --no-interaction` (check `--help`). APIs return Eloquent API Resources (existing convention).
- Tests: factories for models; run the narrowest set — `php artisan test --compact [path | --filter=name]`. Prefer tests over tinker/verification scripts.
- Pint after every PHP edit: `vendor\bin\pint --format agent` (`--dirty` unsupported, never `--test`).
- Tinker under PowerShell: `php artisan tinker --execute="Code::go(fn() => ...)"` — outer double quotes, inner single-quoted PHP strings, no `$vars` (shell expands them).
- PHP style: explicit param/return types, constructor promotion, curly braces always, TitleCase enum cases, PHPDoc over inline comments.
- Confirm package versions (`composer show --direct`) before version-specific APIs.
- If a UI change is invisible: run `npm run build` in FrontEnd.
