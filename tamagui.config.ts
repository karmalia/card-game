import {
  createTamagui,
  createFont,
  createTokens,
  createTheme,
} from "@tamagui/core";

import { config } from "@tamagui/config/v3";

// you usually export this from a tamagui.config.ts file

const tamaguiConfig = createTamagui({
  ...config,

  tokens: {
    ...config.tokens,
    color: {
      ...config.tokens.color,
      cardRed: "rgb(224, 85, 74)",
      cardYellow: "rgb(222, 194, 56)",
      cardBlue: "rgb(39, 148, 214)",
      cardForeground: "#FFFFFF",
      deckColor: "rgba(19, 106, 71, 255)",
      metinRed: "rgba(91, 34, 4, 255)",
      cardText: "rgba(72, 51, 1, 255)",
    },
  },
});
// TypeScript types across all Tamagui APIs

export type AppConfig = typeof tamaguiConfig;

declare module "@tamagui/core" {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default tamaguiConfig;
