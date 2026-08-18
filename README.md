# CommandMate tutorial

<!-- TODO(#1808): 確定した定義文に差し替える -->
**Vibe engineering** is the loop where you stop prompting and start contracting:
you state the requirement as a contract, an agent does the work, and a
verification gate decides whether it counts — *requirement → contract → agent →
verified result*.

This repository is a tiny web app with two bugs left in on purpose, plus the two
pieces that make that loop real:

| File | What it is |
|---|---|
| `.commandmate/verify.yaml` | the repository's verification gate — `npm test` |
| `.commandmate/tasks/fix-greet.yaml` | a contract for bug 1, gated on `npm run test:greet` |
| `.commandmate/tasks/fix-shout.yaml` | a contract for bug 2, gated on `npm run test:shout` |

Fork it, point [CommandMate](https://github.com/Kewton/CommandMate) at it, and
you will have run the loop end to end in about fifteen minutes.

Nothing here is CommandMate-specific. It is an ordinary git repository with no
dependencies — `npm test` and `npm start` work on their own.

## Before you start

- **CommandMate 0.24.0+**, running. If not: `npx commandmate@latest`
  (the contracts here carry their own gate definitions — `gateDefinitions` —
  which needs 0.24.0 or newer)
- **Node.js 22+**
- **One agent CLI**: Claude Code, Codex, or Antigravity

## Step 1 — Fork it, then register it

Fork first. You are going to let an agent commit to this repository, and it
should be committing to *your* copy.

### Fork & Add (needs `gh` authenticated)

In CommandMate, open **Repositories → Add Repository → Clone URL** and paste:

```
https://github.com/Kewton/commandmate-tutorial.git
```

Choose **Fork & Add**. CommandMate forks it to your account with `gh`, clones
your fork into its configured root directory, and registers it as a session.

### Fork by hand

```bash
gh repo fork Kewton/commandmate-tutorial --clone=false
```

Or use the **Fork** button on GitHub. Then open **Repositories → Add
Repository → Clone URL** and paste **your fork's** clone URL.

Either way you end up with one session, on `main`, in CommandMate's root
directory. Note its worktree id:

```bash
commandmate ls
```

## Step 2 — Install the two Skills

Open the **Catalog** and install both into this worktree:

- **`cmate-verify`** — teaches your agent to run the gates and read the exit code
- **`cmate-task-contract`** — teaches it to work inside an execution contract

From the CLI, that is:

```bash
commandmate skill install cmate-verify --worktree <worktree-id>
commandmate skill install cmate-task-contract --worktree <worktree-id>
```

## Step 3 — Run the gate before you touch anything

```bash
commandmate verify <worktree-id>
```

```
✖ unit  (npm test)
exit 20
```

**Exit 20 means a gate failed**, and that is the correct starting point. The
gate is `npm test`, and two tests fail on purpose:

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

You now have a red gate and a number to watch. Everything after this is about
turning that number into 0 — twice, independently.

## Step 4 — Hand the first contract to an agent

Do not describe the bug in a chat message. Send the contract:

```bash
commandmate send <worktree-id> --contract .commandmate/tasks/fix-greet.yaml
```

CommandMate records a task, then hands the agent the contract's goal along with
its scope — `src/greet.js` only, with `test/**` and `.commandmate/**` denied, so
the agent cannot "fix" the test instead of the code. Then wait for it:

```bash
commandmate wait <worktree-id> --verify
```

```
✔ issue-greet  (npm run test:greet)
exit 0
```

**Exit 0.** Note what was judged: the contract's own gate, `issue-greet` →
`npm run test:greet` — not the repository-wide `unit` gate. That is what
`gateDefinitions` in the contract buys you. `npm test` is still red, because
`shout()` is still unimplemented, and that is fine. One contract, one gate, one
verdict.

## Step 5 — Go parallel with a second contract

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

Go to **Repositories → Sync All** (or run `commandmate sync`). The new worktree
appears as a second session. Send it the second contract:

```bash
commandmate send <shout-worktree-id> --contract .commandmate/tasks/fix-shout.yaml
commandmate wait <shout-worktree-id> --verify
```

```
✔ issue-shout  (npm run test:shout)
exit 0
```

Two branches, two agents, two gates — and neither one could have passed by
breaking the other, because each contract only allows `src/greet.js` and only
judges its own test file.

## Step 6 — Read the record

Nothing above depended on you watching it happen. The verdicts are stored:

```bash
commandmate verify history --worktree <worktree-id>
commandmate task list <worktree-id>
commandmate task show <task-id>
```

`task show` gives you the contract, the run that judged it, and the gate log
tails. That is the artifact you review — not a chat transcript.

## What you just used

| Step | CommandMate feature |
|---|---|
| 1 | Fork & Add — fork and register a repository into the managed root |
| 2 | Catalog — install Skills into a worktree |
| 3 | `verify` — run the declared gates, exit 20 on failure |
| 4 | `send --contract` / `wait --verify` — contract in, verdict out |
| 5 | One session per worktree, running in parallel |
| 6 | `verify history` / `task show` — the durable record |

## Optional — watch it in the browser

The app is a real server, so you can see the first bug instead of reading about
it. Before Step 4, start it:

```bash
npm start
```

It listens on **port 4173**. Register it in CommandMate under **External Apps**
with a path prefix, and CommandMate will proxy it — no separate tab, and it
works from your phone too.

The heading is missing its exclamation mark:

> # Hello, CommandMate

Leave the page open, run Step 4, then **restart the app** (`Ctrl+C`, then
`npm start` again) and reload:

> # Hello, CommandMate!

> **Why the restart?** `src/server.js` imports `greet` once, when the process
> starts, so a running server keeps serving the old code no matter what is on
> disk. Nothing here reloads for you. This is not a quirk of the tutorial — it
> is the same reason a real dev server needs restarting when you change code it
> loaded at boot.

## Notes

- The worktree must live **inside CommandMate's root directory** — a sibling of
  this repository is inside it. CommandMate refuses to register paths outside
  that root.
- Antigravity's non-interactive mode (`agy --print`) waits on a trust prompt on
  first run in a new project. Answer it once in interactive mode, or pass
  `--dangerously-skip-permissions` if you understand what it skips.
- `.commandmate/verify.yaml` and `.commandmate/tasks/*.yaml` are tracked in git;
  everything else CommandMate writes under `.commandmate/` is local runtime data
  and is ignored.

## Cleaning up

```bash
git worktree remove ../commandmate-tutorial-fix-shout
```

Then remove the repository from CommandMate's **Repositories** screen.

## License

MIT
