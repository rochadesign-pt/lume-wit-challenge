// Figma Code Connect mapping for the target-month picker.
// Publish with: npx figma connect publish
import figma from "@figma/code-connect";
import { SegmentedControl, Segment } from "./SegmentedControl";

const FILE = "https://www.figma.com/design/TZgxPpajwUGLZ275fLfyJv/WIT-ASSESSMENT";

// Segment: label and consequence map 1:1. The "Selected" variant is not a prop:
// in code it is derived from the group's value, so only one segment can ever be selected.
figma.connect(Segment, `${FILE}?node-id=12-220`, {
  props: {
    label: figma.string("Label"),
    sub: figma.string("Sub"),
  },
  example: ({ label, sub }) => <Segment value={label.toLowerCase()} label={label} sub={sub} />,
});

// Segmented Control: renders whatever Segment instances the designer placed inside it.
figma.connect(SegmentedControl, `${FILE}?node-id=12-221`, {
  props: {
    segments: figma.children("Segment"),
  },
  example: ({ segments }) => (
    <SegmentedControl label="Have it by the end of" value="jun" onChange={(month) => setTargetMonth(month)}>
      {segments}
    </SegmentedControl>
  ),
});

// Placeholder for the Plan Editor's state setter in the snippet above.
declare function setTargetMonth(month: string): void;
