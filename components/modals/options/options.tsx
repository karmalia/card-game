import {
  Dimensions,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import usePlaySound from "@/hooks/usePlaySound";
import { Checkbox, Stack } from "tamagui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import Icons from "@/components/icons";
import { usePathname, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
type OptionsProps = {
  visible: boolean;
  onClose: () => void;
  handleNavigation?: (type: "home" | "restart") => void;
};
const { width, height } = Dimensions.get("window");

const Musics = {
  "/": require("@/assets/background-musics/menu-music.mp3"),
  "/gamescreen": require("@/assets/background-musics/gameplay-music-1.mp3"),
};

const HomeOptions = ({ visible, onClose, handleNavigation }: OptionsProps) => {
  const [menuMusic, setMenuMusic] = React.useState<{
    sound: Audio.Sound;
    isActive: boolean;
  } | null>(null);

  const pathname = usePathname();
  console.log("PathName", pathname);
  const { navigate } = useRouter();
  const [gameSounds, setGameSounds] = React.useState<boolean>(true);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(height);
  const zIndex = useSharedValue(0);

  const handleMenuOptions = async (play: boolean, type: "Music" | "Sound") => {
    if (type === "Music") {
      try {
        if (!menuMusic?.sound) {
          // Create the sound object only if it doesn't exist
          const { sound } = await Audio.Sound.createAsync(
            Musics[pathname as keyof typeof Musics],
            {
              shouldPlay: play,
              isLooping: true,
            }
          );

          setMenuMusic({ sound: sound, isActive: play });

          if (play) {
            await sound.playAsync();
          }
        } else {
          if (play) {
            await menuMusic.sound.playAsync();
          } else {
            await menuMusic.sound.stopAsync();
          }
          setMenuMusic({ ...menuMusic, isActive: play });
        }

        // Save the preference
        await AsyncStorage.setItem("musicOn", play ? "true" : "false");
      } catch (error) {
        console.error("Error handling menu music:", error);
      }
    }

    if (type === "Sound") {
      try {
        // Save the preference
        setGameSounds(play);
        await AsyncStorage.setItem("gameSounds", play ? "true" : "false");
      } catch (error) {
        console.error("Error handling game sounds:", error);
      }
    }
  };

  // Check if it's the first entry or load the current music status
  const checkFirstEntry = async () => {
    try {
      const firstEntry = await AsyncStorage.getItem("firstEntry");
      if (firstEntry === null) {
        await AsyncStorage.setItem("firstEntry", "true");
        await AsyncStorage.setItem("musicOn", "true");
        await AsyncStorage.setItem("gameSounds", "true");
        handleMenuOptions(true, "Music");
        handleMenuOptions(true, "Sound");
      } else {
        const musicOn = await AsyncStorage.getItem("musicOn");
        const gameSounds = await AsyncStorage.getItem("gameSounds");
        console.log("AsyncStorage musicOn", musicOn);
        console.log("AsyncStorage gameSounds", gameSounds);
        const isMusicOn = musicOn === "true";
        const isGameSoundsOn = gameSounds === "true";
        console.log("isMusicOn", isMusicOn);
        console.log("isGameSoundsOn", isGameSoundsOn);
        handleMenuOptions(isMusicOn, "Music");
        handleMenuOptions(isGameSoundsOn, "Sound");
      }
    } catch (e) {
      console.error("Error checking first entry or setting music:", e);
    }
  };

  React.useEffect(() => {
    checkFirstEntry();

    return () => {
      menuMusic && menuMusic.sound.unloadAsync();
    };
  }, []);

  // Handle checkbox change
  const handleMusicChange = (checked: boolean) => {
    handleMenuOptions(checked, "Music");
  };

  const handleGameSoundChange = (checked: boolean) => {
    handleMenuOptions(checked, "Sound");
  };

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
