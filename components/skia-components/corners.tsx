import { View, Text } from "react-native";
import React from "react";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";

type CornerProps = {
  size: number;
  variant?: "default" | "box" | "edged";
  color?: string;
  strokeWidth?: number;
};

const TopLeft = ({
  size,
  variant = "default",
  color = "white",
  strokeWidth = 2,
}: CornerProps) => {
  const path = Skia.Path.Make();
  const path2 = Skia.Path.Make();

  if (variant === "box") {
    // Box variant - creates a square corner
    path.moveTo(0, size / 3);
    path.lineTo(0, 0);
    path.lineTo(size / 3, 0);
  } else if (variant === "edged") {
    // Edged variant - creates a stylized corner with a notch
    path.moveTo(0, 0);
    path.lineTo(0, size);
    path.moveTo(0, 0);
    path.lineTo(size, 0);

    path2.moveTo(5, 5);
    path2.lineTo(5, size / 2);
    path2.moveTo(5, 5);
    path2.lineTo(size / 2, 5);
  } else {
    // Default variant - creates an angled corner
    path.moveTo(0, 0);
    path.lineTo(size, 0);
    path.moveTo(0, 0);
    path.lineTo(0, size);
  }

  path.close();
  path2.close();

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
      <Path
        style={"stroke"}
        path={path}
        strokeWidth={strokeWidth * 2}
        color={color}
      />
      <Path
        style={"stroke"}
        path={path2}
        strokeWidth={strokeWidth}
        color={color}
      />
    </Canvas>
  );
};

const TopRight = ({
  size,
  variant = "default",
  color = "white",
  strokeWidth = 2,
}: CornerProps) => {
  const path = Skia.Path.Make();
  const path2 = Skia.Path.Make();

  if (variant === "box") {
    // Box variant
    path.moveTo(size - size / 3, 0);
    path.lineTo(size, 0);
    path.lineTo(size, size / 3);
  } else if (variant === "edged") {
    // Edged variant - main outline
    path.moveTo(size, 0);
    path.lineTo(size, size);
    path.moveTo(size, 0);
    path.lineTo(0, 0);

    // Edged variant - inner detail
    path2.moveTo(size - 5, 5);
    path2.lineTo(size - 5, size / 2);
    path2.moveTo(size - 5, 5);
    path2.lineTo(size / 2, 5);
  } else {
    // Default variant
    path.moveTo(0, 0);
    path.lineTo(size, 0);
    path.moveTo(size, 0);
    path.lineTo(size, size);
  }

  path.close();
  path2.close();

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
      <Path
        style={"stroke"}
        path={path}
        strokeWidth={strokeWidth * 2}
        color={color}
      />
      <Path
        style={"stroke"}
        path={path2}
        strokeWidth={strokeWidth}
        color={color}
      />
    </Canvas>
  );
};

const BottomLeft = ({
  size,
  variant = "default",
  color = "white",
  strokeWidth = 2,
}: CornerProps) => {
  const path = Skia.Path.Make();
  const path2 = Skia.Path.Make();

  if (variant === "box") {
    // Box variant
    path.moveTo(0, size - size / 3);
    path.lineTo(0, size);
    path.lineTo(size / 3, size);
  } else if (variant === "edged") {
    // Edged variant - main outline
    path.moveTo(0, size);
    path.lineTo(0, 0);
    path.moveTo(0, size);
    path.lineTo(size, size);

    // Edged variant - inner detail
    path2.moveTo(5, size - 5);
    path2.lineTo(5, size / 2);
    path2.moveTo(5, size - 5);
    path2.lineTo(size / 2, size - 5);
  } else {
    // Default variant
    path.moveTo(0, 0);
    path.lineTo(0, size);
    path.moveTo(0, size);
    path.lineTo(size, size);
  }

  path.close();
  path2.close();

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
      <Path
        style={"stroke"}
        path={path}
        strokeWidth={strokeWidth * 2}
        color={color}
      />
      <Path
        style={"stroke"}
        path={path2}
        strokeWidth={strokeWidth}
        color={color}
      />
    </Canvas>
  );
};

const BottomRight = ({
  size,
  variant = "default",
  color = "white",
  strokeWidth = 2,
}: CornerProps) => {
  const path = Skia.Path.Make();
  const path2 = Skia.Path.Make();

  if (variant === "box") {
    // Box variant
    path.moveTo(size - size / 3, size);
    path.lineTo(size, size);
    path.lineTo(size, size - size / 3);
  } else if (variant === "edged") {
    // Edged variant - main outline
    path.moveTo(size, size);
    path.lineTo(size, 0);
    path.moveTo(size, size);
    path.lineTo(0, size);

    // Edged variant - inner detail
    path2.moveTo(size - 5, size - 5);
    path2.lineTo(size - 5, size / 2);
    path2.moveTo(size - 5, size - 5);
    path2.lineTo(size / 2, size - 5);
  } else {
    // Default variant
    path.moveTo(size, size);
    path.lineTo(0, size);
    path.moveTo(size, size);
    path.lineTo(size, 0);
  }

  path.close();
  path2.close();

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
      <Path
        style={"stroke"}
        path={path}
        strokeWidth={strokeWidth * 2}
        color={color}
      />
      <Path
        style={"stroke"}
        path={path2}
        strokeWidth={strokeWidth}
        color={color}
      />
    </Canvas>
  );
};

export { TopLeft, TopRight, BottomLeft, BottomRight };
