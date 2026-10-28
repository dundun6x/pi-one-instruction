import { join } from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { getAgentDir, type ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { type AutocompleteItem } from "@earendil-works/pi-tui";

export default function (pi: ExtensionAPI) {
  const conf = join(getAgentDir(), "INSTRUCTION.md");
  const local_conf = join(process.cwd(), ".pi", "INSTRUCTION.md");
  const path = [local_conf, conf].find(existsSync);
  const instr = path ? readFileSync(path, "utf8") : null;
  let enabled = true;
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
        if (instr == null) {
          ctx.ui.notify("INSTRUCTION.md not found in project or user configuration", "warning");
          return;
        }
        const numbered = instr
          .split("\n")
          .map((line, n) => `${n + 1}  ${line}`)
          .join("\n");
        ctx.ui.notify(`View: ${path}\n${numbered}`, "info");
      } else {
        ctx.ui.notify("Usage: /one-instruction on|off|view", "warning");
      }
    },
  });
  pi.on("before_agent_start", (event) => {
    if (instr == null || !enabled) return;
    event.systemPromptOptions.forceSystemPrompt = instr;
  });
}
