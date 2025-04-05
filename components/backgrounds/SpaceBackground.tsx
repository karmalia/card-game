import React, { useEffect, useMemo } from "react";
import { Canvas, Rect, LinearGradient, vec } from "@shopify/react-native-skia";
import { Dimensions } from "react-native";
import {
  useSharedValue,
  withTiming,
  withRepeat,
  Easing,
  useAnimatedStyle,
  useAnimatedReaction,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const AnimatedGradientBackground = React.memo(() => {
  const starScale1 = useSharedValue(1);

  // Generate star positions only once
  const stars = useMemo(() => {
    const group1 = Array.from({ length: 10 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      opacity: Math.random() * 0.8 + 0.2, // Slightly stronger stars
    }));

    return { group1 };
  }, []); // Empty dependency array means this runs only once

  useEffect(() => {
    // Start animations
    starScale1.value = withRepeat(
      withTiming(3, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    return () => {
      // Cancel animations on unmount
      starScale1.value = 0;
    };
  }, []);

  return (
    <Canvas
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
      }}
    >
      <Rect x={0} y={0} width={width} height={height}>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(width, height)}
          colors={["#000040", "#000050", "#000060", "#000070", "#000080"]}
        />
      </Rect>

      {stars.group1.map((star, index) => (
        <Rect
          key={`star-1-${index}`}
          x={star.x}
          y={star.y}
          width={starScale1}
          height={starScale1}
          color="white"
          opacity={star.opacity}
        />
      ))}
    </Canvas>
  );
});

export default AnimatedGradientBackground;
