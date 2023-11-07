import { common, Injector, Logger, webpack } from "replugged";
import { Messages } from "replugged/dist/renderer/modules/common/i18n";

const inject = new Injector();
const logger = Logger.plugin("Edited");
const messages = common;

export async function start(): Promise<void> {
  const messages = await webpack.waitForProps<{
    sendMessage: (id: string) => {
      name: string;
    };
  }>("sendMessage");

  if (messages) {
    inject.after(messages, "sendMessage", (_args, res) => {
      //this errors fro some reason but works
      if (!(res instanceof Promise)) {
        logger.log("Not a Promise");
        return res;
      }

      return res.then((httpres: Response) => {
        // console.log("Response: ", httpres);
        const org_content = httpres.body.content;
        const edited = org_content.indexOf("(edited)");
        if (edited !== -1) {
          const msgid = httpres.body.id;
          const msgchid = httpres.body.channel_id;
          const content = `${org_content.slice(0, edited)}\u202B\u202B${org_content.slice(
            edited + "(edited)".length,
          )}`;
          messages.editMessage(msgchid, msgid, { content });
        }
        return httpres;
      });
    });
  }
}
// note: the code above was made bu a incredibly stupid person(me) on his first time using typescript
export function stop(): void {
  inject.uninjectAll();
}
