import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { forwardRef } from "react";
import { Stack } from "tamagui";
import useGameStore from "@/stores/game.store";
import getCardDimension from "@/utils/getCardDimension";
import {
  TopLeft,
  TopRight,
  BottomLeft,
  BottomRight,
} from "@/components/skia-components/corners";

const cardDimensions = getCardDimension();

const Trash = forwardRef((props, ref: any) => {
  const { cardsOnTrash } = useGameStore();
  return (
    <Stack alignContent="center" justifyContent="center" gap={"$3"}>
      <Text
        style={{
          color: "white",
          fontFamily: "TrenchThin",
          letterSpacing: 4,
          fontSize: 18,
          textAlign: "center",
        }}
      >
        DISCARD
      </Text>

      <Stack
        backgroundColor={"rgba(0,0,0,0.5)"}
        ref={ref}
        width={cardDimensions.cardWidth}
        height={cardDimensions.cardHeight}
        padding={0}
        borderRadius={0}
        position="relative"
        justifyContent="center"
        alignItems="center"
        // Remove flex={1} - this is causing the size difference
      >
        <Text
          style={{
            fontFamily: "TrenchThin",
            color: "white",
            fontSize: Dimensions.get("window").width * 0.04,
          }}
        >
          {cardsOnTrash.length}
        </Text>

        {/* Add box corners */}
        <TopLeft size={16} variant="edged" color="white" strokeWidth={2} />
        <TopRight size={16} variant="edged" color="white" strokeWidth={2} />
        <BottomLeft size={16} variant="edged" color="white" strokeWidth={2} />
        <BottomRight size={16} variant="edged" color="white" strokeWidth={2} />
      </Stack>
    </Stack>
  );
});

export default Trash;

const styles = StyleSheet.create({});
