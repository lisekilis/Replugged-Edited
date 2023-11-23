import { Injector, common } from "replugged";
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

// eslint-disable-next-line @typescript-eslint/require-await
export async function start(): Promise<void> {
  inject.after(messages, "sendMessage", (_args, res) => {
    return (res as Promise<HTTPResponse<Record<string, string>>>).then((httpres) => {
      const orgContent = httpres.body.content;
      const edited = orgContent.indexOf(key);
      if (edited !== -1) {
        const msgid = httpres.body.id;
        const msgchid = httpres.body.channel_id;
        const content = `${orgContent.slice(0, edited)}\u202B\u202B${orgContent.slice(
          edited + key.length,
        )}`;
        void messages.editMessage(msgchid, msgid, { content });
      }
      return httpres;
    });
  });
}

// note: the code above was made bu a incredibly stupid person(me) on his first time using typescript
export function stop(): void {
  inject.uninjectAll();
}
