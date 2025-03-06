import { Dimensions, ImageBackground, StyleSheet, Text } from "react-native";
import React from "react";
import useGameStore from "@/stores/game.store";
import { Stack, View } from "tamagui";
import ConvertToMinuteString from "@/utils/convertToMinuteString";
import useGameScoreStore from "@/stores/game-score.store";
import {
  TopLeft,
  TopRight,
  BottomLeft,
  BottomRight,
} from "@/components/skia-components/corners";

const GameScore = () => {
  const { increaseTime, time } = useGameScoreStore();
  const { point, gamePhase } = useGameStore();
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (gamePhase === 3) {
        clearInterval(interval);
      }

      if (gamePhase === 2) {
        increaseTime();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [gamePhase]);

  return (
    <View style={styles.container} marginHorizontal="$4">
      <Stack style={styles.section}>
        <Text style={styles.sectionText}>Points: {point}</Text>
        {/* Add edged corners */}
        <TopLeft size={12} variant="edged" strokeWidth={2} />
        <TopRight size={12} variant="edged" strokeWidth={2} />
        <BottomLeft size={12} variant="edged" strokeWidth={2} />
        <BottomRight size={12} variant="edged" strokeWidth={2} />
      </Stack>
      <Stack style={styles.section}>
        <Text style={styles.sectionText}>
          TIME:
          {ConvertToMinuteString(time)}
        </Text>
        {/* Add edged corners */}
        <TopLeft size={12} variant="edged" strokeWidth={2} />
        <TopRight size={12} variant="edged" strokeWidth={2} />
        <BottomLeft size={12} variant="edged" strokeWidth={2} />
        <BottomRight size={12} variant="edged" strokeWidth={2} />
      </Stack>
    </View>
  );
};

// create styles
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 14,
    left: 0,
    gap: 12,
  },
  section: {
    height: Dimensions.get("screen").height * 0.1,
    width: Dimensions.get("screen").width * 0.2,
    alignItems: "center",
    justifyContent: "center",
    position: "relative", // Ensure corners are positioned correctly
  },
  sectionImage: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative", // Needed for absolute positioning of corners
  },
  sectionText: {
    color: "#F5F5DC",
    fontSize: Dimensions.get("screen").width * 0.025,
    fontFamily: "TrenchThin",
    textAlign: "center",
    letterSpacing: 2,
    paddingHorizontal: 24,
  },
});

export default GameScore;
