import { Dimensions, ImageBackground, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Image, Stack, View } from "tamagui";

import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import HomeButtons from "@/components/home-buttons/home-buttons";
import HomeOptions from "@/components/modals/options/options";
import HowToPlay from "@/components/modals/how-to-play";
import GetUsernameModal from "@/components/modals/get-username/get-username";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GradientBackground from "@/components/backgrounds/GradientBackground";

const Index = () => {
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [instructionsVisible, setInstructuresVisible] = useState(false);
  const [getusername, setGetusername] = useState(false);

  useEffect(() => {
    async function checkIfUserExists() {
      const user = await AsyncStorage.getItem("username");
      if (!user) {
        setGetusername(true);
      } else {
        console.log("user exists", user);
      }
    }

    checkIfUserExists();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
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
      <GetUsernameModal
        visible={getusername}
        onClose={() => setGetusername(false)}
      />
      <HowToPlay
        visible={instructionsVisible}
        onClose={() => setInstructuresVisible(false)}
      />

      <HomeButtons setInstructuresVisible={setInstructuresVisible} />

      <GradientBackground />
    </SafeAreaView>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    paddingHorizontal: 24,
    overflow: "hidden",
    height: "100%",
    width: "100%",
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
