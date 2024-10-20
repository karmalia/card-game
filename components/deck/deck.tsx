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
      borderRadius={"$2"}
      alignSelf="flex-end"
      margin="$4"
      position="relative"
    >
      <ImageBackground
        source={require("@/assets/card-backgrounds/TrashCardOpacity.png")}
        resizeMode="stretch"
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
      <Stack
        width={"$8"}
        padding="$2"
        position="absolute"
        top={-35}
        left="0%"
        alignItems="center"
        justifyContent="center"
        backgroundColor="transparent"
      >
        <Text
          style={{
            color: "white",
            fontFamily: "DragonSlayer",
            letterSpacing: 4,
            fontSize: 18,
          }}
        >
          DECK
        </Text>
      </Stack>
    </Stack>
  );
});

export default Deck;
