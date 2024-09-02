import { StyleSheet } from "react-native";
import React, { useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, Stack, Text, styled, View } from "tamagui";
import GameCard from "@/components/game-card/game-card";
import { Ionicons } from "@expo/vector-icons";
import useGameStore from "@/stores/game.store";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const StyledSafeAreaView = styled(SafeAreaView, {
  backgroundColor: "#efefef",
  padding: 12,
  flex: 1,
});

const CardSlot = styled(View, {
  minWidth: "$8",
  minHeight: "$11",
  borderColor: "$red9",
  padding: 1,
  backgroundColor: "$gray9",
  borderRadius: 4,
  alignItems: "center",
  justifyContent: "center",
  borderWidth: 3,
});

const Index = () => {
  const { cardsOnBoard, cardsInDeck, cardInHand, drawCard, playCard } =
    useGameStore();
  const slot1Ref = useRef(null);
  const slot2Ref = useRef(null);
  const slot3Ref = useRef(null);

  React.useEffect(() => {
    if (cardsInDeck.length === 27) {
      drawCard();
      let Secs = 100;
      for (let i = 1; i <= 5; i++) {
        setTimeout(() => {
          drawCard();
        }, Secs * i);
      }
    }
  }, []);

  /*
  Kart'a tıklandığında gideceği slotun posizyonuna doğru kayar, 
  Oynanan kart geri alınamaz ancak silinebilir

*/

  console.log("cardsOnBoard", cardsOnBoard);

  return (
    <GestureHandlerRootView>
      <StyledSafeAreaView>
        <Stack
          flexDirection="row"
          justifyContent="space-around"
          borderWidth={1}
        >
          <Stack
            backgroundColor="$yellow10"
            height="$4"
            width="$8"
            borderRadius="$4"
            justifyContent="center"
            alignItems="center"
            marginHorizontal="$4"
          >
            <Text color="white">200</Text>
          </Stack>

          <Stack flexDirection="row" justifyContent="center" flex={1} gap="$4">
            <CardSlot ref={slot1Ref}></CardSlot>
            <CardSlot ref={slot2Ref}></CardSlot>
            <CardSlot ref={slot3Ref}></CardSlot>
          </Stack>

          <Stack
            backgroundColor="$red10"
            height="$4"
            width="$8"
            borderRadius="$4"
            justifyContent="center"
            alignItems="center"
            marginHorizontal="$4"
          >
            <Text color="white">Exit</Text>
          </Stack>
        </Stack>

        <Stack flex={1} borderWidth={1} flexDirection="row">
          <Stack
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
            {cardInHand?.map((card) => (
              <GameCard
                slotPositions={{
                  slot1: slot1Ref.current,
                  slot2: slot2Ref.current,
                  slot3: slot3Ref.current,
                }}
                playCard={playCard}
                key={card.id}
                id={card.id}
                cardColor={card.color}
                number={card.value}
              />
            ))}
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
          >
            <Ionicons name="trash" size={52} />
          </Stack>
        </Stack>
      </StyledSafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Index;
