import { ImageBackground, Text } from "react-native";
import React from "react";
import useGameStore from "@/stores/game.store";
import { Stack } from "tamagui";

const GameScore = () => {
  const { score } = useGameStore();
  return (
    <Stack
      height={"$3"}
      alignItems="center"
      justifyContent="center"
      position="absolute"
      top={"$6"}
      left={"$5"}
    >
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
  );
};

export default GameScore;
