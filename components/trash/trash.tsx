import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { forwardRef } from "react";
import { Stack } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import useGameStore from "@/stores/game.store";
import getCardDimension from "@/utils/getCardDimension";

const cardDimensions = getCardDimension();

const Trash = forwardRef((props, ref: any) => {
  const { cardsOnTrash } = useGameStore();
  return (
    <Stack
      height={cardDimensions.cardHeight}
      width={cardDimensions.cardWidth}
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
            fontSize: Dimensions.get("window").width * 0.04,
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
