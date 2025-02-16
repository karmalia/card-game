import { View, Text } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import useOverlayStore from "@/stores/overlay.store";

export enum EDirective {
  "none" = "",
  "play" = "PLAY",
  "delete" = "DISCARD",
}

const DirectionOverlay = ({
  sharedDirective,
}: {
  sharedDirective: SharedValue<keyof typeof EDirective>;
}) => {
  const sharedOpacity = useDerivedValue(() => {
    console.log("sharedDirective.value", sharedDirective.value);

    return sharedDirective.value === "play" ||
      sharedDirective.value === "delete"
      ? 0.5
      : 0;
  }, [sharedDirective]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: sharedOpacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,1)",
          justifyContent: "center",
          alignItems: "center",
          zIndex: -10,
          opacity: 0,
        },
        animatedStyles,
      ]}
    >
      <Text
        style={{
          color: "white",
          fontSize: 42,
          lineHeight: 84,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {EDirective[sharedDirective.value] || "TEST"}
      </Text>
    </Animated.View>
  );
};

export default DirectionOverlay;
