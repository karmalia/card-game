import { StyleSheet, Text, View } from "react-native";
import React from "react";
import useGameStore from "@/stores/game.store";
import { Stack } from "tamagui";

type Props = {};

const GameScore = (props: Props) => {
  const { score } = useGameStore();
  return (
    <Stack
      backgroundColor="#3E4E28"
      borderRadius={10}
      paddingHorizontal="$3"
      height={"$3"}
      alignItems="center"
      justifyContent="center"
      paddingVertical="$2"
      marginHorizontal="$4"
      position="absolute"
      top={"$6"}
      left={10}
    >
      <Text
        style={{
          color: "#F5F5DC",
          fontSize: 18,
          fontFamily: "DragonSlayer",
          textAlign: "center",
          letterSpacing: 1,
        }}
      >
        Score: {score}
      </Text>
    </Stack>
  );
};

export default GameScore;

const styles = StyleSheet.create({});
