import { useCallback, useEffect, useRef, useState } from "react";

type SpeechState =
  | "idle"
  | "ready"
  | "error"
  | "loading"
  | "paused"
  | "speaking";

export function useSpeech() {
  const [speechState, setSpeechState] = useState<SpeechState>("loading");
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const synthRef = useRef(window.speechSynthesis);
  const unlocked = useRef(false);
  //
  const isSpeechIdle = speechState === "idle";
  const isSpeechError = speechState === "error";
  const isSpeaking = speechState === "speaking";
  const isSpeechReady = speechState === "ready";
  const isSpeechPaused = speechState === "paused";
  const isSpeechLoading = speechState === "loading";

  // load voices
  useEffect(() => {
    const synth = synthRef.current;
    
    if(!synth)  return

    const load = () => {
      const v = synth.getVoices();
      if (v.length > 0) {
        voicesRef.current = v;
        setSpeechState("ready");
      }
    };

    load();
    synth.addEventListener("voiceschanged", load);

    const poll = setInterval(load, 300);
    setTimeout(() => clearInterval(poll), 4000);

    return () => {
      clearInterval(poll);
      synth.removeEventListener("voiceschanged", load);
    };
  }, []);

  /**
   *
   *
   */
  const unlockSpeech = () => {
    if (unlocked.current) return true;
    const u = new SpeechSynthesisUtterance("");
    u.volume = 0;
    synthRef.current.speak(u);
    synthRef.current.cancel();
    unlocked.current = true;
    return false;
  };
  /**
   *
   */
  const pickVoice = useCallback((lang: string) => {
    const v = voicesRef.current;
    return (
      v.find((x) => x.lang.startsWith(lang)) ||
      v.find((x) => x.lang.startsWith("en")) ||
      v[0]
    );
  }, []);
  /**
   *
   */
  const stopSpeaking = useCallback(() => {
    const synth = synthRef.current;
    synth.cancel();
    setSpeechState("ready");
  }, []);
  /**
   *
   */
  const pauseSpeaking = useCallback(() => {
    const synth = synthRef.current;
    if (speechState === "speaking") {
      synth.pause();
      setSpeechState("paused");
    }
  }, [speechState]);

  const resumeSpeaking = useCallback(() => {
    const synth = synthRef.current;
    if (speechState === "paused") {
      synth.resume();
      setSpeechState("speaking");
    }
  }, [speechState]);

  const speak = useCallback(
    (text: string, lang: string) => {
      const synth = synthRef.current;

      if (!unlocked.current) {
        unlockSpeech();
        return { status: "unlock" };
      }

      if (voicesRef.current.length === 0) {
        setSpeechState("loading");
        return { status: "loading" };
      }

      synth.cancel();

      const u = new SpeechSynthesisUtterance(text);
      u.voice = pickVoice(lang);
      u.lang = u.voice.lang;

      u.onstart = () => setSpeechState("speaking");
      u.onend = () => setSpeechState("ready");
      u.onerror = () => setSpeechState("error");

      synth.speak(u);
      return { status: "speaking" };
    },
    [pickVoice],
  );

  const toggleSpeak = useCallback(
    (text: string, lang: string = "en") => {
      const synth = synthRef.current;

      if (speechState === "speaking") {
        synth.pause();
        setSpeechState("paused");
        return;
      }

      if (speechState === "paused") {
        synth.resume();
        setSpeechState("speaking");
        return;
      }

      speak(text, lang);
    },
    [speechState, speak],
  );

  return {
    speak,
    pickVoice,
    isSpeaking,
    isSpeechIdle,
    isSpeechError,
    isSpeechLoading,
    isSpeechPaused,
    isSpeechReady,
    toggleSpeak,
    unlockSpeech,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    speechState,
  };
}
