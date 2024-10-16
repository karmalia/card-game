import {
  Dimensions,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Checkbox, Stack } from "tamagui";
import Icons from "@/components/icons";
import { usePathname, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Music } from "@/hooks/MusicProvider";
type OptionsProps = {
  visible: boolean;
  onClose: () => void;
  handleNavigation?: (type: "home" | "restart") => void;
};
const { width, height } = Dimensions.get("window");

const HomeOptions = ({ visible, onClose, handleNavigation }: OptionsProps) => {
  const pathname = usePathname();
  const { menuMusic, gameSounds, handleMusicChange, handleGameSoundChange } =
    useContext<any>(Music);

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(height);
  const zIndex = useSharedValue(0);

  if (visible) {
    opacity.value = withTiming(0.5, { duration: 300 });
    translateY.value = withTiming(0, { duration: 300 });
    zIndex.value = withTiming(10, { duration: 300 });
  } else {
    zIndex.value = withTiming(0, { duration: 300 });
    opacity.value = withTiming(0, { duration: 300 });
    translateY.value = withTiming(height, { duration: 300 });
  }

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    zIndex: zIndex.value,
  }));

  const animatedModalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    zIndex: zIndex.value,
  }));

  return (
    <>
      <Animated.View style={[styles.background, animatedBackgroundStyle]} />
      <Animated.View style={[styles.modalContainer, animatedModalStyle]}>
        <ImageBackground
          source={require("@/assets/modals/options-modal.png")}
          resizeMethod="auto"
          resizeMode="stretch"
        >
          <View style={styles.modalContent}>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
              }}
            >
              <Text style={styles.modalText}>OPTIONS</Text>
              <Pressable style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>X</Text>
              </Pressable>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 12,
                height: 24,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "DragonSlayer",
                  fontSize: 22,
                  letterSpacing: 1,
                }}
              >
                MUSIC
              </Text>
              <Checkbox
                size={"$4"}
                checked={menuMusic?.isActive}
                onCheckedChange={handleMusicChange}
              >
                <Checkbox.Indicator>
                  {menuMusic?.isActive && <Icons.Check width={12} />}
                </Checkbox.Indicator>
              </Checkbox>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 12,
                height: 24,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "DragonSlayer",
                  fontSize: 22,
                  letterSpacing: 1,
                }}
              >
                SOUNDS
              </Text>
              <Checkbox
                size={"$4"}
                checked={gameSounds}
                onCheckedChange={handleGameSoundChange}
              >
                <Checkbox.Indicator>
                  {gameSounds && <Icons.Check width={12} />}
                </Checkbox.Indicator>
              </Checkbox>
            </View>
            {pathname === "/gamescreen" && handleNavigation && (
              <Stack
                direction="ltr"
                marginVertical="$4"
                flexDirection="row"
                display="flex"
              >
                <View style={styles.optionsButton}>
                  <TouchableOpacity onPress={() => handleNavigation("home")}>
                    <Text style={styles.optionsText}>HOME</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.optionsButton}>
                  <TouchableOpacity onPress={() => handleNavigation("restart")}>
                    <Text style={styles.optionsText}>RESTART</Text>
                  </TouchableOpacity>
                </View>
              </Stack>
            )}
          </View>
        </ImageBackground>
      </Animated.View>
    </>
  );
};

export default HomeOptions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  openButtonText: {
    color: "white",
    fontSize: 16,
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "black",
  },
  modalContainer: {
    position: "absolute",
    maxWidth: Dimensions.get("window").width * 0.3,
    backgroundColor: "transparent",
    borderRadius: 10,

    alignSelf: "center",
    top: "30%",
  },
  modalContent: {
    width: Dimensions.get("window").width * 0.3,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  modalText: {
    fontSize: 26,
    letterSpacing: 1,
    marginVertical: 10,
    fontFamily: "DragonSlayer",
    flex: 1,
    textAlign: "center",
  },
  closeButton: {
    padding: 10,
    borderRadius: 10,
  },
  closeButtonText: {
    color: "black",
    fontSize: 24,
    fontFamily: "DragonSlayer",
  },
  optionsButton: {
    borderColor: "black",
    flex: 1,
  },
  optionsText: {
    fontFamily: "DragonSlayer",
    fontSize: 22,
    paddingVertical: 6,
    letterSpacing: 1,
    textAlign: "center",
  },
});
