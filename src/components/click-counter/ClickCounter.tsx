import React, { useState, useRef, useEffect } from 'react';

const KILL_STREAKS = {
  10: "FIRST BLOOD!",
  20: "DOUBLE KILL!",
  40: "TRIPLE KILL!",
  60: "ULTRA KILL!",
  80: "RAMPAGE!",
  100: "KILLING SPREE!",
  120: "DOMINATING!",
  140: "MEGA KILL!",
  160: "UNSTOPPABLE!",
  180: "WICKED SICK!",
  200: "MONSTER KILL!",
  220: "GODLIKE!",
  240: "HOLY SHIT!",
  260: "OWNAGE!"
};

const ANNOUNCER_SOUNDS = {
  10: "/announcer/firstblood.mpeg",
  20: "/announcer/doublekill.mpeg",
  40: "/announcer/triplekill.mpeg",
  60: "/announcer/ultrakill.mpeg",
  80: "/announcer/rampage.mpeg",
  100: "/announcer/killingspree.mpeg",
  120: "/announcer/dominating.mpeg",
  140: "/announcer/megakill.mpeg",
  160: "/announcer/unstop.mpeg",
  180: "/announcer/wickedsick.mpeg",
  200: "/announcer/monsterkill.mpeg",
  220: "/announcer/godlike.mpeg",
  240: "/announcer/holyshit.mpeg",
  260: "/announcer/ownage.mpeg"
};

const ClickCounter: React.FC = () => {
  const [clickCount, setClickCount] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const announcerSoundRef = useRef<HTMLAudioElement | null>(null);
  const announcementTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Initialize click sound
    clickSoundRef.current = new Audio('music/click.mp3');
    clickSoundRef.current.volume = 0.1;
    // Preload the audio
    clickSoundRef.current.load();

    // Initialize announcer sound
    announcerSoundRef.current = new Audio();
    announcerSoundRef.current.volume = 0.1;
  }, []);

  const playAnnouncerSound = async (threshold: number) => {
    if (announcerSoundRef.current && threshold in ANNOUNCER_SOUNDS) {
      try {
        announcerSoundRef.current.src = ANNOUNCER_SOUNDS[threshold as keyof typeof ANNOUNCER_SOUNDS];
        announcerSoundRef.current.currentTime = 0;
        await announcerSoundRef.current.play();
      } catch (err) {
        console.log('Error playing announcer sound:', err);
      }
    }
  };

  // Separate effect for handling announcements
  useEffect(() => {
    if (clickCount >= 10 && (clickCount === 10 || clickCount % 20 === 0)) {
      const threshold = Math.min(clickCount, 260);
      if (threshold in KILL_STREAKS) {
        // Clear any existing timeout
        if (announcementTimeoutRef.current) {
          clearTimeout(announcementTimeoutRef.current);
        }
        
        setAnnouncement(KILL_STREAKS[threshold as keyof typeof KILL_STREAKS]);
        playAnnouncerSound(threshold);
        
        // Set new timeout
        announcementTimeoutRef.current = setTimeout(() => {
          setAnnouncement(null);
        }, 3000);
      }
    }
  }, [clickCount]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (announcementTimeoutRef.current) {
        clearTimeout(announcementTimeoutRef.current);
      }
    };
  }, []);

  const playClickSound = async () => {
    if (clickSoundRef.current) {
      try {
        clickSoundRef.current.currentTime = 0;
        await clickSoundRef.current.play();
      } catch (err) {
        console.log('Error playing sound:', err);
      }
    }
  };

  const handleClick = () => {
    setClickCount(prev => prev + 1);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
    playClickSound();
    // Reset the reset-timer
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }
    resetTimeoutRef.current = setTimeout(() => {
      setClickCount(0);
    }, 500);
  };

  // Cleanup reset timer on unmount
  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="absolute top-4 left-4 z-20 flex flex-col items-start gap-2">
      <button
        onClick={handleClick}
        className={`glass-card glass-hover rounded-xl p-3 transition-transform ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        <span className="text-sm font-medium">Click me! : {clickCount}</span>
      </button>
      
      {announcement && (
        <div className="glass-card rounded-xl p-3 animate-fade-in">
          <span className="text-lg font-bold text-red-500">{announcement}</span>
        </div>
      )}
    </div>
  );
};

export default ClickCounter; 