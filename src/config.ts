import { settings } from "replugged";

interface Settings {
  key?: string;
  toggle?: boolean;
}

const defaultSettings = {
  key: "(edited)",
  toggle: true,
} satisfies Partial<Settings>;

export const cfg = await settings.init<Settings, keyof typeof defaultSettings>(
  "dev.lisekilis.RepluggedEdited",
  defaultSettings,
);
