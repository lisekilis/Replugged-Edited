import { Injector, Logger, webpack } from "replugged";

const inject = new Injector();
const logger = Logger.plugin("Edited");

export async function start(): Promise<void> {
  const sendMessageMod = await webpack.waitForProps<{
    sendMessage: (id: string) => {
      name: string;
    };
  }>("sendMessage");

  if (sendMessageMod) {
    inject.after(sendMessageMod, "sendMessage", (args, res) => {
      if (!(res instanceof Promise)) {
        logger.log("Not a Promise");
        return res;
      }

      return res.then((httpres: HTTPResponse) => {
        // console.log("Response: ", httpres);
        const org_content = httpres.body.content;
        const edited = org_content.indexOf("(edited)");
        if (edited !== -1) {
          const msgid = httpres.body.id;
          const msgchid = httpres.body.channel_id;
          const content =
            org_content.slice(0, edited) +
            "\u202B\u202B" +
            org_content.slice(edited + "(edited)".length);
          sendMessageMod.editMessage(msgchid, msgid, { content });
        }
        return httpres;
      });
    });
  }
}

export function stop(): void {
  inject.uninjectAll();
}
