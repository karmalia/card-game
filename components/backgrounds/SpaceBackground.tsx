import React, { useEffect } from "react";
import { Canvas, Rect, LinearGradient, vec } from "@shopify/react-native-skia";
import { Dimensions, ImageBackground } from "react-native";
import {
  useSharedValue,
  withTiming,
  withRepeat,
  Easing,
} from "react-native-reanimated";
import { View } from "tamagui";

const { width, height } = Dimensions.get("window");

const AnimatedGradientBackground = React.memo(() => {
  const starScale1 = useSharedValue(1);
  const starScale2 = useSharedValue(3);
  const starScale3 = useSharedValue(5);

  useEffect(() => {
    starScale1.value = withRepeat(
      withTiming(3, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    starScale2.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    starScale3.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  return (
    <>
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
        {Array.from({ length: 25 }).map((_, index) => (
          <Rect
            key={`star-1-${index}`}
            x={Math.random() * width}
            y={Math.random() * height}
            width={starScale1}
            height={starScale1}
            color="white"
            opacity={Math.random()}
          />
        ))}
        {Array.from({ length: 25 }).map((_, index) => (
          <Rect
            key={`star-2-${index}`}
            x={Math.random() * width}
            y={Math.random() * height}
            width={starScale2}
            height={starScale2}
            color="white"
            opacity={Math.random()}
          />
        ))}
        {Array.from({ length: 25 }).map((_, index) => (
          <Rect
            key={`star-3-${index}`}
            x={Math.random() * width}
            y={Math.random() * height}
            width={starScale3}
            height={starScale3}
            color="white"
            opacity={Math.random()}
          />
        ))}
      </Canvas>
      {/* <ImageBackground
        source={require("@/assets/backgrounds/milky-purple.png")}
        resizeMode="cover"
        style={{
          position: "absolute",

          height: 300,
          width: 300,
          right: 0,
          bottom: 0,
          opacity: 0.5,
        }}
      ></ImageBackground> */}
    </>
  );
});

export default AnimatedGradientBackground;
