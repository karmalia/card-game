import { createContext, useContext, useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePathname } from "expo-router";
import { Sounds } from "./SoundProvider";

interface MusicContext {
  gameSounds: boolean;

  handleGameSoundChange: (checked: boolean) => void;
}

const Music = createContext<null | MusicContext>(null);

type Props = {
  children: React.ReactNode;
};

const MusicProvider = ({ children }: Props) => {
  const { setVolumeForSounds } = useContext(Sounds)!;
  const pathname = usePathname();

  const [gameSounds, setGameSounds] = useState<boolean>(true);

  const handleMenuOptions = async (play: boolean) => {
    try {
      setGameSounds(play);
      await AsyncStorage.setItem("gameSounds", play ? "true" : "false");
      play ? setVolumeForSounds(1) : setVolumeForSounds(0);
    } catch (error) {
      console.error("Error handling game sounds:", error);
    }
  };

  useEffect(() => {
    async function loadAndPlayMusic() {
      const isSoundsOn = await AsyncStorage.getItem("gameSounds");

      if (!isSoundsOn || isSoundsOn === "true") {
        await AsyncStorage.setItem("gameSounds", "true");
        setGameSounds(true);
      }

      if (isSoundsOn === "false") {
        setVolumeForSounds(0);
        setGameSounds(false);
      }

      if (!pathname) {
        console.log("No Pathname");
        return;
      }
    }

    loadAndPlayMusic();
  }, [pathname]);

  const handleGameSoundChange = (checked: boolean) => {
    handleMenuOptions(checked);
  };

  return (
    <Music.Provider
      value={{
        gameSounds,
        handleGameSoundChange,
      }}
    >
      {children}
    </Music.Provider>
  );
};
const useMusicContext = () => {
  const context = useContext(Music);
  if (!context) {
    throw new Error("useMusicContext must be used within a MusicProvider");
  }
  return context;
};
export { MusicProvider, Music, useMusicContext };
