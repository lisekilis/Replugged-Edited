import { Injector, common, components, types, Logger } from "replugged";
import { cfg } from "./config";

export * from "./settings";

const { messages } = common;
const { MenuItem } = components.ContextMenu;
const { ContextMenuTypes } = types;
const { toast } = common;
const inject = new Injector();
const key = cfg.get("key", "(edited)");
const logger = Logger.plugin("Replugged-Edited");

interface HTTPResponse<T = Record<string, unknown>> {
  body: T;
  headers: Record<string, string>;
  ok: boolean;
  status: number;
  text: string;
}
function editMessage(msgchid: string, msgid: string, orgContent: string) {
  const edited = orgContent.indexOf(key);
  if (edited !== -1) {
    const content = `${orgContent.slice(0, edited)}\u202B\u202B${orgContent.slice(
      edited + key.length,
    )}`;
    return messages.editMessage(msgchid, msgid, { content });
  }
  return -1;
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function start(): Promise<void> {
  inject.utils.addMenuItem(
    ContextMenuTypes.Message,
    (data: {
      channel: { id: string };
      message: { id: string; content: string; author: { id: string } };
    }) => {
      const item = {
        id: "Edited",
        label: "(Edit) Message",
        action: () => {
          if (editMessage(data.channel.id, data.message.id, data.message.content) == -1) {
            toast.toast("No key found!", toast.Kind.FAILURE, { duration: 5000 });
          } //logger.log(data.message.author) replace me,
        },
        type: MenuItem,
      };
      if (data.message.author.id == common.users.getCurrentUser().id) {
        return item;
      }
      return;
    },
    2,
    -1,
  );
  inject.after(messages, "sendMessage", (_args, res) => {
    return (res as Promise<HTTPResponse<Record<string, string>>>).then((httpres) => {
      return editMessage(httpres.body.channel_id, httpres.body.id, httpres.body.content);
    });
  });
  inject.before(messages, "editMessage", (args) => {
    const orgContent = args[2].content;
    const edited = orgContent.indexOf(key);
    if (edited !== -1) {
      const content = `${orgContent.slice(0, edited)}\u202B\u202B${orgContent.slice(
        edited + key.length,
      )}`;
      args[2].content = content;
    }
    return args;
  });
}

// note: the code above was made bu a incredibly stupid person(me) on his first time using typescript
export function stop(): void {
  inject.uninjectAll();
}
