import { Dimensions, ImageBackground, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Image, Stack, View } from "tamagui";

import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import HomeButtons from "@/components/home-buttons/home-buttons";
import HomeOptions from "@/components/modals/options/options";

const Index = () => {
  const [optionsVisible, setOptionsVisible] = useState(false);

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <ImageBackground
        source={require("@/assets/backgrounds/canny_res_00522_.png")}
        resizeMode="stretch"
        style={styles.image}
      >
        <View
          style={{
            height: Dimensions.get("screen").height * 0.45,
            alignSelf: "flex-end",
            marginTop: 12,
          }}
        >
          <Stack
            borderRadius="$4"
            justifyContent="center"
            alignItems="center"
            marginHorizontal="$4"
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                setOptionsVisible((prev) => !prev);
              }}
            >
              <Image
                height="$4"
                width="$4"
                resizeMethod="auto"
                source={require("@/assets/icons/settings2.png")}
              />
            </TouchableOpacity>
          </Stack>
        </View>

        <HomeOptions
          visible={optionsVisible}
          onClose={() => setOptionsVisible(false)}
        />

        <HomeButtons />
      </ImageBackground>
    </SafeAreaView>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  image: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 42,
    lineHeight: 84,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000c0",
  },
});

export default Index;
