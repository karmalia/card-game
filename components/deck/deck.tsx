import { ImageBackground, StyleSheet, Text, View } from "react-native";
import React, { forwardRef, useState } from "react";
import { Button, Image, Stack } from "tamagui";
import { TouchableOpacity } from "react-native-gesture-handler";
import useGameStore from "@/stores/game.store";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";
import usePlaySound from "@/hooks/usePlaySound";

const Deck = forwardRef((props: Props, ref: any) => {
  const { playDraw } = usePlaySound();
  const {
    drawCard,
    cardsInDeck,

    cardsInHand,
    cardsOnBoard,
    removeFromBoard,
  } = useGameStore();
  //RemoveFromBoard yapıldığında bile stale data bottomSlots kullanıyor.
  //RemoveFromBaord yapıldığında findFirstBottomEmptySlot must be find the latest state.

  const handleDraw = () => {
    const totalCardOnGame = cardsInHand.length + cardsOnBoard.length;

    //Eğer adam draw yaptığında boardda kart varsa ilk önnce boarddaki kartlar yerine döner, sonra kart çekilir

    if (totalCardOnGame == 5 || cardsInDeck.length === 0) return;

    //Burada retreat action yapılacak.

    if (cardsOnBoard.length > 0) {
      cardsOnBoard.forEach((card) => removeFromBoard(card));
    }

    const updatedBottomSlotPositions =
      useGameStore.getState().bottomSlotPositions;

    const findFirstBottomEmptySlot = updatedBottomSlotPositions.find(
      (slot) => !slot.isActive
    );
    console.log(
      "updatedBottomSlotPositions",
      updatedBottomSlotPositions.map((c) => c.isActive)
    );
    if (findFirstBottomEmptySlot) {
      drawCard(findFirstBottomEmptySlot);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      playDraw();
    }
  };

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
          onPress={handleDraw}
        >
          <Text
            style={{
              fontFamily: "DragonSlayer",
              color: "white",
              fontSize: 28,
            }}
          >
            {useGameStore.getState().cardsInDeck.length}
          </Text>
        </Button>
      </ImageBackground>
      {Array.from({ length: 4 })
        .fill(0)
        .map((_, index) => (
          <View
            style={{
              position: "absolute",
              height: "100%",
              width: "100%",

              backgroundColor: "rgba(0,0,0,0.4)",
              top: index,
              left: index,
              zIndex: -1,
            }}
          />
        ))}
    </Stack>
  );
});

export default Deck;
