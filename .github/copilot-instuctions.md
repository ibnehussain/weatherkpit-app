# Copilot Instructions

## Efficiency Guidelines (reduce agent-mode credit usage)
- Do not re-read files that were just read or edited in this session unless the content may have changed externally.
- Batch independent read-only operations (searches, file reads) in parallel instead of one at a time.
- Avoid redundant verification: only run tests/builds after meaningful code changes, not after every small edit.
- Prefer targeted greps/semantic searches over broad directory listings or reading entire large files.
- Don't scaffold or explain unrequested features, alternatives, or extensive documentation unless asked.
- Keep responses concise; avoid restating code back in prose when a diff/file reference suffices.
- Avoid launching long-running dev servers or repeated terminal polling unless explicitly required to verify a change.
- When a plan or architecture is already agreed upon, proceed to implementation without re-confirming each step.