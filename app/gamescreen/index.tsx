import { StyleSheet, TouchableOpacity } from "react-native";
import React, { useMemo, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, Stack, Text, styled, View } from "tamagui";
import GameCard from "@/components/game-card/game-card";
import { Ionicons } from "@expo/vector-icons";
import useGameStore from "@/stores/game.store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { widths } from "@tamagui/config";
import {
  ArraySlots,
  IBottomSlots,
  ITopSlots,
  TPos,
  TSlotPos,
} from "@/components/types";
import { GameSlot } from "@/components/utils/slot-class";
import SafeAreaStyled from "@/components/gamescreen/safe-area.styled";
import CardSlotStyled from "@/components/gamescreen/card-slot.styled";
import { useRouter } from "expo-router";
import { randomUUID } from "expo-crypto";
import { fillPlayersHand } from "@/components/utils";
import RenderCards from "@/components/render-cards/render-cards";
import Deck from "@/components/deck/deck";

/**
 
  her kartın bir slot id si olacak. ve ona bağlı olacak
  böylece kartlar hep aynı slota geri dönebilecek
  draw card yapıldığında. eldeki kart sayısına göre bottomSlotda 
  en yakın olana aktarılacak. Aktarıldığı slotun datası da verilecek

 */

const Index = () => {
  const router = useRouter();
  const [reset, setReset] = useState(false);
  const {
    gamePhase,
    cardsInDeck,
    bottomSlotPositions,
    score,
    setGamePhase,
    drawCard,
    populateDeck,
    setTopSlotsPositions,
    setBottomSlotsPositions,
    setThrashCanPosition,
    setDeckPosition,
  } = useGameStore();

  // For Top Slots
  const topSlot1Ref = useRef<any>(null);
  const topSlot2Ref = useRef<any>(null);
  const topSlot3Ref = useRef<any>(null);

  // For Bottom Slots
  const bottomSlot1Ref = useRef<any>(null);
  const bottomSlot2Ref = useRef<any>(null);
  const bottomSlot3Ref = useRef<any>(null);
  const bottomSlot4Ref = useRef<any>(null);
  const bottomSlot5Ref = useRef<any>(null);

  // ThrashCan Pos
  const thrashCanRef = useRef<any>(null);

  //Deck Position
  const deckPositionRef = useRef<any>(null);

  /*
  Kart'a tıklandığında gideceği slotun posizyonuna doğru kayar, 
  Oynanan kart geri alınamaz ancak silinebilir

  Her silme ve tamamlama işleminde boş olan slotlar bulunmalı.

*/

  React.useLayoutEffect(() => {
    const measureTopSlots = () => {
      return Promise.all([
        new Promise((resolve) =>
          topSlot1Ref.current.measure((_x, _y, _w, _h, px, py) =>
            resolve(new GameSlot(randomUUID(), false, px, py))
          )
        ),
        new Promise((resolve) =>
          topSlot2Ref.current.measure((_x, _y, _w, _h, px, py) =>
            resolve(new GameSlot(randomUUID(), false, px, py))
          )
        ),
        new Promise((resolve) =>
          topSlot3Ref.current.measure((_x, _y, _w, _h, px, py) =>
            resolve(new GameSlot(randomUUID(), false, px, py))
          )
        ),
      ]);
    };

    const measureBottomSlots = () => {
      return Promise.all([
        new Promise((resolve) =>
          bottomSlot1Ref.current.measure((_x, _y, _w, _h, px, py) =>
            resolve(new GameSlot(randomUUID(), true, px, py))
          )
        ),
        new Promise((resolve) =>
          bottomSlot2Ref.current.measure((_x, _y, _w, _h, px, py) =>
            resolve(new GameSlot(randomUUID(), true, px, py))
          )
        ),
        new Promise((resolve) =>
          bottomSlot3Ref.current.measure((_x, _y, _w, _h, px, py) =>
            resolve(new GameSlot(randomUUID(), true, px, py))
          )
        ),
        new Promise((resolve) =>
          bottomSlot4Ref.current.measure((_x, _y, _w, _h, px, py) =>
            resolve(new GameSlot(randomUUID(), true, px, py))
          )
        ),
        new Promise((resolve) =>
          bottomSlot5Ref.current.measure((_x, _y, _w, _h, px, py) =>
            resolve(new GameSlot(randomUUID(), true, px, py))
          )
        ),
      ]);
    };

    const measureAll = async () => {
      // Ensure the layout is complete
      await new Promise((resolve) => requestAnimationFrame(resolve));

      const deckPosPromise = new Promise((resolve) =>
        deckPositionRef.current.measure((_x, _y, _w, _h, px, py) => {
          resolve({ pageX: px, pageY: py });
        })
      );

      const thrashCanPromise = new Promise((resolve) =>
        thrashCanRef.current.measure((_x, _y, _w, _h, px, py) => {
          resolve({ pageX: px, pageY: py });
        })
      );

      const [topSlots, bottomSlots, deckPosition, thrashCanPos] =
        await Promise.all([
          measureTopSlots(),
          measureBottomSlots(),
          deckPosPromise,
          thrashCanPromise,
        ]);

      setTopSlotsPositions(topSlots as ArraySlots);
      setBottomSlotsPositions(bottomSlots as ArraySlots);
      setDeckPosition(deckPosition as TSlotPos);
      setThrashCanPosition(thrashCanPos as TSlotPos);

      // After everything is set, change the game phase
      setGamePhase(1);
    };

    measureAll();
  }, [reset]);

  return (
    <SafeAreaStyled>
      <Stack flexDirection="row" justifyContent="space-around" borderWidth={1}>
        <Stack
          backgroundColor="$yellow10"
          height="$4"
          width="$8"
          borderRadius="$4"
          justifyContent="center"
          alignItems="center"
          marginHorizontal="$4"
        >
          <Button
            backgroundColor={"$yellow10"}
            color="white"
            onPress={() => {
              setReset(!reset);
              populateDeck();
            }}
            width={"100%"}
          >
            <Text>{score}</Text>
          </Button>
        </Stack>
        <Stack flexDirection="row" justifyContent="center" flex={1} gap="$4">
          <CardSlotStyled ref={topSlot1Ref}></CardSlotStyled>
          <CardSlotStyled ref={topSlot2Ref}></CardSlotStyled>
          <CardSlotStyled ref={topSlot3Ref}></CardSlotStyled>
        </Stack>
        <Stack>
          <Stack
            backgroundColor="$red10"
            height="$4"
            width="$8"
            borderRadius="$4"
            justifyContent="center"
            alignItems="center"
            marginHorizontal="$4"
            onPress={() => router.navigate("/login")}
          >
            <Text color="white">Exit</Text>
          </Stack>
        </Stack>
      </Stack>
      <Stack flex={1} borderWidth={1} flexDirection="row">
        <Deck ref={deckPositionRef} />
        <Stack
          flex={1}
          flexDirection="row"
          justifyContent="center"
          gap="$2"
          alignItems="flex-end"
        >
          <CardSlotStyled ref={bottomSlot1Ref}></CardSlotStyled>
          <CardSlotStyled ref={bottomSlot2Ref}></CardSlotStyled>
          <CardSlotStyled ref={bottomSlot3Ref}></CardSlotStyled>
          <CardSlotStyled ref={bottomSlot4Ref}></CardSlotStyled>
          <CardSlotStyled ref={bottomSlot5Ref}></CardSlotStyled>
        </Stack>
        <Stack
          height={"$11"}
          width={"$8"}
          borderWidth="$1"
          borderRadius={"$2"}
          margin="$4"
          alignSelf="flex-end"
          alignItems="center"
          justifyContent="center"
          ref={thrashCanRef}
        >
          <Ionicons name="trash" size={52} />
        </Stack>
      </Stack>
      <RenderCards />
    </SafeAreaStyled>
  );
};

export default Index;
