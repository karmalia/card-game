import {
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";
import React, { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  withDelay,
} from "react-native-reanimated";
import { TextArea } from "tamagui";
import { TouchableOpacity } from "react-native-gesture-handler";

import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  BottomLeft,
  BottomRight,
  TopLeft,
  TopRight,
} from "@/components/skia-components/corners";

const initialPlaceholder = {
  value: "Enter your username",
  color: "white",
};

const GetUsernameModal = () => {
  const { width, height } = Dimensions.get("screen");
  const [visible, setVisible] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [placeholder, setPlaceholder] = React.useState(initialPlaceholder);
  const [username, setUsername] = React.useState("");
  const sharedOpacity = useSharedValue(0);
  const sharedWidth = useSharedValue(0);
  const sharedHeight = useSharedValue(0);

  useEffect(() => {
    async function getUsername() {
      const username = await AsyncStorage.getItem("username");
      if (!username) setVisible(true);
    }

    getUsername();
  }, []);

  useEffect(() => {
    if (visible) {
      sharedOpacity.value = withTiming(1, {
        duration: 200,
        easing: Easing.linear,
      });
      sharedHeight.value = withDelay(
        200,
        withTiming(50, {
          duration: 200,
          easing: Easing.bounce,
        })
      );
      sharedWidth.value = withDelay(
        200,
        withTiming(300, {
          duration: 200,
          easing: Easing.bounce,
        })
      );
    } else {
      sharedOpacity.value = withTiming(0, {
        duration: 200,
        easing: Easing.linear,
      });
    }
  }, [visible]);

  async function handleDone() {
    if (username.length < 3) {
      setIsError(true);
      setPlaceholder({
        value: "Username must be at least 3 characters",
        color: "red",
      });
      return;
    }
    try {
      const userExists = await firestore()
        .collection("users")
        .where("nickname", "==", username)
        .get();

      if (userExists.empty) {
        const addedUser = await firestore().collection("users").add({
          nickname: username,
          point: 0,
          time: 0,
          score: 0,
        });
        await AsyncStorage.setItem("username", username);
        await AsyncStorage.setItem("bestScore", "0");
        await AsyncStorage.setItem("userId", addedUser.id);
        setVisible(false);
        return;
      } else {
        setIsError(true);
        setPlaceholder({
          value: `This nickname already exists`,
          color: "red",
        });
        setUsername("");
      }
    } catch (error) {
      console.log("Error", error.message);
    }
  }

  const wrapperAnimated = useAnimatedStyle(() => ({
    opacity: sharedOpacity.value,
  }));

  if (!visible) return null; // Return nothing if modal is not visible

  return (
    <Animated.View
      style={[
        wrapperAnimated,
        {
          width,
          height,
          backgroundColor: "rgba(0,0,0,0.4)",
          position: "absolute",
          top: 0,
          left: 0,

          zIndex: 100,
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
    >
      <KeyboardAvoidingView behavior="padding">
        <View
          style={{
            height: 50,
            display: "flex",
            flexDirection: "row",
            position: "relative",
            backgroundColor: "rgba(0,0,0,0.4)",
            alignSelf: "center",
          }}
        >
          <View
            style={{
              width: 250,
              height: 50,
              backgroundColor: "transparent",
              position: "relative",
            }}
          >
            <TopLeft size={10} />
            <TopRight size={10} />
            <BottomLeft size={10} />
            <BottomRight size={10} />
            <TextArea
              placeholder={placeholder.value}
              placeholderTextColor={placeholder.color}
              keyboardType="default" // Set appropriate keyboard type
              style={{
                width: "100%",
                height: "100%",

                backgroundColor: "transparent",
                color: "white",
                fontSize: 18,
                borderWidth: 0,
                borderColor: "transparent",

                padding: 10,
              }}
              onChangeText={(text) => setUsername(text)}
              value={username}
              disableFullscreenUI={true}
              onSubmitEditing={() => {
                console.log("Trigger On Submit");
                handleDone();
              }}
              numberOfLines={1}
              blurOnSubmit={true}
              multiline={false}
              maxLength={20}
            />
          </View>

          <TouchableOpacity
            onPress={handleDone} // Add close action
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: 100,
              height: 50,
              position: "relative",
              zIndex: 101,
            }}
          >
            <TopLeft size={10} />
            <TopRight size={10} />
            <BottomLeft size={10} />
            <BottomRight size={10} />
            <Text
              style={{
                color: "white",
                fontSize: 18,
                letterSpacing: 2,
                fontFamily: "DragonSlayer",
              }}
            >
              DONE
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

export default GetUsernameModal;
