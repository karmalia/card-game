import React, { useEffect } from "react";
import {
  Canvas,
  Rect,
  LinearGradient,
  vec,
  Path,
} from "@shopify/react-native-skia";
import { Dimensions } from "react-native";
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
  withRepeat,
  Easing,
} from "react-native-reanimated";

const AnimatedGradientBackground = () => {
  const { width, height } = Dimensions.get("window");

  // Scale değerini yönetmek için SharedValue
  const starScale1 = useSharedValue(1); // Başlangıçta 1x ölçek
  const starScale2 = useSharedValue(3); // Başlangıçta 1x ölçek

  // Scale animasyonu başlatılıyor
  useEffect(() => {
    starScale1.value = withRepeat(
      withTiming(3, {
        duration: 1500,
        easing: Easing.inOut(Easing.ease), // Yumuşak geçiş
      }),
      -1, // Sonsuz döngü
      true // Yoyo: Geri dönüş yapar
    );
    starScale2.value = withRepeat(
      withTiming(1, {
        duration: 1500,
        easing: Easing.inOut(Easing.ease), // Yumuşak geçiş
      }),
      -1, // Sonsuz döngü
      true // Yoyo: Geri dönüş yapar
    );
  }, []);

  // DerivedValue ile Path'e bağlıyoruz

  return (
    <Canvas
      style={{
        flex: 1,
        width: width,
        height: height,
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: -1,
      }}
    >
      {/* Animasyonlu Degrade Arka Plan */}
      <Rect x={0} y={0} width={width} height={height}>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(width, height)}
          colors={["#000010", "#000020", "#000030", "#000040", "#000050"]}
        />
      </Rect>

      {/* Yıldız Tozu Efekti */}
      {Array.from({ length: 25 }).map((_, index) => (
        <Rect
          key={index}
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
          key={index}
          x={Math.random() * width}
          y={Math.random() * height}
          width={starScale2}
          height={starScale2}
          color="white"
          opacity={Math.random()}
        />
      ))}
    </Canvas>
  );
};

export default AnimatedGradientBackground;
