import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { View, Text, styled } from "tamagui";
import { CardColors } from "@/stores/game.store";
import { TouchableOpacity } from "react-native-gesture-handler";
import Animated, { useSharedValue } from "react-native-reanimated";
const StyledCard = styled(View, {
  name: "GameCard",
  variants: {
    red: {
      true: {
        backgroundColor: "$cardRed",
      },
    },
    yellow: {
      true: {
        backgroundColor: "$cardYellow",
      },
    },
    blue: {
      true: {
        backgroundColor: "$cardBlue",
      },
    },

    centered: {
      true: {
        alignItems: "center",
        justifyContent: "center",
      },
    },
  },
  height: "$11",
  width: "$8",
  borderRadius: "$2",
});

const CardNumber = styled(Text, {
  name: "CardNumber",
  fontSize: "$12",
  color: "$cardText",
});

type GameCardProps = {
  id: string;
  cardColor: CardColors;
  number: number;
  playCard?: (cardId: string) => void;
  slotPositions: {
    slot1: any;
    slot2: any;
    slot3: any;
  };
};

const GameCard = ({ id, cardColor, number, playCard }: GameCardProps) => {
  const [isPlayed, setIsPlayed] = useState(false);
  const transX = useSharedValue(0);
  const transY = useSharedValue(0);

  return (
    <Animated.View>
      <TouchableOpacity onPress={() => playCard && playCard(id)}>
        <StyledCard
          red={cardColor === "red"}
          blue={cardColor === "blue"}
          yellow={cardColor === "yellow"}
          centered
        >
          <CardNumber>{number || 0}</CardNumber>
        </StyledCard>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default GameCard;

const styles = StyleSheet.create({});
