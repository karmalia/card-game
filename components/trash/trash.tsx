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
    <Stack alignContent="center" justifyContent="center" gap={"$3"}>
      <Text
        style={{
          color: "white",
          fontFamily: "DragonSlayer",
          letterSpacing: 4,
          fontSize: 18,
          textAlign: "center",
        }}
      >
        DISCARD
      </Text>

      <Stack
        backgroundColor={"transparent"}
        ref={ref}
        width={cardDimensions.cardWidth}
        height={cardDimensions.cardHeight}
        padding={0}
        borderRadius={0}
      >
        <ImageBackground
          source={require("@/assets/card-backgrounds/TrashCardOpacity.png")}
          resizeMode="stretch"
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
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
      </Stack>
    </Stack>
  );
});

export default Trash;

const styles = StyleSheet.create({});
