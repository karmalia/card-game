import { View, Text } from "react-native";
import React from "react";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import { child } from "@react-native-firebase/database";

const TopLeft = ({ size }: { size: number }) => {
  const path = Skia.Path.Make();
  path.moveTo(0, 0);
  path.lineTo(size, 0);
  path.moveTo(0, 0);
  path.lineTo(0, size);
  path.close();

  return (
    <Canvas
      style={{
        position: "absolute",
        top: 1,
        left: 1,
        width: size,
        height: size,
      }}
    >
      <Path style={"stroke"} path={path} strokeWidth={2} color={"white"} />
    </Canvas>
  );
};

const TopRight = ({ size }: { size: number }) => {
  const path = Skia.Path.Make();
  path.moveTo(0, 0);
  path.lineTo(size, 0);
  path.moveTo(size, 0);
  path.lineTo(size, size);
  path.close();

  return (
    <Canvas
      style={{
        position: "absolute",
        top: 1,
        right: 1,
        width: size,
        height: size,
      }}
    >
      <Path style={"stroke"} path={path} strokeWidth={2} color={"white"} />
    </Canvas>
  );
};

const BottomLeft = ({ size }: { size: number }) => {
  const path = Skia.Path.Make();
  path.moveTo(0, 0);
  path.lineTo(0, size);
  path.moveTo(0, size);
  path.lineTo(size, size);

  path.close();

  return (
    <Canvas
      style={{
        position: "absolute",
        bottom: 1,
        left: 1,
        width: size,
        height: size,
      }}
    >
      <Path style={"stroke"} path={path} strokeWidth={2} color={"white"} />
    </Canvas>
  );
};

const BottomRight = ({ size }: { size: number }) => {
  const path = Skia.Path.Make();
  path.moveTo(size, size);
  path.lineTo(0, size);
  path.moveTo(size, size);
  path.lineTo(size, 0);
  path.close();

  return (
    <Canvas
      style={{
        position: "absolute",
        bottom: 1,
        right: 1,
        width: size,
        height: size,
      }}
    >
      <Path style={"stroke"} path={path} strokeWidth={2} color={"white"} />
    </Canvas>
  );
};

export { TopLeft, TopRight, BottomLeft, BottomRight };
