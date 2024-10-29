import { View, Text } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

type DirectionOverlayProps = {
  sharedDirective: SharedValue<"none" | "play" | "delete">;
};

enum Directive {
  "none" = "",
  "play" = "PLAY",
  "delete" = "DISCARD",
}

const DirectionOverlay = ({ sharedDirective }: DirectionOverlayProps) => {
  const sharedOpacity = useSharedValue(0);

  useEffect(() => {
    console.log("sharedDirective", sharedDirective.value);
    if (
      sharedDirective.value === "play" ||
      sharedDirective.value === "delete"
    ) {
      sharedOpacity.value = 0.5;
    } else {
      sharedOpacity.value = 0;
    }
  }, [sharedDirective.value]);

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
        {Directive[sharedDirective.value]}
      </Text>
    </Animated.View>
  );
};

export default DirectionOverlay;
