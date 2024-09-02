import { StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, Stack, Text, styled, View } from "tamagui";
import GameCard from "@/components/game-card/game-card";
import { Ionicons } from "@expo/vector-icons";
import useGameStore from "@/stores/game.store";

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
  const { cardsOnBoard } = useGameStore();

  console.log("cardsOnTheBoard", cardsOnBoard);
  return (
    <StyledSafeAreaView>
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
          <Text color="white">200</Text>
        </Stack>

        <Stack flexDirection="row" justifyContent="center" flex={1} gap="$4">
          <CardSlot>
            {cardsOnBoard[0] && (
              <GameCard
                cardColor={cardsOnBoard[0].color}
                number={cardsOnBoard[0].value}
              />
            )}
          </CardSlot>
          <CardSlot>
            {cardsOnBoard[1] && (
              <GameCard
                cardColor={cardsOnBoard[0].color}
                number={cardsOnBoard[0].value}
              />
            )}
          </CardSlot>
          <CardSlot>
            {cardsOnBoard[2] && (
              <GameCard
                cardColor={cardsOnBoard[0].color}
                number={cardsOnBoard[0].value}
              />
            )}
          </CardSlot>
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
        />
        <Stack
          flex={1}
          flexDirection="row"
          justifyContent="center"
          gap="$2"
          alignItems="flex-end"
        >
          <GameCard cardColor="blue" number={2} />
          <GameCard cardColor="red" number={4} />
          <GameCard cardColor="yellow" number={5} />
          <GameCard cardColor="blue" number={1} />
          <GameCard cardColor="red" number={7} />
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
  );
};

export default Index;

const styles = StyleSheet.create({});
