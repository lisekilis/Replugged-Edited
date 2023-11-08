import { common, Injector, Logger } from "replugged";

const inject = new Injector();
const logger = Logger.plugin("Edited");
const { messages } = common;

export async function start(): Promise<void> {
  inject.after(messages, "sendMessage", (_args, res) => {
    if (!(res instanceof Promise)) {
      logger.log("Not a Promise");
      return res;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return res.then((httpres: any) => {
      // console.log("Response: ", httpres);
      const org_content = httpres.body!.content;
      const edited = org_content.indexOf("(edited)");
      if (edited !== -1) {
        const msgid = httpres.body!.id;
        const msgchid = httpres.body!.channel_id;
        const content = `${org_content.slice(0, edited)}\u202B\u202B${org_content.slice(
          edited + "(edited)".length,
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
