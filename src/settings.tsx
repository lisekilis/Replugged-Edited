import { components, settings, util } from "replugged";

const { Clickable, Divider, FormItem, SwitchItem, Text, TextInput, Tooltip } = components;

const cfg = await settings.init("dev.lisekilis.RepluggedEdited");

export function Settings(): React.ReactElement {
  return (
    <>
      <SwitchItem
        {...{
          note: "Replaces the Key when sending or editing messages.",
          ...util.useSetting(cfg, "toggle", true),
        }}>
        Automatic Key replacement
      </SwitchItem>
      <Text.H2>Key:</Text.H2>
      <FormItem title="It's the Key that gets replaced">
        <Tooltip text="Pro tip: don't set it to a single letter">
          {<TextInput {...util.useSetting(cfg, "key", "(edited)")} />}
        </Tooltip>
      </FormItem>
      <Divider />
      <Clickable
        onClick={() =>
          window.open("https://discord.com/vanityurl/dotcom/steakpants/flour/flower/index11.html")
        }>
        {<Text.H2>♪(^∇^*)</Text.H2>}
      </Clickable>
    </>
  );
}
