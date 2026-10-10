// Figma Code Connect mapping — shows this snippet in Dev Mode when the
// "Health Meter" component is inspected. Publish with: npx figma connect publish
import figma from "@figma/code-connect";
import { HealthMeter } from "./HealthMeter";

figma.connect(
  HealthMeter,
  "https://www.figma.com/design/TZgxPpajwUGLZ275fLfyJv/WIT-ASSESSMENT?node-id=9-75",
  {
    props: {
      // Figma variant → the data that produces it. The visual state is derived
      // from money, never passed in, so design and code can't drift apart.
      committed: figma.enum("State", {
        Comfortable: 335, // €290 transfer + ~€45 round-ups → €275 left (55%)
        Tight: 430, //       €385 transfer + ~€45 round-ups → €180 left (70%)
        "At risk": 1000, //  €955 transfer + ~€45 round-ups → €390 short (164%)
      }),
    },
    example: ({ committed }) => <HealthMeter free={610} committed={committed} />,
  },
);
