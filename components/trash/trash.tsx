import { ImageBackground, StyleSheet, Text, View } from "react-native";
import React, { forwardRef } from "react";
import { Stack } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import useGameStore from "@/stores/game.store";

type Props = {};

const Trash = forwardRef((props: Props, ref: any) => {
  const { cardsOnTrash } = useGameStore();
  return (
    <Stack
      height={"$11"}
      width={"$8"}
      borderWidth="$1"
      borderRadius={"$2"}
      margin="$4"
      alignSelf="flex-end"
      alignItems="center"
      justifyContent="center"
      ref={ref!}
    >
      <ImageBackground
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
        source={require("@/assets/card-backgrounds/TrashCardOpacity.png")}
      >
        <Text
          style={{
            fontFamily: "DragonSlayer",
            color: "white",
            fontSize: 28,
          }}
        >
          {cardsOnTrash.length}
        </Text>
      </ImageBackground>
      <Stack
        width={"$8"}
        padding="$2"
        position="absolute"
        top={-35}
        left="0%"
        alignItems="center"
        justifyContent="center"
      >
        <Text
          style={{
            color: "white",
            fontFamily: "DragonSlayer",
            letterSpacing: 2,
            fontSize: 16,
            width: "100%",
          }}
        >
          DISCARD
        </Text>
      </Stack>
    </Stack>
  );
});

export default Trash;

const styles = StyleSheet.create({});
