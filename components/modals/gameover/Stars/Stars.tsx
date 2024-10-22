import React, { useEffect } from "react";
import { Dimensions, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { Canvas, Path, Skia, SkPath } from "@shopify/react-native-skia";

// Helper function to create star path.
function createStarPath(
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number
) {
  const path = Skia.Path.Make();
  let angle = Math.PI / spikes;

  path.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    path.lineTo(
      cx + Math.cos(angle * (2 * i + 1)) * innerRadius,
      cy - Math.sin(angle * (2 * i + 1)) * innerRadius
    );
    path.lineTo(
      cx + Math.cos(angle * (2 * i + 2)) * outerRadius,
      cy - Math.sin(angle * (2 * i + 2)) * outerRadius
    );
  }
  path.close();
  return path;
}

const { width, height } = Dimensions.get("window");

type StarsProps = {
  starCount: number; // Number of stars to generate (1 to 3)
};

const defaultStar = Skia.Path.Make();
defaultStar.moveTo(128, 0);
defaultStar.lineTo(168, 80);
defaultStar.lineTo(256, 93);
defaultStar.lineTo(192, 155);
defaultStar.lineTo(207, 244);
defaultStar.lineTo(128, 202);
defaultStar.lineTo(49, 244);
defaultStar.lineTo(64, 155);
defaultStar.lineTo(0, 93);
defaultStar.lineTo(88, 80);
defaultStar.lineTo(128, 0);
defaultStar.close();

function getScaledStarPath(path: SkPath, scale: number): SkPath {
  const scaledStar = path.copy(); // Copy the original path to avoid mutation
  scaledStar.transform([scale, 0, 0, 0, scale, 10, 0, 0, 1]);
  return scaledStar;
}

const Stars: React.FC<StarsProps> = ({ starCount }) => {
  const sharedOpacity = useSharedValue(0);
  const sharedScale = useSharedValue(0.5);

  useEffect(() => {
    sharedOpacity.value = withTiming(1, { duration: 500 });
    sharedScale.value = withDelay(
      500,
      withTiming(1, { duration: 500, easing: Easing.bounce })
    );
  }, [starCount]);

  const canvasStyle = useAnimatedStyle(() => ({
    opacity: sharedOpacity.value,
    transform: [{ scale: sharedScale.value }],
  }));

  const renderStars = (starCount: number) => {
    const stars = [];

    for (let i = 1; i <= 3; i++) {
      const smallStar = getScaledStarPath(defaultStar, 0.2);
      stars.push(
        <View
          style={{
            height: "100%",
            flex: 1,
            paddingLeft: "5%",
          }}
          key={`star-${i}`}
        >
          <Canvas
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <Path
              key={`star-${i}`}
              path={smallStar}
              color="white"
              style={i <= starCount ? "fill" : "stroke"}
              strokeWidth={1}
              opacity={1}
            />
          </Canvas>
        </View>
      );
    }
    return stars;
  };

  return (
    <Animated.View
      style={[
        {
          justifyContent: "center",
          display: "flex",
          flexDirection: "row",
          height: "auto",
          paddingHorizontal: 20,
        },
        canvasStyle,
      ]}
    >
      {renderStars(starCount)}
    </Animated.View>
  );
};

export default Stars;
