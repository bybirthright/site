import { useState, useEffect, useRef } from 'react'
import { IoIosCheckmarkCircle, IoIosArrowBack, IoIosArrowForward, IoIosLink, IoIosSkipBackward, IoIosSkipForward, IoIosPause, IoIosPlay } from "react-icons/io";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import eldoradoLogo from './assets/eldorado.png'
import pfp from './assets/pfp.png'
import './App.css'

import s1 from './assets/tdt.mp3'
import s2 from './assets/do it for me.mp3'
import s3 from './assets/just not sure.mp3'
import s4 from './assets/something must be going on.mp3'
import s5 from './assets/and most importantly.mp3'

import musicImg from './assets/record-vinyl-solid.svg'

import ReactAudioPlayer from 'react-audio-player';

function App() {
  const playList = [
    {
      name: 'two door tiffany',
      writer: 'quinn',
      src: s1,
      musicImg: musicImg,
      id: 1
    },
    {
      name: 'do it for me',
      writer: 'ovine hall',
      musicImg: musicImg,
      src: s2,
      id: 2
    },
    {
      name: 'just not sure',
      writer: 'kurtains, glaive',
      musicImg: musicImg,
      src: s3,
      id: 3
    },
    {
      name: 'something must be going on',
      writer: 'kurtains',
      musicImg: musicImg,
      src: s4,
      id: 4
    },
    {
      name: 'and most importantly, have fun',
      writer: 'quinn',
      musicImg: musicImg,
      src: s5,
      id: 5
    }
  ]
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.25);
  const [shouldPlayNext, setShouldPlayNext] = useState(false);

  const playNextSong = () => {
    if (currentSongIndex < playList.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
    } else {
      // Loop back to the first song when the playlist ends
      setCurrentSongIndex(0);
    }
  };

  const playPreviousSong = () => {
    if (currentSongIndex > 0) {
      setCurrentSongIndex(currentSongIndex - 1);
    } else {
      // Go to the last song if at the beginning
      setCurrentSongIndex(playList.length - 1);
    }
  };

  const handleSongEnd = () => {
    playNextSong();
    setShouldPlayNext(true);
  };

  const togglePlayPause = () => {
    const audioElement = audioRef.current.audioEl.current;
    
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const audioElement = audioRef.current.audioEl.current;
    setCurrentTime(audioElement.currentTime);
    setDuration(audioElement.duration);
  };

  const handleSeek = (e) => {
    const audioElement = audioRef.current.audioEl.current;
    const progressBar = e.currentTarget;
    const clickPosition = (e.pageX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
    
    audioElement.currentTime = clickPosition * audioElement.duration;
    setCurrentTime(audioElement.currentTime);
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    const audioElement = audioRef.current.audioEl.current;
    
    audioElement.volume = newVolume;
    setVolume(newVolume);
  };

  // Format time (seconds) to MM:SS
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current?.audioEl?.current) {
        const audioElement = audioRef.current.audioEl.current;
        
        // If we should auto-play the next song or if we're currently playing
        if (shouldPlayNext || isPlaying) {
          try {
            // We need to wait for the audio to be loaded before playing
            audioElement.addEventListener('canplay', function onCanPlay() {
              audioElement.play()
                .then(() => setIsPlaying(true))
                .catch(err => {
                  console.error("Auto-play failed:", err);
                  setIsPlaying(false);
                });
              // Remove the event listener after it fires once
              audioElement.removeEventListener('canplay', onCanPlay);
            });
          } catch (err) {
            console.error("Error setting up auto-play:", err);
          }
        }
        
        // Reset the flag
        setShouldPlayNext(false);
      }
    };
    
    playAudio();
  }, [currentSongIndex, shouldPlayNext]);

  const currentSong = playList[currentSongIndex];
  const [currentPage, setCurrentPage] = useState(0);

  const navigatePage = (direction) => {
    if (direction === 'next' && currentPage < 1) {
      setCurrentPage(1);
    } else if (direction === 'prev' && currentPage > 0) {
      setCurrentPage(0);
    }
  };

  const renderFirstPage = () => (
    <ul class="list bg-base-100 rounded-box" id='links-card'>
      <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">Social Links</li>
      
      <li class="list-row">
        <div><img class="size-10 rounded-box" src="https://static.vecteezy.com/system/resources/previews/006/892/625/non_2x/discord-logo-icon-editorial-free-vector.jpg"/></div>
        <div>
          <div>@inrv</div>
          <div class="text-xs uppercase font-semibold opacity-60">Discord</div>
        </div>
        <button class="btn btn-square btn-ghost"
          onClick={(e) => {
            e.stopPropagation();
            window.open("https://discord.com/users/519925423795339275", "_blank");
          }}
        >
          <p className='size-9 max-h-4'><IoIosLink /></p>
        </button>
      </li>
      
      <li class="list-row">
        <div><img class="size-10 rounded-box" src="https://brandingstyleguides.com/wp-content/guidelines/2024/03/instagram.jpg"/></div>
        <div>
          <div>@inrv.cc</div>
          <div class="text-xs uppercase font-semibold opacity-60">Instagram</div>
        </div>
        <button class="btn btn-square btn-ghost"
          onClick={(e) => {
            e.stopPropagation();
            window.open("https://www.instagram.com/inrv.cc", "_blank");
          }}
        >
          <p className='size-9 max-h-4'><IoIosLink /></p>
        </button>
      </li>
      
      <li class="list-row">
        <div><img class="size-10 rounded-box" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt6DXuvit57V1DmjnlLcwst4O-sTL5D37gIQ&s"/></div>
        <div>
          <div>@bybirthright</div>
          <div class="text-xs uppercase font-semibold opacity-60">GitHub</div>
        </div>
        <button class="btn btn-square"
          onClick={(e) => {
            e.stopPropagation();
            window.open("https://www.github.com/bybirthright", "_blank");
          }}
        >
          <p className='size-9 max-h-4'><IoIosLink /></p>
        </button>
      </li>
    </ul>
  );

  const renderSecondPage = () => (
    <ul class="list bg-base-100 rounded-box" id='links-card'>
    <div>
      <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">Social Links</li>
      
      <li class="list-row">
        <div><img class="size-10 rounded-box" src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Roblox_Logo_2022.jpg"/></div>
        <div>
          <div>@iry</div>
          <div class="text-xs uppercase font-semibold opacity-60">Roblox</div>
        </div>
        <button class="btn btn-square btn-ghost"
          onClick={(e) => {
            e.stopPropagation();
            window.open("https://www.roblox.com/users/26563661/profile", "_blank");
          }}
        >
          <p className='size-9 max-h-4'><IoIosLink /></p>
        </button>
      </li>
      
      <li class="list-row">
        <div><img class="size-10 rounded-box" src="https://s3-eu-west-1.amazonaws.com/tpd/logos/65d72864bad5da55dd7ad69c/0x0.png"/></div>
        <div>
          <div>@inrv</div>
          <div class="text-xs uppercase font-semibold opacity-60">OGUsers</div>
        </div>
        <button class="btn btn-square btn-ghost"
          onClick={(e) => {
            e.stopPropagation();
            window.open("https://www.oguser.com/inrv", "_blank");
          }}
        >
          <p className='size-9 max-h-4'><IoIosLink /></p>
        </button>
      </li>
      
      <li class="list-row">
        <div><img class="size-10 rounded-box" src={eldoradoLogo}/></div>
        <div>
          <div>@inrv</div>
          <div class="text-xs uppercase font-semibold opacity-60">Eldorado</div>
        </div>
        <button class="btn btn-square btn-ghost"
          onClick={(e) => {
            e.stopPropagation();
            window.open("https://www.eldorado.gg/users/inrv", "_blank");
          }}
        >
          <p className='size-9 max-h-4'><IoIosLink /></p>
        </button>
      </li>
    </div>
    </ul>
  )

  return (
    <>
      <html data-theme="forest"></html>
      <div class = 'backdrop-blur-md backdrop-brightness-45 rounded-lg p-4 max-w-[419.1px]'>
        <div class="avatar">
          <div class="w-24 rounded-full">
            <img src={pfp} />
          </div>
        </div>
        <p className="text-3xl mt-2">@inrv <IoIosCheckmarkCircle className='text-blue-500 inline' /></p>
        <p className="text-xs mt-2.5 text-gray-400 font-mono">&gt; it is yours, by birthright</p>

        <div class="tabs tabs-border justify-center mt-2">
          <input type="radio" name="my_tabs_2" class="tab" aria-label="Home" defaultChecked/>
          <div class="tab-content border-base-300 bg-base-100 p-4 rounded-lg w-[387.1px] max-h-[326.533px]">
            <p className="">
              18, uk, m &lt;3< br/> <br/>
              slowsilver soldier baby             
            </p>

            <div id="playlist-card mt-4">
            <div className="divider">03 Radio</div>
                  <h2 className="card-title"></h2>
                  <div className='text-left mb-2'>
                    <p className="text-xs opacity-60 tracking-wide">{currentSong.writer}</p>
                    <p className="text-xs tracking-wide">{currentSong.name}</p>
                  </div>

                <div className="">
                  <ReactAudioPlayer
                    src={currentSong.src}
                    ref={audioRef}
                    volume={volume}
                    listenInterval={100}
                    onEnded={handleSongEnd}
                    onListen={handleTimeUpdate}
                    className="w-full"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onVolumeChanged={(e) => setVolume(e.target.volume)}
                    onLoadedMetadata={(e) => setDuration(e.target.duration)}
                  />
                  
                  <div className="">
                    {/* Progress bar */}
                    <div 
                      className="h-2 bg-gray-600 rounded-full cursor-pointer relative mb-2"
                      onClick={handleSeek}
                    >
                      <div 
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      ></div>
                    </div>
                    
                    {/* Time indicators */}
                    <div className="flex justify-between text-xs text-gray-400 mb-4">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                    
                    {/* Control buttons */}
                    <div className="flex items-center justify-between">
                      {/* Previous song */}
                      <button 
                        onClick={playPreviousSong}
                        className="w-10 h-10 flex items-center justify-center bg-gray-700 hover:bg-gray-600 focus:outline-none"
                      >
                        <p className='size-9 max-h-4'><IoIosSkipBackward /></p>
                      </button>
                      
                      {/* Play/Pause */}
                      <button 
                        onClick={togglePlayPause}
                        className="w-14 h-14 flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                      >
                        {isPlaying ? (
                          <p className='size-9 max-h-4'><IoIosPause /></p>
                        ) : (
                          <p className='size-9 max-h-4'><IoIosPlay /></p>
                        )}
                      </button>
                      
                      {/* Next song */}
                      <button 
                        onClick={playNextSong}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 focus:outline-none"
                      >
                        <p className='size-9 max-h-4'><IoIosSkipForward /></p>
                      </button>
                    </div>
                    
                    {/* Volume control */}
                    <div className="flex items-center mt-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                      </svg>
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.01" 
                        value={volume} 
                        onChange={handleVolumeChange}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                </div>   
              </div>
            </div>
          </div>

          <input type="radio" name="my_tabs_2" class="tab" aria-label="Links"/>
          <div class="tab-content border-base-300 bg-base-100 p-4 rounded-lg w-[387.1px]">
            {currentPage === 0 ? renderFirstPage() : renderSecondPage()}

            <div className="navigation-controls inline-flex">
              <button 
                onClick={() => navigatePage('prev')} 
                hidden={currentPage === 0}
                className="nav-button"
              >
                <IoIosArrowBack />
              </button>
              
              <button 
                onClick={() => navigatePage('next')} 
                hidden={currentPage === 1}
                className="nav-button"
              >
                <IoIosArrowForward />
              </button>
            </div>
          </div>

          <input type="radio" name="my_tabs_2" class="tab" aria-label="Store" />
          <div class="tab-content border-base-300 bg-base-100 p-4 rounded-lg max-w-[387.1px] max-h-[326.533px] pt-13 pb-13">
            <p><b>Currently Buying:</b></p>
            - BGSI Items < br />
            - Plutonium Users < br />
            - Inac RAP Accounts < br />
            < br />
            <p>All of my stock is on my <a href='https://eldorado.gg/users/inrv' target='_blank'>Eldorado</a> page!
            Anything to sell? Contact me</p>

            <a href="https://discord.gg/ey2qtBrAfU" target='_blank'>
              <button className="btn btn-primary mt-4 bg-blue-300 text-white"><IoIosLink />Contact me</button>
            </a>
            

          </div>
        </div>

      </div>
    </>
  )
}

export default App
