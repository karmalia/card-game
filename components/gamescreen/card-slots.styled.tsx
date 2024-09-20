import useGameStore from "@/stores/game.store";
import React, { forwardRef, useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { styled, View } from "tamagui";

const CardSlotStyled = forwardRef((props: any, ref: any) => {
  const StyledView = styled(View, {
    minWidth: "$8",
    minHeight: "$11",
    borderColor: "beige",
    padding: 1,

    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  });

  return <StyledView ref={ref} />;
});
const initialState = {
  value: 0,
  isActive: false,
  color: "#383838",
};
const BoardSlotStyled = forwardRef((props: any, ref: any) => {
  const [boardState, setBoardState] = React.useState(initialState);
  const { topSlotPositions, cardsOnBoard } = useGameStore();
  const sharedStyle = useSharedValue("#383838"); // Initial color

  useEffect(() => {
    const findSlot = topSlotPositions[props.slotNumber];
    if (findSlot) {
      if (!findSlot.isActive) {
        setBoardState(initialState);
      } else {
        const findCard = cardsOnBoard.find(
          (card) => card.destinationSlot?.slotId === findSlot.slotId
        );
        setBoardState({
          value: findCard ? findCard.value : 0,
          isActive: findSlot.isActive,
          color: findCard ? findCard.color : "#383838",
        });
      }
    }
  }, [topSlotPositions[props.slotNumber]]);

  useEffect(() => {
    sharedStyle.value = withTiming(boardState.color, {
      duration: 500, // Adjust duration as needed
    });
  }, [boardState.color]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderWidth: 1,
      borderColor: sharedStyle.value,
    };
  });

  const StyledView = styled(View, {
    minWidth: "$8",
    minHeight: "$11",
    padding: 1,

    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  });

  return (
    <Animated.View style={animatedStyle}>
      <StyledView ref={ref} />
    </Animated.View>
  );
});

export default { BoardSlotStyled, CardSlotStyled };
