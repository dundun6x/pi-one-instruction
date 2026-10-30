# pi-one-instruction

[![npm version](https://img.shields.io/npm/v/pi-one-instruction)](https://www.npmjs.com/package/pi-one-instruction)
[![npm downloads](https://img.shields.io/npm/dm/pi-one-instruction)](https://www.npmjs.com/package/pi-one-instruction)
[![license](https://img.shields.io/github/license/dundun6x/pi-one-instruction)](LICENSE)

Overwrite [Pi](https://github.com/earendil-works/pi)'s system prompts with a single instruction file.

## Installation

```bash
$ pi install npm:pi-one-instruction
```

## Usage

Instruction files are checked in the following order of priority:

- `pi --instruction <file>` — Highest priority instruction
- `./.pi/INSTRUCTION.md` — Project-level instruction
- `~/.pi/agent/INSTRUCTION.md` — User-level instruction

In-session commands are available:

- `/one-instruction on` — Enable the custom instruction
- `/one-instruction off` — Disable the custom instruction
- `/one-instruction view` — View the custom instruction

When enabled (by default), the instruction file replaces the assembled system prompt. Any built-in or additional instructions provided by Pi or extensions are discarded. However, they remain in the underlying session data. To prevent them from reaching the model via session history, they are filtered out before being sent.

## License

[MIT](LICENSE)
