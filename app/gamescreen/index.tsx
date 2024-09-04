import { StyleSheet } from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, Stack, Text, styled, View } from "tamagui";
import GameCard from "@/components/game-card/game-card";
import { Ionicons } from "@expo/vector-icons";
import useGameStore from "@/stores/game.store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { widths } from "@tamagui/config";
import { IBottomSlots, ITopSlots, TPos, TSlotPos } from "@/components/types";
import {
  initialBottomSlots,
  initialTopSlots,
} from "@/components/utils/slot-class";
import SafeAreaStyled from "@/components/gamescreen/safe-area.styled";
import CardSlotStyled from "@/components/gamescreen/card-slot.styled";
import { useRouter } from "expo-router";

/**
 
  Kartlar ilk dağıtılmaya başlandığında startingPos ve endingPos verilecek.
  İlk kartlar spawn olduğunda Starting noktası destenin pozisyonu olacak, ending ise en yakın boş slot olacak.
  -> Yaratılan Kart yerine geçme animasyonuna geçecek. Animasyon bitiminde. endingPos yeni startingPos olacak
   -> Seçilen Kart cardsInHand'den çıkarılacak ve cardsOnBoard'a aktarılacak
   -> Aktarılan kart en yakındaki boş slota gitmek için yeni position elemenları alaacak.
    -> EndingPos bu sefer boş olan slotun Pozisyonu olacak ve starting'den ending'e animasyon başlayacak

  5 lik Hand slotları ve Destenin posisyonları mapleme ve draw dan önce hesaplacanak.


  
  

  
 */

function startGame(
  drawCard: (startingPos: TPos, endingPos: TPos) => void,
  cardsInDeckCount: number,
  deckPosition: TPos,
  bottomSlotsPositions: IBottomSlots
) {
  if (cardsInDeckCount === 27) {
    let Secs = 100;
    for (let i = 1; i <= 5; i++) {
      setTimeout(() => {
        console.log(
          "bottomSlotsPositions[i as keyof typeof bottomSlotsPositions]",
          bottomSlotsPositions[i as keyof typeof bottomSlotsPositions]
        );
        drawCard(
          { ...deckPosition },
          { ...bottomSlotsPositions[i as keyof typeof bottomSlotsPositions] }
        );
      }, Secs * i);
    }
  }
}

const Index = () => {
  const router = useRouter();
  const [reset, setReset] = useState(false);
  const {
    cardsOnBoard,
    cardsInDeck,
    cardInHand,
    drawCard,
    populateDeck,
    setTopSlotsPositions,
    setBottomSlotsPositions,
    setThrashCanPosition,
  } = useGameStore();

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

  React.useEffect(() => {
    console.log("Reset!");
    if (
      topSlot1Ref?.current &&
      topSlot2Ref?.current &&
      topSlot3Ref?.current &&
      bottomSlot1Ref?.current &&
      bottomSlot2Ref?.current &&
      bottomSlot3Ref?.current &&
      bottomSlot4Ref?.current &&
      bottomSlot5Ref?.current &&
      deckPositionRef?.current &&
      thrashCanRef?.current
    ) {
      setTimeout(() => {
        let updatedTopSlots: ITopSlots = {
          1: { isActive: false, pageX: 0, pageY: 0 },
          2: { isActive: false, pageX: 0, pageY: 0 },
          3: { isActive: false, pageX: 0, pageY: 0 },
        };
        let updatedBottomSlots: IBottomSlots = {
          1: { isActive: false, pageX: 0, pageY: 0 },
          2: { isActive: false, pageX: 0, pageY: 0 },
          3: { isActive: false, pageX: 0, pageY: 0 },
          4: { isActive: false, pageX: 0, pageY: 0 },
          5: { isActive: false, pageX: 0, pageY: 0 },
        };

        topSlot1Ref.current.measure(
          (_x, _y, _w, _h, px: number, py: number) => {
            updatedTopSlots[1].pageX = px;
            updatedTopSlots[1].pageY = py;

            topSlot2Ref.current.measure(
              (_x, _y, _w, _h, px: number, py: number) => {
                updatedTopSlots[2].pageX = px;
                updatedTopSlots[2].pageY = py;

                topSlot3Ref.current.measure(
                  (_x, _y, _w, _h, px: number, py: number) => {
                    updatedTopSlots[3].pageX = px;
                    updatedTopSlots[3].pageY = py;

                    setTopSlotsPositions(updatedTopSlots);
                  }
                );
              }
            );
          }
        );

        bottomSlot1Ref.current.measure(
          (_x, _y, _w, _h, px: number, py: number) => {
            updatedBottomSlots[1].pageX = px;
            updatedBottomSlots[1].pageY = py;

            bottomSlot2Ref.current.measure(
              (_x, _y, _w, _h, px: number, py: number) => {
                updatedBottomSlots[2].pageX = px;
                updatedBottomSlots[2].pageY = py;

                bottomSlot3Ref.current.measure(
                  (_x, _y, _w, _h, px: number, py: number) => {
                    updatedBottomSlots[3].pageX = px;
                    updatedBottomSlots[3].pageY = py;

                    bottomSlot4Ref.current.measure(
                      (_x, _y, _w, _h, px: number, py: number) => {
                        updatedBottomSlots[4]!.pageX = px;
                        updatedBottomSlots[4]!.pageY = py;
                        bottomSlot5Ref.current.measure(
                          (_x, _y, _w, _h, px: number, py: number) => {
                            updatedBottomSlots[5]!.pageX = px;
                            updatedBottomSlots[5]!.pageY = py;

                            setBottomSlotsPositions(updatedBottomSlots);
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
          console.log("Px py", px, py);
          setDeckPosition({
            pageX: px,
            pageY: py,
          });
        });

        startGame(
          drawCard,
          cardsInDeck.length,
          deckPosition,
          updatedBottomSlots
        );
      }, 0);
    }
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
      {cardInHand.map((card) => (
        <GameCard key={card.id} card={card} deckPosition={deckPosition} />
      ))}
    </SafeAreaStyled>
  );
};

export default Index;
