import { StyleSheet, Text, View } from "react-native";
import React, { forwardRef } from "react";
import { Stack } from "tamagui";
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
  console.log("");
  return (
    <Stack
      ref={ref}
      height={"$11"}
      width={"$8"}
      backgroundColor={"$deckColor"}
      borderRadius={"$2"}
      alignSelf="flex-end"
      margin="$4"
    >
      <TouchableOpacity
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
        }}
        onPress={() => {
          console.log("Deck cardsInHand.length", cardsInHand.length);
          console.log("Deck cardsOnBoard.length", cardsOnBoard.length);

          const totalCardOnGame = cardsInHand.length + cardsOnBoard.length;
          if (totalCardOnGame == 5 || cardsInDeck.length === 0) return;

          const findFirstBottomEmptySlot = bottomSlotPositions.find(
            (slot) => !slot.isActive
          );
          if (findFirstBottomEmptySlot) drawCard(findFirstBottomEmptySlot);
        }}
      >
        <Text>{cardsInDeck.length}</Text>
      </TouchableOpacity>
    </Stack>
  );
});

export default Deck;
