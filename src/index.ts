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

      return res.then((httpres) => {
        console.log("Response: ", httpres);
        return httpres;
      });
    });
  }
}

export function stop(): void {
  inject.uninjectAll();
}
