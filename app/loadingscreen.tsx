import { ActivityIndicator, StyleSheet } from "react-native";
import React, { useEffect, useRef } from "react";
import { Stack, View, Text } from "tamagui";
import { useRouter } from "expo-router";
import useGameStore from "@/stores/game.store";
import { ArraySlots, TSlotPos } from "@/components/types";
import { GameSlot } from "@/utils/slot-class";
import { randomUUID } from "expo-crypto";
import AnimatedGameBackground from "@/components/backgrounds/GameBackground";
import {
  TopLeft,
  TopRight,
  BottomLeft,
  BottomRight,
} from "@/components/skia-components/corners";
import SafeAreaStyled from "@/components/gamescreen/safe-area.styled";
import Deck from "@/components/deck/deck";
import Styled from "@/components/gamescreen/card-slots.styled";
import Trash from "@/components/trash/trash";
const LoadingScreen = () => {
  const router = useRouter();
  const {
    setTopSlotsPositions,
    setBottomSlotsPositions,
    setThrashCanPosition,
    setDeckPosition,
    setGamePhase,
  } = useGameStore();

  // Refs for measuring
  const topSlot1Ref = useRef<any>(null);
  const topSlot2Ref = useRef<any>(null);
  const topSlot3Ref = useRef<any>(null);
  const bottomSlot1Ref = useRef<any>(null);
  const bottomSlot2Ref = useRef<any>(null);
  const bottomSlot3Ref = useRef<any>(null);
  const bottomSlot4Ref = useRef<any>(null);
  const bottomSlot5Ref = useRef<any>(null);
  const thrashCanRef = useRef<any>(null);
  const deckPositionRef = useRef<any>(null);

  // Measurement functions
  const measureTopSlots = () => {
    return Promise.all([
      new Promise((resolve) =>
        topSlot1Ref.current.measure(
          (_x: any, _y: any, _w: any, _h: any, px: any, py: any) =>
            resolve(new GameSlot(randomUUID(), false, px, py))
        )
      ),
      new Promise((resolve) =>
        topSlot2Ref.current.measure(
          (_x: any, _y: any, _w: any, _h: any, px: any, py: any) =>
            resolve(new GameSlot(randomUUID(), false, px, py))
        )
      ),
      new Promise((resolve) =>
        topSlot3Ref.current.measure(
          (_x: any, _y: any, _w: any, _h: any, px: any, py: any) =>
            resolve(new GameSlot(randomUUID(), false, px, py))
        )
      ),
    ]);
  };

  const measureBottomSlots = () => {
    return Promise.all([
      new Promise((resolve) =>
        bottomSlot1Ref.current.measure(
          (_x: any, _y: any, _w: any, _h: any, px: any, py: any) =>
            resolve(new GameSlot(randomUUID(), true, px, py))
        )
      ),
      new Promise((resolve) =>
        bottomSlot2Ref.current.measure(
          (_x: any, _y: any, _w: any, _h: any, px: any, py: any) =>
            resolve(new GameSlot(randomUUID(), true, px, py))
        )
      ),
      new Promise((resolve) =>
        bottomSlot3Ref.current.measure(
          (_x: any, _y: any, _w: any, _h: any, px: any, py: any) =>
            resolve(new GameSlot(randomUUID(), true, px, py))
        )
      ),
      new Promise((resolve) =>
        bottomSlot4Ref.current.measure(
          (_x: any, _y: any, _w: any, _h: any, px: any, py: any) =>
            resolve(new GameSlot(randomUUID(), true, px, py))
        )
      ),
      new Promise((resolve) =>
        bottomSlot5Ref.current.measure(
          (_x: any, _y: any, _w: any, _h: any, px: any, py: any) =>
            resolve(new GameSlot(randomUUID(), true, px, py))
        )
      ),
    ]);
  };

  useEffect(() => {
    const measureAll = async () => {
      // Add a small delay to ensure layout is fully rendered
      await new Promise((resolve) => setTimeout(resolve, 300));

      const deckPosPromise = new Promise((resolve) =>
        deckPositionRef.current.measure(
          (_x: any, _y: any, _w: any, _h: any, px: any, py: any) => {
            resolve({ pageX: px, pageY: py });
          }
        )
      );

      const thrashCanPromise = new Promise((resolve) =>
        thrashCanRef.current.measure(
          (_x: any, _y: any, _w: any, _h: any, px: any, py: any) => {
            resolve({ pageX: px, pageY: py });
          }
        )
      );

      const [topSlots, bottomSlots, deckPosition, thrashCanPos] =
        await Promise.all([
          measureTopSlots(),
          measureBottomSlots(),
          deckPosPromise,
          thrashCanPromise,
        ]);

      // Store all measurements in the global state
      setTopSlotsPositions(topSlots as ArraySlots);
      setBottomSlotsPositions(bottomSlots as ArraySlots);
      setDeckPosition(deckPosition as TSlotPos);
      setThrashCanPosition(thrashCanPos as TSlotPos);

      // Set game phase ready for actual gameplay
      setGamePhase(1);

      // Navigate to the game screen after all measurements are done
      router.replace("/gamescreen");
    };

    measureAll();
  }, []);

  return (
    <View style={styles.container}>
      <AnimatedGameBackground />

      {/* Loading indicator and message */}
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>PREPARING GAME</Text>
        <ActivityIndicator size="large" color="#ffffff" />

        {/* Add corners to the loading container */}
        <TopLeft size={20} variant="edged" color="white" strokeWidth={2} />
        <TopRight size={20} variant="edged" color="white" strokeWidth={2} />
        <BottomLeft size={20} variant="edged" color="white" strokeWidth={2} />
        <BottomRight size={20} variant="edged" color="white" strokeWidth={2} />
      </View>

      {/* Hidden elements for measurement */}
      <SafeAreaStyled position="absolute" top={0} left={0} right={0} bottom={0}>
        <Stack flexDirection="row" justifyContent="space-around">
          <Stack flexDirection="row" justifyContent="center" flex={1} gap="$4">
            <Styled.BoardSlotStyled
              ref={topSlot1Ref}
              slotNumber={0}
            ></Styled.BoardSlotStyled>
            <Styled.BoardSlotStyled
              ref={topSlot2Ref}
              slotNumber={1}
            ></Styled.BoardSlotStyled>
            <Styled.BoardSlotStyled
              ref={topSlot3Ref}
              slotNumber={2}
            ></Styled.BoardSlotStyled>
          </Stack>
        </Stack>
        <Stack
          flex={1}
          flexDirection="row"
          justifyContent="space-around"
          paddingHorizontal="$4"
        >
          <Deck ref={deckPositionRef} />
          <Stack
            flex={1}
            flexDirection="row"
            justifyContent="center"
            gap="$4"
            alignItems="flex-end"
          >
            <Styled.CardSlotStyled ref={bottomSlot1Ref}></Styled.CardSlotStyled>
            <Styled.CardSlotStyled ref={bottomSlot2Ref}></Styled.CardSlotStyled>
            <Styled.CardSlotStyled ref={bottomSlot3Ref}></Styled.CardSlotStyled>
            <Styled.CardSlotStyled ref={bottomSlot4Ref}></Styled.CardSlotStyled>
            <Styled.CardSlotStyled ref={bottomSlot5Ref}></Styled.CardSlotStyled>
          </Stack>
          <Trash ref={thrashCanRef} />
        </Stack>
      </SafeAreaStyled>
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  hiddenContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0,
  },
  slotPlaceholder: {
    width: 80,
    height: 120,
  },
  loadingContainer: {
    padding: 20,
    backgroundColor: "rgba(0,0,20,0.8)",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    width: 250,
    height: 120,
  },
  loadingText: {
    color: "white",
    fontSize: 18,
    fontFamily: "TrenchThin",
    letterSpacing: 2,
    marginBottom: 20,
  },
});

export default LoadingScreen;
