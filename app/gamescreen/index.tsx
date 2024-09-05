import { StyleSheet } from "react-native";
import React, { useRef, useState } from "react";
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
import {
  GameSlot,
  initialBottomSlots,
  initialTopSlots,
} from "@/components/utils/slot-class";
import SafeAreaStyled from "@/components/gamescreen/safe-area.styled";
import CardSlotStyled from "@/components/gamescreen/card-slot.styled";
import { useRouter } from "expo-router";
import { randomUUID } from "expo-crypto";

/**
 
  Kartlar ilk dağıtılmaya başlandığında startingPos ve endingPos verilecek.
  İlk kartlar spawn olduğunda Starting noktası destenin pozisyonu olacak, ending ise en yakın boş slot olacak.
  -> Yaratılan Kart yerine geçme animasyonuna geçecek. Animasyon bitiminde. endingPos yeni startingPos olacak
   -> Seçilen Kart cardsInHand'den çıkarılacak ve cardsOnBoard'a aktarılacak
   -> Aktarılan kart en yakındaki boş slota gitmek için yeni position elemenları alaacak.
    -> EndingPos bu sefer boş olan slotun Pozisyonu olacak ve starting'den ending'e animasyon başlayacak

  5 lik Hand slotları ve Destenin posisyonları mapleme ve draw dan önce hesaplacanak.


  
  

  
 */

function startGame(drawCard: () => void, cardsInDeckCount: number) {
  if (cardsInDeckCount === 27) {
    let Secs = 100;
    for (let i = 0; i <= 4; i++) {
      setTimeout(() => {
        drawCard();
      }, Secs * i);
    }
  }
}

const Index = () => {
  const router = useRouter();
  const [reset, setReset] = useState(false);
  const {
    cardsOnBoard,
    gamePhase,
    cardsInDeck,
    cardInHand,
    cardsOnGame,
    bottomSlotPositions,
    topSlotPositions,
    setGamePhase,
    drawCard,
    populateDeck,
    setTopSlotsPositions,
    setBottomSlotsPositions,
    setThrashCanPosition,
  } = useGameStore();

  console.log(
    "GameScreenRendered!",
    bottomSlotPositions.map((slot) => !slot.isActive)
  );

  const [deckPosition, setDeckPosition] = React.useState({
    pageX: 0,
    pageY: 0,
  });

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

*/

  React.useLayoutEffect(() => {
    console.log("Reset!");

    setTimeout(() => {
      topSlot1Ref.current.measure((_x, _y, _w, _h, px: number, py: number) => {
        const Slot1 = new GameSlot(randomUUID(), false, px, py);

        topSlot2Ref.current.measure(
          (_x, _y, _w, _h, px: number, py: number) => {
            const Slot2 = new GameSlot(randomUUID(), false, px, py);

            topSlot3Ref.current.measure(
              (_x, _y, _w, _h, px: number, py: number) => {
                const Slot3 = new GameSlot(randomUUID(), false, px, py);

                setTopSlotsPositions([Slot1, Slot2, Slot3]);
              }
            );
          }
        );
      });

      bottomSlot1Ref.current.measure(
        (_x, _y, _w, _h, px: number, py: number) => {
          const Slot1 = new GameSlot(randomUUID(), true, px, py);

          bottomSlot2Ref.current.measure(
            (_x, _y, _w, _h, px: number, py: number) => {
              const Slot2 = new GameSlot(randomUUID(), true, px, py);

              bottomSlot3Ref.current.measure(
                (_x, _y, _w, _h, px: number, py: number) => {
                  const Slot3 = new GameSlot(randomUUID(), true, px, py);

                  bottomSlot4Ref.current.measure(
                    (_x, _y, _w, _h, px: number, py: number) => {
                      const Slot4 = new GameSlot(randomUUID(), true, px, py);
                      bottomSlot5Ref.current.measure(
                        (_x, _y, _w, _h, px: number, py: number) => {
                          const Slot5 = new GameSlot(
                            randomUUID(),
                            true,
                            px,
                            py
                          );

                          setBottomSlotsPositions([
                            Slot1,
                            Slot2,
                            Slot3,
                            Slot4,
                            Slot5,
                          ]);
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
      thrashCanRef.current.measure((_x, _y, _w, _h, px, py) =>
        setThrashCanPosition({ pageX: px, pageY: py })
      );

      deckPositionRef.current.measure((_x, _y, _w, _h, px, py) => {
        setDeckPosition({
          pageX: px,
          pageY: py,
        });
      });
    }, 0);
  }, []);

  React.useEffect(() => {
    if (bottomSlotPositions.length > 0) {
      setGamePhase(1);
      startGame(drawCard, cardsInDeck.length);
    }
  }, [bottomSlotPositions.length]);

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
            200
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
        <Stack
          ref={deckPositionRef}
          height={"$11"}
          width={"$8"}
          backgroundColor={"$deckColor"}
          borderRadius={"$2"}
          alignSelf="flex-end"
          margin="$4"
          alignItems="center"
          justifyContent="center"
        >
          <Text>{cardsInDeck.length}</Text>
        </Stack>
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
      {gamePhase === 1 &&
        cardsOnGame.map((card, index) => {
          console.log("Phase 1");
          return (
            <GameCard
              key={card.id}
              card={card}
              startingPosition={deckPosition}
              endingPosition={bottomSlotPositions[index]}
              bottomSlotPositions={bottomSlotPositions}
              topSlotPositions={topSlotPositions}
              firstTopEmptySlot={
                topSlotPositions.find((slot) => !slot.isActive) || null
              }
              firstBottomEmptySlot={
                bottomSlotPositions.find((slot) => !slot.isActive) || null
              }
              gamePhase={gamePhase}
            />
          );
        })}
      {gamePhase === 2 &&
        cardsOnGame.map((card, index) => {
          return (
            <GameCard
              key={card.id}
              card={card}
              startingPosition={bottomSlotPositions[index]}
              endingPosition={null}
              bottomSlotPositions={bottomSlotPositions}
              topSlotPositions={topSlotPositions}
              firstTopEmptySlot={
                topSlotPositions.find((slot) => !slot.isActive) || null
              }
              firstBottomEmptySlot={
                bottomSlotPositions.find((slot) => !slot.isActive) || null
              }
              gamePhase={gamePhase}
            />
          );
        })}
    </SafeAreaStyled>
  );
};

export default Index;
