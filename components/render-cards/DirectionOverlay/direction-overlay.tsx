import { View, Text } from "react-native";
import React from "react";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

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
  // Derive the opacity value with smoother animation
  const sharedOpacity = useDerivedValue(() => {
    return sharedDirective.value === "play" ||
      sharedDirective.value === "delete"
      ? withTiming(0.8, { duration: 300 })
      : withTiming(0, { duration: 300 });
  }, []);

  // Derive the text value
  const directiveText = useDerivedValue(() => {
    console.log("Directive updated:", sharedDirective.value, EDirective[sharedDirective.value]);
    return EDirective[sharedDirective.value] || "testo";
  }, []);

  // Create animated styles for the view
  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: sharedOpacity.value,
    
    };
  });

  // Create animated styles for the text
  const textStyle = useAnimatedStyle(() => {
    return {
      color: "#FFFFFF", // Make sure text is white
      fontSize: 42,
      fontWeight: "bold",
      textAlign: "center",
      // Add a text shadow to make it more visible against any background
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 5,
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
          backgroundColor: "rgba(0,0,0,0.6)", // Slightly transparent background
          justifyContent: "center",
          alignItems: "center",
          zIndex: 99, // Ensure it's on top of everything
        },
        animatedStyles,
      ]}
    >
      <Animated.Text style={textStyle}>
        {directiveText.value}
      </Animated.Text>
    </Animated.View>
  );
};

export default DirectionOverlay;