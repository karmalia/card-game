import {
  Dimensions,
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
import { useRouter } from "expo-router";
import * as NavigationBar from "expo-navigation-bar";
import firestore from "@react-native-firebase/firestore";

const initialPlaceholder = {
  value: "Enter your username",
  color: "gray",
};

const GetUsernameModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const { width, height } = Dimensions.get("screen");
  const usersCollection = firestore().collection("users");

  console.log("users", usersCollection);

  const [isError, setIsError] = React.useState(false);
  const [placeholder, setPlaceholder] = React.useState(initialPlaceholder);
  const [username, setUsername] = React.useState("");
  const router = useRouter();
  const sharedOpacity = useSharedValue(0);
  const sharedWidth = useSharedValue(0);
  const sharedHeight = useSharedValue(0);

  useEffect(() => {
    NavigationBar.setVisibilityAsync("visible");

    return () => {
      NavigationBar.setVisibilityAsync("hidden");
    };
  }, []);

  useEffect(() => {
    if (visible) {
      // Animate the modal to appear
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
      // Animate the modal to disappear
      sharedOpacity.value = withTiming(0, {
        duration: 200,
        easing: Easing.linear,
      });
    }
  }, [visible]);

  function handleDone() {
    console.log("Triggered!");
    if (username === "") return;
    setIsError(true);
    setPlaceholder({
      value: `${username} already exists`,
      color: "red",
    });
    setUsername("");
    //Check firebase for username if it exists
    //If it exists, write error message
    //If it doesn't exist, write username to firebase
    //Close modal
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
        },
      ]}
    >
      <KeyboardAvoidingView behavior="padding">
        <View
          style={{
            width: 350,
            height: 50,
            display: "flex",
            flexDirection: "row",
            position: "relative",
            backgroundColor: "beige",
            alignSelf: "center",
            marginTop: height / 2 - 25,
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
            <TextArea
              placeholder={placeholder.value}
              placeholderTextColor={placeholder.color}
              keyboardType="default" // Set appropriate keyboard type
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "transparent",
                color: "black",
                fontSize: 18,

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
            />
          </View>

          <TouchableOpacity
            onPress={handleDone} // Add close action
            style={{
              padding: 10,
              alignItems: "center",
              justifyContent: "center",
              width: 100,
              height: 50,
              borderLeftWidth: 2,
              borderColor: "black",
              zIndex: 101,
            }}
          >
            <Text
              style={{
                color: "black",
                fontSize: 18,
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
