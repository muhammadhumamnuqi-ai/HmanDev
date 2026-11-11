"use client";

import { useEffect, useRef, useState } from "react";
import {
  FaDiscord,
  FaYoutube,
  FaGlobe,
  FaGithub,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";

import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { Playfair_Display } from "next/font/google";
import { Outfit } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

type LanyardData = {
  discord_status: "online" | "idle" | "dnd" | "offline";
  listening_to_spotify: boolean;
  spotify?: {
    song: string;
    artist: string;
  };
  discord_user: {
    id: string;
    username: string;
    avatar: string;
    avatar_decoration_data?: {
      asset: string;
    };
  };
};

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [presence, setPresence] = useState<LanyardData | null>(null);
  const [muted, setMuted] = useState(true);
  const [particlesReady, setParticlesReady] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const displayName = "Hmam";

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setParticlesReady(true);
    });
  }, []);

  // Public profile: display Discord presence using hardcoded user ID
  const userId = "709138329228017837"; // Hmam's Discord user ID

  useEffect(() => {
    fetch(`https://api.lanyard.rest/v1/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          setPresence(data.data);
        }
      })
      .catch(() => {
        setPresence(null);
      });
  }, [userId]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = muted;
    videoRef.current.volume = muted ? 0 : 0.5;
  }, [muted]);

  useEffect(() => {
    if (!entered || !videoRef.current) return;
    const video = videoRef.current;
    // Play muted first (always allowed by browsers)
    video.muted = true;
    video.volume = 0;
    video.play().then(() => {
      // After playback starts, try to unmute
      video.muted = false;
      video.volume = 0.5;
      setMuted(false);
    }).catch(() => {
      // Stay muted if browser still blocks
      setMuted(true);
    });
  }, [entered]);

  const handleEnter = () => {
    setEntered(true);
  };

  const statusColor = {
    online: "bg-green-500",
    idle: "bg-yellow-400",
    dnd: "bg-red-500",
    offline: "bg-gray-500",
  };

  const avatarUrl =
    presence?.discord_user?.avatar
      ? `https://cdn.discordapp.com/avatars/${presence.discord_user.id}/${presence.discord_user.avatar}.png?size=256`
      : null;

  const decorationUrl =
    presence?.discord_user?.avatar_decoration_data?.asset
      ? `https://cdn.discordapp.com/avatar-decoration-presets/${presence.discord_user.avatar_decoration_data.asset}.png?size=512`
      : null;

  if (!entered) {
    return (
      <div
        onClick={handleEnter}
        className="flex min-h-screen items-center justify-center bg-black text-white cursor-pointer"
      >
        <h1 className="text-xl sm:text-3xl tracking-widest animate-pulse px-6 text-center">
          CLICK TO ENTER...
        </h1>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <video
        ref={videoRef}
        src="/media/background.mp4"
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover -z-20"
      />

      <div className="absolute inset-0 bg-black/70 -z-10" />

      <button
        onClick={() => setMuted(!muted)}
        className="absolute top-3 right-3 sm:top-5 sm:right-5 z-30 bg-black/50 backdrop-blur-md p-2 sm:p-3 rounded-full border border-white/20 hover:scale-110 transition"
      >
        {muted ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
      </button>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 py-6">
        <div className="relative w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border-2 border-white/30 shadow-xl z-10"
            />
          )}

          {decorationUrl && (
            <img
              src={decorationUrl}
              alt="decoration"
              className="absolute w-24 h-24 sm:w-36 sm:h-36 object-contain pointer-events-none z-20"
            />
          )}

          {presence && (
            <span
              className={`absolute bottom-0 right-0 sm:bottom-1 sm:right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-black z-30 ${
                statusColor[presence.discord_status]
              }`}
            />
          )}
        </div>

        {/* 🔥 NAME WITH SMALLER PARTICLES */}
        <div className="relative mt-2 sm:mt-4 w-full max-w-[180px] sm:max-w-xs h-14 sm:h-20 flex items-center justify-center">
          {particlesReady && (
            <Particles
              id="nameParticles"
              className="absolute inset-0 w-full h-full"
              options={{
                fullScreen: false,
                background: { color: "transparent" },
                particles: {
                  number: { value: 40 }, // lebih sedikit
                  size: { value: { min: 0.3, max: 0.8 } }, // 🔥 lebih kecil
                  move: {
                    enable: true,
                    speed: 0.6,
                    direction: "none",
                    random: true,
                    straight: false,
                    outModes: "bounce",
                  },
                  opacity: {
                    value: { min: 0.4, max: 0.8 },
                    animation: {
                      enable: true,
                      speed: 0.8,
                      sync: false,
                    },
                  },
                  color: {
                    value: "#ffffff",
                  },
                },
              }}
            />
          )}

          <h1
            className={`${playfair.className} text-3xl sm:text-5xl font-bold tracking-wider relative z-10`}
            style={{
              textShadow:
                "0 0 8px rgba(255,255,255,0.9), 0 0 16px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.4)",
            }}
          >
            {displayName}
          </h1>
        </div>

        <p className={`${outfit.className} text-xs sm:text-lg font-light tracking-widest text-white/80 mt-1 sm:mt-3 uppercase`} style={{
          letterSpacing: "0.15em",
          textShadow: "0 0 10px rgba(255,255,255,0.3)"
        }}>
          Fullstack Development
        </p>

        {presence && (
          <div className="mt-3 sm:mt-5 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl px-3 py-2 sm:px-6 sm:py-4 flex items-center gap-2 sm:gap-4 shadow-xl w-full max-w-[260px] sm:max-w-xs">
            {avatarUrl && (
              <div className="relative flex-shrink-0">
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="w-9 h-9 sm:w-12 sm:h-12 rounded-full"
                />
                <span
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-black ${
                    statusColor[presence.discord_status]
                  }`}
                />
              </div>
            )}

            <div className="text-left min-w-0">
              <h2 className="text-sm sm:text-base font-semibold truncate">
                {presence.discord_user.username}
              </h2>

              <p className="text-xs text-white/60 capitalize">
                {presence.discord_status === "offline"
                  ? "last seen recently"
                  : presence.discord_status}
              </p>
            </div>
          </div>
        )}

        {presence?.listening_to_spotify && presence.spotify && (
          <div className="mt-2 sm:mt-3 bg-green-500/20 px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-lg border border-green-500/40 text-xs sm:text-sm w-full max-w-[260px] sm:max-w-xs text-center">
            🎵 {presence.spotify.song} - {presence.spotify.artist}
          </div>
        )}

        <div className="flex gap-4 sm:gap-6 text-lg sm:text-2xl mt-4 sm:mt-6 text-white/80">
          <a 
            href="YOUR_DISCORD_URL" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <FaDiscord />
          </a>
          <a 
            href="https://www.youtube.com/@HmamNuqi" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <FaYoutube />
          </a>
          <a 
            href="https://www.linkedin.com/in/muhammad-humam-nuqi-117612383/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <FaGlobe />
          </a>
          <a 
            href="https://github.com/HmamSr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <FaGithub />
          </a>
        </div>
      </div>
    </div>
  );
}
