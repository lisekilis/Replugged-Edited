import { settings } from "replugged";

interface Settings {
  key?: string;
}

const defaultSettings = {
  key: "(edited)",
} satisfies Partial<Settings>;

export const cfg = await settings.init<Settings, keyof typeof defaultSettings>(
  "dev.lisekilis.RepluggedEdited",
  defaultSettings,
);
