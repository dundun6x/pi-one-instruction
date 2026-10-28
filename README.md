# pi-one-instruction

[![npm version](https://img.shields.io/npm/v/pi-one-instruction)](https://www.npmjs.com/package/pi-one-instruction)
[![npm downloads](https://img.shields.io/npm/dm/pi-one-instruction)](https://www.npmjs.com/package/pi-one-instruction)
[![license](https://img.shields.io/github/license/dundun6x/pi-one-instruction)](LICENSE)

Overwrite Pi's instructions with a single `INSTRUCTION.md`.

## Installation

```bash
$ pi install npm:pi-one-instruction
```

## Usage

Create an `INSTRUCTION.md` in your project-level or user-level configuration directory (`./.pi/` or `~/.pi/agent/`). If both exist, the former takes precedence.

- `/one-instruction on` — Enable the custom instruction
- `/one-instruction off` — Disable the custom instruction
- `/one-instruction view` — View the custom instruction

When enabled (by default), the content of `INSTRUCTION.md` replaces the final assembled instructions, overwriting any modifications made by Pi or extensions.

## License

[MIT](LICENSE)
