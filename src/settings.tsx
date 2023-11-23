import { components, settings, util } from "replugged";
const { Text } = components;
const { TextInput } = components;

const cfg = await settings.init("dev.lisekilis.RepluggedEdited");

export function Settings(): React.ReactElement {
  return (
    <>
      <Text.H1>The key that gets replaced:</Text.H1>
      <TextInput {...util.useSetting(cfg, "key", "(edited)")} />
    </>
  );
}
