import React, { createContext, useContext, useEffect, useState } from "react";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { playSound } from "@/utils/playSound";
import { set } from "@react-native-firebase/database";

interface SoundPack {
  status: boolean;
  loading: boolean;
  draw: Audio.Sound | null;
  deleteCard: Audio.Sound | null;
  putOn: Audio.Sound | null;
  pullBack: Audio.Sound | null;
  clickDefault: Audio.Sound | null;
  clickSoundOne: Audio.Sound | null;
  clickSoundTwo: Audio.Sound | null;
  clickSoundThree: Audio.Sound | null;
  clickSoundFour: Audio.Sound | null;
  clickSoundFive: Audio.Sound | null;
  clickSoundSix: Audio.Sound | null;
  clickSoundSeven: Audio.Sound | null;
  pointOne: Audio.Sound | null;
  pointTwo: Audio.Sound | null;
}

interface SoundsContext {
  playSound: (sound: keyof SoundPack) => Promise<void>;
  gameSounds: SoundPack;
  setVolumeForSounds: (volume: boolean) => void;
  loading: boolean;
}

const Sounds = createContext<null | SoundsContext>(null);

type Props = {
  children: React.ReactNode;
};

const SoundProvider = ({ children }: Props) => {
  const [gameSounds, setGameSounds] = useState<SoundPack>({
    status: true,
    loading: true,
    draw: null,
    deleteCard: null,
    putOn: null,
    pullBack: null,
    clickDefault: null,
    clickSoundOne: null,
    clickSoundTwo: null,
    clickSoundThree: null,
    clickSoundFour: null,
    clickSoundFive: null,
    clickSoundSix: null,
    clickSoundSeven: null,
    pointOne: null,
    pointTwo: null,
  });

  async function setVolumeForSounds(volume: boolean) {
    console.log("setVolumeForSounds", volume);
    try {
      const sounds = Object.values(gameSounds).filter(
        (sound): sound is Audio.Sound => sound instanceof Audio.Sound
      );
      await Promise.all(
        sounds.map((sound) => sound.setVolumeAsync(volume ? 1 : 0))
      );
      setGameSounds((prev) => ({ ...prev, status: volume }));
    } catch (error) {
      console.error("Error setting volume:", error);
    }
  }

  async function loadSounds() {
    try {
      const soundFiles = {
        pointOne: require("@/assets/sound-effects/point-1.wav"),
        pointTwo: require("@/assets/sound-effects/point-2.wav"),
        clickDefault: require("@/assets/sound-effects/click.wav"),
        clickSoundOne: require("@/assets/sound-effects/click-1.wav"),
        clickSoundTwo: require("@/assets/sound-effects/click-2.wav"),
        clickSoundThree: require("@/assets/sound-effects/click-3.wav"),
        clickSoundFour: require("@/assets/sound-effects/click-4.wav"),
        clickSoundFive: require("@/assets/sound-effects/click-5.wav"),
        clickSoundSix: require("@/assets/sound-effects/click-6.wav"),
        clickSoundSeven: require("@/assets/sound-effects/click-7.wav"),
        draw: require("@/assets/sound-effects/draw-card.wav"),
        deleteCard: require("@/assets/sound-effects/delete-card.wav"),
        putOn: require("@/assets/sound-effects/put-on.wav"),
        pullBack: require("@/assets/sound-effects/draw-card.wav"),
      };

      const loadedSounds = await Promise.all(
        Object.entries(soundFiles).map(async ([key, file]) => {
          const { sound } = await Audio.Sound.createAsync(file);
          await sound.setIsMutedAsync(false);
          return [key, sound];
        })
      );

      setGameSounds((prev) => ({
        ...prev,
        ...Object.fromEntries(loadedSounds),
        loading: false,
      }));
    } catch (error) {
      console.error("Error loading sounds:", error);
      setGameSounds((prev) => ({ ...prev, loading: false }));
    }
  }

  async function playSound(soundKey: keyof SoundPack) {
    try {
      const sound = gameSounds[soundKey];
      if (!sound) return;

      if (typeof soundKey === "boolean") return;

      await sound.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  }

  useEffect(() => {
    async function initAudio() {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });

        await loadSounds();

        const gameSoundsEnabled = await AsyncStorage.getItem("gameSounds");
        const volume = gameSoundsEnabled === "false" ? false : true;
        await setVolumeForSounds(volume);
      } catch (error) {
        console.error("Error initializing audio:", error);
      }
    }

    initAudio();

    return () => {
      // Cleanup sounds on unmount
      Object.values(gameSounds)
        .filter((sound): sound is Audio.Sound => sound instanceof Audio.Sound)
        .forEach((sound) => sound.unloadAsync());
    };
  }, []);

  return (
    <Sounds.Provider
      value={{
        playSound,
        setVolumeForSounds,
        gameSounds,
        loading: gameSounds.loading,
      }}
    >
      {children}
    </Sounds.Provider>
  );
};

const useSound = () => {
  const context = useContext(Sounds);
  if (!context) {
    throw new Error("useMusicContext must be used within a MusicProvider");
  }
  return context;
};

export { SoundProvider, Sounds, useSound };
