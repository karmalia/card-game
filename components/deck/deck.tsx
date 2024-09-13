import { ImageBackground, StyleSheet, Text, View } from "react-native";
import React, { forwardRef } from "react";
import { Button, Stack } from "tamagui";
import { TouchableOpacity } from "react-native-gesture-handler";
import useGameStore from "@/stores/game.store";

type Props = {};

const Deck = forwardRef((props: Props, ref: any) => {
  const {
    drawCard,
    cardsInDeck,
    bottomSlotPositions,
    cardsInHand,
    cardsOnBoard,
  } = useGameStore();
  return (
    <Stack
      ref={ref}
      height={"$11"}
      width={"$8"}
      backgroundColor={"$deckColor"}
      borderRadius={"$2"}
      alignSelf="flex-end"
      margin="$4"
      overflow="hidden"
    >
      <ImageBackground
        source={require("@/assets/card-backgrounds/CostimizedGreen.png")}
      >
        <Button
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent",
            borderWidth: 1,
          }}
          onPress={() => {
            const totalCardOnGame = cardsInHand.length + cardsOnBoard.length;
            if (totalCardOnGame == 5 || cardsInDeck.length === 0) return;

            const findFirstBottomEmptySlot = bottomSlotPositions.find(
              (slot) => !slot.isActive
            );
            if (findFirstBottomEmptySlot) drawCard(findFirstBottomEmptySlot);
          }}
        >
          <Text
            style={{
              fontFamily: "DragonSlayer",
              color: "white",
              fontSize: 28,
            }}
          >
            {cardsInDeck.length}
          </Text>
        </Button>
      </ImageBackground>
    </Stack>
  );
});

export default Deck;
