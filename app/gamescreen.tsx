import { ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import React, { useRef, useState } from "react";
import { Stack, View, Image } from "tamagui";
import GameCard from "@/components/game-card/game-card";
import { Ionicons } from "@expo/vector-icons";
import useGameStore from "@/stores/game.store";
import { ArraySlots, TSlotPos } from "@/components/types";
import { GameSlot } from "@/utils/slot-class";
import SafeAreaStyled from "@/components/gamescreen/safe-area.styled";
import Styled from "@/components/gamescreen/card-slots.styled";
import { useRouter } from "expo-router";
import { randomUUID } from "expo-crypto";
import RenderCards from "@/components/render-cards/render-cards";
import Deck from "@/components/deck/deck";
import Trash from "@/components/trash/trash";
import HomeOptions from "@/components/modals/options/options";
import GameScore from "@/components/gamescore/gamescore";

const Index = () => {
  const [optionsVisible, setOptionsVisible] = useState(false);
  const router = useRouter();
  const {
    setGamePhase,
    setTopSlotsPositions,
    setBottomSlotsPositions,
    setThrashCanPosition,
    setDeckPosition,
    populateDeck,
    gamePhase,
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

    if (gamePhase == 0) measureAll();
  }, []);

  function handleNavigation(type: "home" | "restart") {
    if (type == "home") {
      router.navigate("/");
      populateDeck();
      setGamePhase(0);
    }
    if (type == "restart") {
      setOptionsVisible(false);
      populateDeck();
      setGamePhase(1);
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/gameboard-background/CostimizedBg2.png")}
        resizeMode="stretch"
        style={styles.image}
      >
        <HomeOptions
          visible={optionsVisible}
          handleNavigation={handleNavigation}
          onClose={() => setOptionsVisible(false)}
        />
        <SafeAreaStyled>
          <GameScore />
          <Stack flexDirection="row" justifyContent="space-around">
            <Stack
              backgroundColor="transparent"
              height="$4"
              width="$2"
              justifyContent="center"
              alignItems="center"
              marginHorizontal="$4"
            ></Stack>
            <Stack
              flexDirection="row"
              justifyContent="center"
              flex={1}
              gap="$4"
            >
              <Styled.BoardSlotStyled
                slotNumber={0}
                ref={topSlot1Ref}
              ></Styled.BoardSlotStyled>
              <Styled.BoardSlotStyled
                slotNumber={1}
                ref={topSlot2Ref}
              ></Styled.BoardSlotStyled>
              <Styled.BoardSlotStyled
                slotNumber={2}
                ref={topSlot3Ref}
              ></Styled.BoardSlotStyled>
            </Stack>
            <Stack>
              <Stack
                borderRadius="$4"
                justifyContent="center"
                alignItems="center"
                margin="$2"
              >
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    console.log("Test");
                    setOptionsVisible(true);
                  }}
                >
                  <Image
                    height="$4"
                    width="$4"
                    resizeMethod="auto"
                    source={require("@/assets/icons/settings.png")}
                  />
                </TouchableOpacity>
              </Stack>
            </Stack>
          </Stack>
          <Stack flex={1} flexDirection="row">
            <Deck ref={deckPositionRef} />
            <Stack
              flex={1}
              flexDirection="row"
              justifyContent="center"
              gap="$2"
              alignItems="flex-end"
            >
              <Styled.CardSlotStyled
                ref={bottomSlot1Ref}
              ></Styled.CardSlotStyled>
              <Styled.CardSlotStyled
                ref={bottomSlot2Ref}
              ></Styled.CardSlotStyled>
              <Styled.CardSlotStyled
                ref={bottomSlot3Ref}
              ></Styled.CardSlotStyled>
              <Styled.CardSlotStyled
                ref={bottomSlot4Ref}
              ></Styled.CardSlotStyled>
              <Styled.CardSlotStyled
                ref={bottomSlot5Ref}
              ></Styled.CardSlotStyled>
            </Stack>
            <Trash ref={thrashCanRef} />
          </Stack>
          <RenderCards />
        </SafeAreaStyled>
      </ImageBackground>
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 42,
    lineHeight: 84,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000c0",
  },
});

export default Index;
