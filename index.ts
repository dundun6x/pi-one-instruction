import { join, resolve } from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { getAgentDir, type ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { type AutocompleteItem } from "@earendil-works/pi-tui";

export default function (pi: ExtensionAPI) {
  let file: string | null;
  let enabled = true;
  pi.registerFlag("instruction", {
    description: "Use a custom instruction file",
    type: "string",
  });
  pi.on("session_start", (_event, ctx) => {
    const arg = pi.getFlag("instruction") as string | undefined;
    if (arg != null) {
      file = resolve(ctx.cwd, arg);
      return;
    }
    const userFile = join(getAgentDir(), "INSTRUCTION.md");
    const projectFile = join(process.cwd(), ".pi", "INSTRUCTION.md");
    file = [projectFile, userFile].find(existsSync) ?? null;
  });
  pi.registerCommand("one-instruction", {
    description: "Toggle one instruction",
    getArgumentCompletions: (prefix): AutocompleteItem[] => {
      return ["on", "off", "view"]
        .filter((value) => value.startsWith(prefix.trim()))
        .map((value) => ({ value, label: value }));
    },
    handler: async (args, ctx) => {
      const value = args.trim().toLowerCase();
      if (value === "on") {
        enabled = true;
        ctx.ui.notify("One instruction enabled", "info");
      } else if (value === "off") {
        enabled = false;
        ctx.ui.notify("One instruction disabled", "info");
      } else if (value === "view") {
        if (file == null) {
          ctx.ui.notify("INSTRUCTION.md not found in project or user configuration", "warning");
          return;
        }
        const numbered = readFileSync(file, "utf8")
          .split("\n")
          .map((line, n) => `${n + 1}  ${line}`)
          .join("\n");
        ctx.ui.notify(`View: ${file}\n${numbered}`, "info");
      } else {
        ctx.ui.notify("Usage: /one-instruction on|off|view", "warning");
      }
    },
  });
  pi.on("before_agent_start", () => {
    if (file == null || !enabled) return;
    const instr = readFileSync(file, "utf8");
    return {
      systemPrompt: instr
    }
  });
  pi.on("before_provider_request", (event) => {
    if (file == null || !enabled) return;
    type Message = { role?: string; [key: string]: unknown };
    const payload = event.payload as { input?: Message[] };
    if (Array.isArray(payload?.input)) {
      payload.input = payload.input.filter(msg => msg.role !== "developer");
    }
  });
}
