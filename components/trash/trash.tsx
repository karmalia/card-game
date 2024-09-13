import { ImageBackground, StyleSheet, Text, View } from "react-native";
import React, { forwardRef } from "react";
import { Stack } from "tamagui";
import { Ionicons } from "@expo/vector-icons";

type Props = {};

const Trash = forwardRef((props: Props, ref: any) => {
  return (
    <Stack
      height={"$11"}
      width={"$8"}
      borderWidth="$1"
      borderRadius={"$2"}
      margin="$4"
      alignSelf="flex-end"
      alignItems="center"
      justifyContent="center"
      ref={ref!}
    >
      <ImageBackground
        style={{
          flex: 1,
          width: "100%",
        }}
        source={require("@/assets/card-backgrounds/TrashCard2.png")}
      ></ImageBackground>
    </Stack>
  );
});

export default Trash;

const styles = StyleSheet.create({});
