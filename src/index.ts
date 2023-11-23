import { common, Injector } from "replugged";
import { cfg } from "./config";

export * from "./settings";

const inject = new Injector();
const { messages } = common;
const key = cfg.get("key", "(edited)");

interface HTTPResponse<T = Record<string, unknown>> {
  body: T;
  headers: Record<string, string>;
  ok: boolean;
  status: number;
  text: string;
}

export async function start(): Promise<void> {
  inject.after(messages, "sendMessage", (_args, res) => {
    return (res as Promise<HTTPResponse<Record<string, string>>>).then((httpres) => {
      const org_content = httpres.body!.content;
      const edited = org_content.indexOf(key);
      if (edited !== -1) {
        const msgid = httpres.body!.id;
        const msgchid = httpres.body!.channel_id;
        const content = `${org_content.slice(0, edited)}\u202B\u202B${org_content.slice(
          edited + key.length,
        )}`;
        messages.editMessage(msgchid, msgid, { content });
      }
      return httpres;
    });
  });
}

// note: the code above was made bu a incredibly stupid person(me) on his first time using typescript
export function stop(): void {
  inject.uninjectAll();
}
