# CommandMate tutorial

A tiny web app with two bugs left in on purpose. Clone it, point an agent at it,
and you will have used the core of [CommandMate](https://github.com/Kewton/CommandMate)
in about ten minutes.

Nothing here is CommandMate-specific. It is an ordinary git repository with no
dependencies — `npm test` and `npm start` work on their own.

## Before you start

- **CommandMate is running.** If not: `npx commandmate@latest`
- **Node.js 22+**
- **One agent CLI**: Claude Code, Codex, or Antigravity

## Step 1 — Clone it into CommandMate

In CommandMate, open **Repositories**, choose the clone tab, and paste:

```
https://github.com/Kewton/commandmate-tutorial.git
```

It lands inside CommandMate's configured root directory and shows up as a
session.

## Step 2 — Let an agent fix a failing test

Two tests fail on purpose:

```bash
npm test
```

```
✖ greet ends with an exclamation mark
    actual:   'Hello, World'
    expected: 'Hello, World!'
✖ shout uppercases the greeting
    Error: shout() is not implemented yet
```

Open the session and ask your agent:

> `npm test` fails. Fix the first failure only, then run the tests again.

The fix is one character in `src/greet.js`. The point is not the difficulty —
it is watching the agent run the tests, change the code, and re-run them while
you watch from the browser (or your phone).

## Step 3 — See the change in the browser

Start the app:

```bash
npm start
```

It listens on **port 4173**. Register it in CommandMate under **External Apps**
with a path prefix, and CommandMate will proxy it — no separate tab, and it
works from your phone too.

The heading on the page comes from the same `greet()` you just fixed:

- Before: `Hello, CommandMate`
- After: `Hello, CommandMate!`

That is the loop: **an agent changes code → you see the result.**

## Step 4 — Go parallel with a worktree

CommandMate runs **one session per git worktree**, side by side. It *discovers*
worktrees — it does not create them. So have your agent create one.

### Claude Code / Codex

A `worktree-new` skill ships with this repository:

```
/worktree-new fix/shout
```

### Antigravity

Paste this instead:

> Create a git worktree for a new branch `fix/shout`.
> Put it next to this repository, as a sibling directory named
> `commandmate-tutorial-fix-shout`, using
> `git worktree add -b fix/shout ../commandmate-tutorial-fix-shout`.
> Stop if that directory already exists. Print the path you created.
> Do not use `--force`.

### Then

Go to **Repositories → Sync**. The new worktree appears as a second session.
Ask *that* session to implement `shout()` — the second failing test — while the
first session stays where it is.

Two branches, two agents, one browser.

## What you just used

| Step | CommandMate feature |
|---|---|
| 1 | Clone a repository into the managed root |
| 2 | Run an agent CLI in a session, from any browser |
| 3 | External Apps — proxy your dev server through CommandMate |
| 4 | One session per worktree, running in parallel |

## Notes

- The worktree must live **inside CommandMate's root directory** — a sibling of
  this repository is inside it. CommandMate refuses to register paths outside
  that root.
- Antigravity's non-interactive mode (`agy -p`) waits on a trust prompt on first
  run in a new project. Answer it once in interactive mode, or pass
  `--dangerously-skip-permissions` if you understand what it skips.

## Cleaning up

```bash
git worktree remove ../commandmate-tutorial-fix-shout
```

Then remove the repository from CommandMate's **Repositories** screen.

## License

MIT
