import React, { createContext, useEffect, useState } from "react";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { playSound } from "@/utils/playSound";
import { set } from "@react-native-firebase/database";

type Sound = Audio.Sound | null;

interface SoundsContext {
  playDraw: () => Promise<void>;
  playDelete: () => Promise<void>;
  playPullBack: () => Promise<void>;
  playPutOn: () => Promise<void>;
  playClickDefault: () => Promise<void>;
  playClickOne: () => Promise<void>;
  playClickTwo: () => Promise<void>;
  playClickThree: () => Promise<void>;
  playClickFour: () => Promise<void>;
  playClickFive: () => Promise<void>;
  playClickSix: () => Promise<void>;
  playClickSeven: () => Promise<void>;
  playPointOne: () => Promise<void>;
  playPointTwo: () => Promise<void>;
  setVolumeForSounds: (volume: number) => void;
  loading: boolean;
}

const Sounds = createContext<null | SoundsContext>(null);

type Props = {
  children: React.ReactNode;
};

const SoundProvider = ({ children }: Props) => {
  const [loading, setLoading] = useState(true);
  const [draw, setDraw] = useState<Sound>(null);
  const [deleteCard, setDeleteCard] = useState<Sound>(null);
  const [putOn, setPutOn] = useState<Sound>(null);
  const [pullBack, setPullBack] = useState<Sound>(null);
  const [clickDefault, setClickDefault] = useState<Sound>(null);
  const [clickSoundOne, setClickSoundOne] = useState<Sound>(null);
  const [clickSoundTwo, setClickSoundTwo] = useState<Sound>(null);
  const [clickSoundThree, setClickSoundThree] = useState<Sound>(null);
  const [clickSoundFour, setClickSoundFour] = useState<Sound>(null);
  const [clickSoundFive, setClickSoundFive] = useState<Sound>(null);
  const [clickSoundSix, setClickSoundSix] = useState<Sound>(null);
  const [clickSoundSeven, setClickSoundSeven] = useState<Sound>(null);
  const [pointOne, setPointOne] = useState<Sound>(null);
  const [pointTwo, setPointTwo] = useState<Sound>(null);

  function setVolumeForSounds(volume: number) {
    draw && draw.setVolumeAsync(volume);

    deleteCard && deleteCard.setVolumeAsync(volume);

    putOn && putOn.setVolumeAsync(volume);

    pullBack && pullBack.setVolumeAsync(volume);

    clickDefault && clickDefault.setVolumeAsync(volume);

    clickSoundOne && clickSoundOne.setVolumeAsync(volume);

    clickSoundTwo && clickSoundTwo.setVolumeAsync(volume);

    clickSoundThree && clickSoundThree.setVolumeAsync(volume);

    clickSoundFour && clickSoundFour.setVolumeAsync(volume);

    clickSoundFive && clickSoundFive.setVolumeAsync(volume);

    clickSoundSix && clickSoundSix.setVolumeAsync(volume);

    clickSoundSeven && clickSoundSeven.setVolumeAsync(volume);

    pointOne && pointOne.setVolumeAsync(volume);

    pointTwo && pointTwo.setVolumeAsync(volume);
  }

  async function loadSounds() {
    const soundPromises = [
      Audio.Sound.createAsync(
        require("@/assets/sound-effects/point-1.wav")
      ).then(async ({ sound }) => {
        await sound.setIsMutedAsync(false);
        setPointOne(sound);
      }),
      Audio.Sound.createAsync(
        require("@/assets/sound-effects/point-2.wav")
      ).then(async ({ sound }) => {
        await sound.setIsMutedAsync(false);
        setPointTwo(sound);
      }),
      Audio.Sound.createAsync(require("@/assets/sound-effects/click.wav")).then(
        async ({ sound }) => {
          await sound.setIsMutedAsync(false);
          setClickDefault(sound);
        }
      ),
      Audio.Sound.createAsync(
        require("@/assets/sound-effects/click-1.wav")
      ).then(async ({ sound }) => {
        await sound.setIsMutedAsync(false);
        setClickSoundOne(sound);
      }),
      Audio.Sound.createAsync(
        require("@/assets/sound-effects/click-2.wav")
      ).then(async ({ sound }) => {
        await sound.setIsMutedAsync(false);
        setClickSoundTwo(sound);
      }),
      Audio.Sound.createAsync(
        require("@/assets/sound-effects/click-3.wav")
      ).then(async ({ sound }) => {
        await sound.setIsMutedAsync(false);
        setClickSoundThree(sound);
      }),
      Audio.Sound.createAsync(
        require("@/assets/sound-effects/click-4.wav")
      ).then(async ({ sound }) => {
        await sound.setIsMutedAsync(false);
        setClickSoundFour(sound);
      }),
      Audio.Sound.createAsync(
        require("@/assets/sound-effects/click-5.wav")
      ).then(async ({ sound }) => {
        await sound.setIsMutedAsync(false);
        setClickSoundFive(sound);
      }),
      Audio.Sound.createAsync(
        require("@/assets/sound-effects/click-6.wav")
      ).then(async ({ sound }) => {
        await sound.setIsMutedAsync(false);
        setClickSoundSix(sound);
      }),
      Audio.Sound.createAsync(
        require("@/assets/sound-effects/click-7.wav")
      ).then(async ({ sound }) => {
        await sound.setIsMutedAsync(false);
        setClickSoundSeven(sound);
      }),
      Audio.Sound.createAsync(
        require("@/assets/sound-effects/draw-card.wav")
      ).then(async ({ sound }) => {
        await sound.setIsMutedAsync(false);
        setDraw(sound);
      }),
      Audio.Sound.createAsync(
        require("@/assets/sound-effects/delete-card.wav")
      ).then(async ({ sound }) => {
        await sound.setIsMutedAsync(false);
        setDeleteCard(sound);
      }),
      Audio.Sound.createAsync(
        require("@/assets/sound-effects/put-on.wav")
      ).then(async ({ sound }) => {
        await sound.setIsMutedAsync(false);
        setPutOn(sound);
      }),
      Audio.Sound.createAsync(
        require("@/assets/sound-effects/draw-card.wav")
      ).then(async ({ sound }) => {
        await sound.setIsMutedAsync(false);
        setPullBack(sound);
      }),
    ];

    await Promise.all(soundPromises).then(() => {
      setLoading(false);
    });
  }

  async function playPointOne() {
    if (pointOne) playSound(pointOne);
  }

  async function playPointTwo() {
    if (pointTwo) playSound(pointTwo);
  }

  async function playClickDefault() {
    if (clickDefault) playSound(clickDefault);
  }

  async function playClickOne() {
    if (clickSoundOne) playSound(clickSoundOne);
  }

  async function playClickTwo() {
    if (clickSoundOne) playSound(clickSoundTwo);
  }

  async function playClickThree() {
    if (clickSoundOne) playSound(clickSoundThree);
  }
  async function playClickFour() {
    if (clickSoundOne) playSound(clickSoundFour);
  }
  async function playClickFive() {
    if (clickSoundOne) playSound(clickSoundFive);
  }

  async function playClickSix() {
    if (clickSoundOne) playSound(clickSoundSix);
  }

  async function playClickSeven() {
    if (clickSoundOne) playSound(clickSoundSeven);
  }

  async function playDraw() {
    if (draw) playSound(draw);
  }

  async function playDelete() {
    if (deleteCard) playSound(deleteCard);
  }
  async function playPullBack() {
    if (pullBack) playSound(pullBack);
  }
  async function playPutOn() {
    if (putOn) playSound(putOn);
  }

  useEffect(() => {
    loadSounds();
    async function startSounds() {
      const gameSounds = await AsyncStorage.getItem("gameSounds");
      switch (gameSounds) {
        case "true":
          setVolumeForSounds(1);
          break;
        case "false":
          setVolumeForSounds(0);
          break;

        default:
          setVolumeForSounds(1);
          break;
      }
    }

    startSounds();

    return () => {
      draw && draw.unloadAsync();
      deleteCard && deleteCard.unloadAsync();
      pullBack && pullBack.unloadAsync();
      putOn && putOn.unloadAsync();
      clickDefault && clickDefault.unloadAsync();
      clickSoundOne && clickSoundOne.unloadAsync();
      clickSoundTwo && clickSoundTwo.unloadAsync();
      clickSoundThree && clickSoundThree.unloadAsync();
      clickSoundFour && clickSoundFour.unloadAsync();
      clickSoundFive && clickSoundFive.unloadAsync();
      clickSoundSix && clickSoundSix.unloadAsync();
      clickSoundSeven && clickSoundSeven.unloadAsync();
      pointOne && pointOne.unloadAsync();
      pointTwo && pointTwo.unloadAsync();
    };
  }, []);

  return (
    <Sounds.Provider
      value={{
        playDraw,
        playDelete,
        playPullBack,
        playPutOn,
        playClickDefault,
        playClickOne,
        playClickTwo,
        playClickThree,
        playClickFour,
        playClickFive,
        playClickSix,
        playClickSeven,
        setVolumeForSounds,
        playPointOne,
        playPointTwo,
        loading,
      }}
    >
      {children}
    </Sounds.Provider>
  );
};

export { SoundProvider, Sounds };
