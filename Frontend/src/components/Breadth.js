import React, { useEffect, useState, useRef, useContext } from "react";
// import "./App.css";
import "./Breadth.css";
import playImg from "../assets/svg/play.svg";
import pauseImg from "../assets/svg/pause.svg";
import rainImg from "../assets/svg/rain.svg";
import beachImg from "../assets/svg/beach.svg";
import rainAudio from "../assets/sounds/rain.mp3";
import beachAudio from "../assets/sounds/beach.mp3";
import { WalletContext } from "../context/WalletContext";
import { toast } from "react-toastify";
import { t } from "i18next";

export default function Breadth() {
  let [time, setTime] = useState();
  let [date, setDate] = useState();
  let [duration, setDuration] = useState(10);
  let [sound, setSound] = useState(rainAudio);
  let [playing, setPlaying] = useState(false);
  let [track, setTrack] = useState("Rainy!");
  let [isTimerFinished, setIsTimerFinished] = useState(false); // Track if timer finished
  let audioRef = useRef(null);
  const { earnTokens } = useContext(WalletContext);

  let todayTime = () => {
    setInterval(updateTodaysTime, 1000);
  };

  const playPauseSongHandler = () => {
    if (playing) {
      audioRef.current.pause();
      document.querySelector(".play").src = playImg;
    } else {
      audioRef.current.play();
      document.querySelector(".play").src = pauseImg;
    }
    setPlaying(!playing);
  };

  let updateTodaysTime = () => {
    let today = new Date();
    let currDate = today.toLocaleDateString();
    let currtime =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    setDate(currDate);
    setTime(currtime);
  };

  const getTimeFormat = (time) => {
    if (!time) return "0:00";
    return (
      Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2)
    );
  };

  let resetTimer = () => {
    setPlaying(false);
    audioRef.current.currentTime = 0;
    updateProgressBar();
    setIsTimerFinished(false); // Reset the timer finished state
  };

  let updateProgressBar = () => {
    const outline = document.querySelector(".moving-outline circle");
    const outlineLength = outline.getTotalLength();
    outline.style.strokeDashoffset = outlineLength;
    outline.style.strokeDasharray = outlineLength;
    let currentTime = audioRef.current.currentTime;
    let progress = outlineLength - (currentTime / duration) * outlineLength;
    outline.style.strokeDashoffset = progress;
  };

  const setSoundHandler = async (song) => {
    await setSound(song);
    resetTimer();
  };

  const redeemTokenHandler = async() => {
    try{
      setIsTimerFinished(false)
      const res = await toast.promise(earnTokens(),{
        pending: 'Transaction in progress ⏳',
        success: 'Tokens Redeemed Successfully',
        error: {
          render({ data }) {
            // Custom error message
            if (data && data.code === 'WALLET_NOT_CONNECTED') {
              return 'Please connect your wallet.';
            }
            // Handle other types of errors
            return 'Transaction Aborted. Try again.';
          }
        }
      })
    }
    catch(e){
      setIsTimerFinished(true)
    }
  };

  useEffect(() => {
    if (audioRef.current && duration === Math.ceil(audioRef.current.currentTime)) {
      resetTimer();
      playPauseSongHandler();
      setIsTimerFinished(true); // Mark timer as finished when the audio ends
      window.scrollTo({
        top: document.documentElement.scrollHeight, // Scroll to bottom of the page
        behavior: 'smooth' // Optional for smooth scrolling
      });
    }
    todayTime();
    updateProgressBar();
  });

  return (
    <div className="App  dark:bg-black">
      <main className="App-content">
        <div className="duration-content">
          <h2>Duration</h2>
          <h4 className="selected_duration">
            Selected Duration: {duration } seconds.
          </h4>
          <button
            className="duration-btn"
            onClick={(e) => {
              setDuration(10);
              resetTimer();
            }}
          >
            10 Seconds
          </button>
          <button
            className="duration-btn"
            onClick={(e) => {
              setDuration(300);
              resetTimer();
            }}
          >
            5 minutes
          </button>
          <button
            className="duration-btn"
            onClick={(e) => {
              setDuration(600);
              resetTimer();
            }}
          >
            10 minutes
          </button>
        </div>
        <div className="timer-content">
           {/* Display redeem button when timer finishes */}
        
          <img
            src={playImg}
            alt="play"
            className="play"
            onClick={playPauseSongHandler}
          ></img>
          <svg
            className="track-outline"
            width="453"
            height="453"
            viewBox="0 0 453 453"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="226.5"
              cy="226.5"
              r="216.5"
              stroke="white"
              strokeWidth="20"
            />
          </svg>

          <svg
            className="moving-outline"
            width="453"
            height="453"
            viewBox="0 0 453 453"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="226.5"
              cy="226.5"
              r="216.5"
              stroke="#018EBA"
              strokeWidth="20"
            />
          </svg>

          <h1 className="timer">
            {audioRef.current
              ? getTimeFormat(duration - audioRef.current.currentTime)
              : "0:00"}
          </h1>
          
        </div>

        <div className="sound-content">
          <h2>Tracks</h2>
          <h4 className="selected_track">Selected Track: {track}</h4>
          <button
            className="sound-btn"
            onClick={() => {
              setSoundHandler(rainAudio);
              setTrack("Rainy!");
            }}
          >
            <img src={rainImg} alt="rain" className="rain-img"></img>
          </button>
          <button
            className="sound-btn"
            onClick={() => {
              setSoundHandler(beachAudio);
              setTrack("Beach Vibes!");
            }}
          >
            <img src={beachImg} alt="beach" className="beach-img"></img>
          </button>
        </div>

       
      </main>
      <audio
        ref={audioRef}
        className="audio"
        onEnded={resetTimer}
        onTimeUpdate={updateProgressBar}
        src={sound}
      ></audio>
      {isTimerFinished && (
          
          <div className="py-6">
            <button className="bg-white text-blue-900 font-extrabold h-14 p-4 border rounded-md border-black hover:text-white  hover:bg-blue-600" onClick={redeemTokenHandler}>
            Redeem 10 SOL Tokens
          </button>
          </div>
      )}
    </div>
  );
}