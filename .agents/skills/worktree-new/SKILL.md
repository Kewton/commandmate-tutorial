---
name: worktree-new
description: Create a new git worktree for a branch, next to the current repository, so CommandMate can pick it up as a parallel session. Use when asked to make a worktree, work on a branch in parallel, or split work across sessions.
---

# worktree-new

Create a git worktree for a branch, placed where CommandMate can find it.

## Why this exists

CommandMate shows one session per git worktree. It **discovers** worktrees — it
does not create them. This skill is the missing step.

## Steps

1. Find the repository root and its parent:

   ```bash
   git rev-parse --show-toplevel
   ```

   The worktree goes in the **parent of that directory**, as a sibling of the
   repository. CommandMate only registers paths inside its configured root
   directory, and the repository itself already lives there — a sibling is
   inside it too. Do not place the worktree somewhere else.

2. Choose the directory name `<repo-name>-<branch-name>`, replacing any `/` in
   the branch name with `-`. Example: repo `commandmate-tutorial`, branch
   `fix/greeting` → `commandmate-tutorial-fix-greeting`.

3. Stop if that directory already exists. Report it and do nothing else.

4. Create the worktree with a new branch:

   ```bash
   git worktree add -b <branch-name> ../<repo-name>-<branch-name>
   ```

   If the branch already exists, omit `-b`:

   ```bash
   git worktree add ../<repo-name>-<branch-name> <branch-name>
   ```

5. Print the absolute path you created.

6. Tell the user to open **Repositories → Sync** in CommandMate so the new
   worktree appears as a session.

## Rules

- Never use `git worktree add --force`.
- Never create the worktree outside the repository's parent directory.
- Never delete or move an existing worktree.
- If `git rev-parse --show-toplevel` fails, you are not in a git repository —
  stop and say so.
