import { createContext, useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePathname } from "expo-router";
import { set } from "@react-native-firebase/database";

interface MusicContext {
  menuMusic: {
    sound: Audio.Sound | null;
    isActive: boolean;
  };
  gameSounds: boolean;
  handleMusicChange: (checked: boolean) => void;
  handleGameSoundChange: (checked: boolean) => void;
}

const Music = createContext<null | MusicContext>(null);

type Props = {
  children: React.ReactNode;
};

const Musics = {
  "/": require("@/assets/background-musics/galactic-whisper.mp3"),
  "/gamescreen": require("@/assets/background-musics/galactic-whisper.mp3"),
};

const MusicProvider = ({ children }: Props) => {
  const pathname = usePathname();
  const isMounted = useRef(true);
  const [menuMusic, setMenuMusic] = useState<{
    sound: Audio.Sound | null;
    isActive: boolean;
  }>({ sound: null, isActive: true });
  const [gameSounds, setGameSounds] = useState<boolean>(true);

  const handleMenuOptions = async (play: boolean, type: "Music" | "Sound") => {
    if (menuMusic.sound === null) return;

    if (type === "Music") {
      try {
        play
          ? await menuMusic.sound.playAsync()
          : await menuMusic.sound.stopAsync();

        setMenuMusic((prev) => ({ ...prev, isActive: play }));

        await AsyncStorage.setItem("musicOn", play ? "true" : "false");
      } catch (error) {
        console.error("Error handling menu music:", error);
      }
    } else if (type === "Sound") {
      try {
        setGameSounds(play);
        await AsyncStorage.setItem("gameSounds", play ? "true" : "false");
      } catch (error) {
        console.error("Error handling game sounds:", error);
      }
    }
  };

  useEffect(() => {
    isMounted.current = true;

    async function loadAndPlayMusic() {
      const isMusicOn = await AsyncStorage.getItem("musicOn");
      const isSoundsOn = await AsyncStorage.getItem("gameSounds");

      if (menuMusic.sound) await menuMusic.sound.unloadAsync();

      if (!isSoundsOn) {
        await AsyncStorage.setItem("gameSounds", "true");
      }

      if (!isMusicOn) {
        await AsyncStorage.setItem("musicOn", "true");
      }

      if (!pathname) {
        console.log("No Pathname");
        return;
      }

      try {
        const { sound } = await Audio.Sound.createAsync(
          Musics[pathname as keyof typeof Musics],
          {
            shouldPlay: isMusicOn === "true",
            isLooping: true,
          }
        );

        if (isMounted.current) {
          setMenuMusic({ sound: sound, isActive: isMusicOn === "true" });
          setGameSounds(isSoundsOn === "true");
        }
      } catch (error) {
        console.error("Error loading music:", error);
      }
    }

    loadAndPlayMusic();

    return () => {
      isMounted.current = false; // Component is unmounted
      menuMusic.sound
        ?.unloadAsync()
        .catch((error) => console.error("Error unloading music:", error));
    };
  }, [pathname]);

  const handleMusicChange = (checked: boolean) => {
    console.log("handleMusicChange", checked);
    handleMenuOptions(checked, "Music");
  };

  const handleGameSoundChange = (checked: boolean) => {
    console.log("handleGameSoundChange", checked);
    handleMenuOptions(checked, "Sound");
  };

  return (
    <Music.Provider
      value={{
        menuMusic,
        gameSounds,
        handleMusicChange,
        handleGameSoundChange,
      }}
    >
      {children}
    </Music.Provider>
  );
};

export { MusicProvider, Music };
