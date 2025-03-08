import { StyleSheet } from "react-native";
import React from "react";
import { Stack, View } from "tamagui";
import useGameStore from "@/stores/game.store";
import SafeAreaStyled from "@/components/gamescreen/safe-area.styled";
import Styled from "@/components/gamescreen/card-slots.styled";
import RenderCards from "@/components/render-cards/render-cards";
import Deck from "@/components/deck/deck";
import Trash from "@/components/trash/trash";
import GameScore from "@/components/gamescore/gamescore";
import AnimatedGameBackground from "@/components/backgrounds/GameBackground";
import Options from "@/components/modals/options/options";
import GameOverModal from "@/components/modals/gameover/game-over-modal";

const GameScreen = () => {
  const { gamePhase } = useGameStore();

  return (
    <View style={styles.container}>
      <Options />
      <GameScore />
      <SafeAreaStyled>
        <Stack flexDirection="row" justifyContent="space-around">
          <Stack flexDirection="row" justifyContent="center" flex={1} gap="$4">
            <Styled.BoardSlotStyled slotNumber={0}></Styled.BoardSlotStyled>
            <Styled.BoardSlotStyled slotNumber={1}></Styled.BoardSlotStyled>
            <Styled.BoardSlotStyled slotNumber={2}></Styled.BoardSlotStyled>
          </Stack>
        </Stack>
        <Stack
          flex={1}
          flexDirection="row"
          justifyContent="space-around"
          paddingHorizontal="$4"
        >
          <Deck />
          <Stack
            flex={1}
            flexDirection="row"
            justifyContent="center"
            gap="$4"
            alignItems="flex-end"
          >
            <Styled.CardSlotStyled></Styled.CardSlotStyled>
            <Styled.CardSlotStyled></Styled.CardSlotStyled>
            <Styled.CardSlotStyled></Styled.CardSlotStyled>
            <Styled.CardSlotStyled></Styled.CardSlotStyled>
            <Styled.CardSlotStyled></Styled.CardSlotStyled>
          </Stack>
          <Trash />
        </Stack>
      </SafeAreaStyled>
      <RenderCards />
      <AnimatedGameBackground />
      {gamePhase === 3 && <GameOverModal />}
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GameScreen;
