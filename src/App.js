import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [onLoadScreen, setOnLoadScreen] = useState(true);
  const [animationStep, setAnimationStep] = useState(0);
  const [emojiIndex, setEmojiIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [fallingEmojis, setFallingEmojis] = useState([]);
  const [audio] = useState(new Audio('https://ia902808.us.archive.org/26/items/ClairDeLunedebussy/2009-03-30-clairdelune.mp3'));

  useEffect(() => {
    const handleResize = () => {
      const isMobileSize = window.innerWidth <= 768;
      setIsMobile(isMobileSize);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      const maxWidth = window.innerWidth * (isMobile ? 0.9 : 0.4);
      const maxHeight = window.innerHeight * 0.7;
      let width = maxWidth;
      let height = width / aspectRatio;

      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }

      setDimensions({ width, height });
    };
    img.src = 'frog.png';
  }, [isMobile]);

  useEffect(() => {
    if (animationStep > 0 && animationStep <= 3) {
      const timer = setTimeout(() => {
        setAnimationStep(prev => prev + 1);
      }, 1700);
      return () => clearTimeout(timer);
    } else if (animationStep > 3) {
      setOnLoadScreen(false);
    }
  }, [animationStep]);

  useEffect(() => {
    const scaleTimer = setInterval(() => {
      setEmojiIndex(prevIndex => (prevIndex + 1) % 4);
    }, 500);
    return () => clearInterval(scaleTimer);
  }, []);

  useEffect(() => {
    if (!onLoadScreen) {
      const createFallingEmoji = () => {
        const emojis = ['🐸', '☕'];
        const newEmoji = {
          id: Date.now(),
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
          left: Math.random() * 100,
          animationDuration: 3 + Math.random() * 2,
        };
        setFallingEmojis(prevEmojis => [...prevEmojis, newEmoji]);

        setTimeout(() => {
          setFallingEmojis(prevEmojis => prevEmojis.filter(emoji => emoji.id !== newEmoji.id));
        }, newEmoji.animationDuration * 1000);
      };

      const intervalId = setInterval(createFallingEmoji, 200);
      return () => clearInterval(intervalId);
    }
  }, [onLoadScreen]);

  const handleEmojiClick = () => {
    if (animationStep === 0) {
      playMusic();
    }
    setAnimationStep(1);
  };

  const playMusic = () => {
    audio.currentTime = 0;
    audio.play().catch(error => {
      console.error('Audio playback error:', error);
    });
  };

  const renderFrame = () => (
    <div className="relative" style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}>
      {/* Outer frame */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-600 via-yellow-500 to-yellow-600 rounded-lg shadow-2xl"></div>

      {/* Inner frame details */}
      <div className="absolute inset-1 bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-400 rounded-lg"></div>
      <div className="absolute inset-2 bg-gradient-to-br from-yellow-600 via-yellow-500 to-yellow-600 rounded-lg"></div>
      <div className="absolute inset-3 bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-400 rounded-lg"></div>

      {/* Ornate corner decorations */}
      {[
        "top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"
      ].map((position, index) => (
        <div key={index} className={`absolute w-8 h-8 ${position}`}>
          <div className="absolute inset-0 bg-yellow-600 rounded-full transform rotate-45"></div>
          <div className="absolute inset-0.5 bg-yellow-400 rounded-full transform rotate-45"></div>
          <div className="absolute inset-1 bg-yellow-600 rounded-full transform rotate-45"></div>
          <div className="absolute inset-1.5 bg-yellow-400 rounded-full"></div>
        </div>
      ))}

      {/* Ornate side decorations */}
      {[
        "top-1/2 left-0 -translate-y-1/2",
        "top-1/2 right-0 -translate-y-1/2",
        "left-1/2 top-0 -translate-x-1/2 rotate-90",
        "left-1/2 bottom-0 -translate-x-1/2 rotate-90"
      ].map((position, index) => (
        <div key={index} className={`absolute w-12 h-8 transform ${position}`}>
          <div className="absolute inset-0 bg-yellow-600 rounded-full"></div>
          <div className="absolute inset-0.5 bg-yellow-400 rounded-full"></div>
          <div className="absolute inset-1 bg-yellow-600 rounded-full"></div>
          <div className="absolute inset-1.5 bg-yellow-400 rounded-full"></div>
        </div>
      ))}

      {/* Image container */}
      <div className="absolute inset-4 bg-white rounded-lg shadow-inner overflow-hidden">
        <img src="frog.png" alt="Masterpiece Artwork" className="w-full h-full object-cover" />
      </div>

      {/* Frame texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-transparent to-yellow-600/20 rounded-lg pointer-events-none"></div>
    </div>
  );

  return (
    <div className={`h-[100vh] w-screen flex justify-center items-center ${onLoadScreen ? 'bg-black' : 'bg-green-400'} font-custom relative overflow-hidden`}>
      {onLoadScreen ? (
        <div className={`flex flex-col items-center justify-center h-full ${onLoadScreen ? 'text-white' : 'text-black'}`}>
          {animationStep === 0 ? (
            <>
              <div className="text-6xl mb-4 space-x-2">
                {['🐸', '☕'].map((emoji, index) => (
                  <span
                    key={index}
                    role="button"
                    onClick={handleEmojiClick}
                    className={`cursor-pointer mx-2 transition-transform duration-500 ${
                      emojiIndex === index ? 'scale-105' : 'scale-100'
                    }`}
                  >
                    {emoji}
                  </span>
                ))}
              </div>
              <div className="text-gray-500 text-base absolute top-7">
                {isMobile ? 'Tap one' : 'Click one'}
              </div>
            </>
          ) : (
            <>
              {animationStep === 1 && (
                <div className="text-5xl text-center tracking-tight">
                  we present to you
                </div>
              )}
              {animationStep === 2 && (
                <div className="text-5xl text-center">
                  a true masterpiece
                </div>
              )}
              {animationStep === 3 && (
                <div className="text-[51px] text-center">
                  frogman
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <>
          <div className="absolute bottom-2 left-2 md:flex items-center space-x-2 bg-opacity-80 p-2 rounded-lg fade-in hidden">
            <img src="frog.png" alt="Artist" className="size-14 rounded-full object-cover" />
            <span className="text-base text-gray-800 font-semibold">• mr frog</span>
          </div>
          <div className='flex absolute bottom-4 right-4 md:bottom-7 md:right-7 space-x-2'>
            <a href="https://x.com/solfrogman">
              Twitter
            </a>
            <a href="https://t.me/frogmanportal">
              Telegram
            </a>
          </div>
          <div className='md:flex gap-4 hidden'>
            <div className="spin-in">
              {renderFrame()}
            </div>
            <div className='text-6xl'>
              frogman
              <div className='text-lg'>
                (circa 2024)
              </div>
              <div className='text-base max-w-[300px]'>   
                "frogman" embodies the clashing between art and memes. we share this with you to be tokenized on 
                Solana forever
              </div>
            </div>
          </div>
          <div className='gap-1 md:hidden'>
            <div className='flex justify-center mb-4'>
              <div className="spin-in">
                {renderFrame()}
              </div>
            </div>
            <div className='text-6xl text-center'>
              frogman
              <div className='text-lg'>
                (circa 2024)
              </div>
            </div>
          </div>
          <div className='absolute top-5 text-[10px] md:text-base'>CA: updating..</div>
          <div className="spotlight-overlay fade-in"></div>
          {fallingEmojis.map(emoji => (
            <div
              key={emoji.id}
              className="absolute text-3xl"
              style={{
                top: '-3rem',
                left: `${emoji.left}%`,
                animation: `fall ${emoji.animationDuration}s linear forwards`,
              }}
            >
              {emoji.emoji}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default App;