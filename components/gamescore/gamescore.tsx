import { ImageBackground, Text } from "react-native";
import React from "react";
import useGameStore from "@/stores/game.store";
import { Stack, View } from "tamagui";
import { ConvertToMinuteString } from "@/utils";

const GameScore = () => {
  const { score, time, increaseTime, gamePhase } = useGameStore();

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (gamePhase === 3) {
        clearInterval(interval);
      } else {
        increaseTime();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [gamePhase]);

  return (
    <View position="absolute" top={"$4"} left={"$4"} gap="$3">
      <Stack height={"$3"} alignItems="center" justifyContent="center">
        <ImageBackground
          source={require("@/assets/backgrounds/ScoreBoard.png")}
          resizeMode="stretch"
          style={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#F5F5DC",
              fontSize: 20,
              fontFamily: "DragonSlayer",
              textAlign: "center",
              letterSpacing: 1,
              paddingHorizontal: 24,
            }}
          >
            Score: {score}
          </Text>
        </ImageBackground>
      </Stack>
      <Stack height={"$3"} alignItems="center" justifyContent="center">
        <ImageBackground
          source={require("@/assets/backgrounds/ScoreBoard.png")}
          resizeMode="stretch"
          style={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#F5F5DC",
              fontSize: 20,
              fontFamily: "DragonSlayer",
              textAlign: "center",
              letterSpacing: 1,
            }}
          >
            TIME:{" "}
            <Text
              style={{
                letterSpacing: 2,
              }}
            >
              {ConvertToMinuteString(time)}
            </Text>
          </Text>
        </ImageBackground>
      </Stack>
    </View>
  );
};

export default GameScore;
