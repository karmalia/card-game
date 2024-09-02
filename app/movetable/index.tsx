import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  PanResponderGestureState,
  GestureResponderEvent,
} from "react-native";
import { Stack } from "tamagui";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

type Props = {};

const MoveTable = (props: Props) => {
  const TransX = useSharedValue(0);
  const TransY = useSharedValue(0);

  const panResponder = useState(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (
        event: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        const { moveX, moveY } = gestureState;
        console.log(`Moved to: X=${moveX}, Y=${moveY}`);
        // You can add more logic here, like updating state or handling drag and drop
      },
      onPanResponderRelease: (
        event: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        const { moveX, moveY } = gestureState;
        console.log(`Released at: X=${moveX}, Y=${moveY}`);
        // Handle drop logic here
      },
    })
  );

  React.useEffect(() => {}, []);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: TransX.value }, { translateY: TransY.value }],
  }));

  return (
    <View style={styles.container}>
      <Text>MoveTable</Text>
      <Animated.View style={[animatedStyles]}>
        <Stack
          backgroundColor={"$red5"}
          height={"$5"}
          width={"$5"}
          onPress={() => console.log("Pressed")}
        />
      </Animated.View>
    </View>
  );
};

export default MoveTable;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
