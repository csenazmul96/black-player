'use client'
import React, { useEffect, useRef, useState } from "react";
import { Loader } from "lucide-react";
import { IoMdPlay } from "react-icons/io";
import { RiLoader5Fill } from "react-icons/ri";
import {
    FaPlay, FaPause, FaVolumeMute, FaVolumeUp, FaExpand, FaStepBackward, FaStepForward, FaForward, FaBackward
} from "react-icons/fa";
import { MdSubtitles } from "react-icons/md";
import {IoPauseOutline} from "react-icons/io5";

// Controller component for clarity
const PlayerController = ({
                              isVisible,
                              isPlaying,
                              handlePlay,
                              handlePause,
                              handleMute,
                              handleUnmute,
                              handleFullscreen,
                              formatTime,
                              handleVolume,
                              volume,
                              isMuted,
                              currentTime,
                              duration,
                              handleSeek,
                              playbackRate,
                              handlePlaybackRate,
                              playbackRates,
                              rewind,
                              forward,
                              subtitleTracks,
                              handleSubtitleSelect,
                              handleToggleSubtitle,
                              activeTrack,
                              handlePrevVideo,
                              handleNextVideo,
                              error,
                              handleRetry,
                          }) => (
    <div
        className={`
      absolute bottom-0 left-0 right-0 w-full z-20
      transition-opacity duration-150
      pointer-events-none
      ${isVisible ? "opacity-100" : "opacity-0"}
      flex flex-col
    `}
        style={{
            background: 'linear-gradient(0deg, rgba(0,0,0,0.67) 70%, rgba(0,0,0,0.24) 97%,transparent 100%)'
        }}
    >
        {/* Progress Bar */}
        <input
            className="w-full mb-1 accent-yellow-500 pointer-events-auto"
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            step="0.1"
            onChange={handleSeek}
            style={{ height: 6 }}
        />

        <div className="flex items-center gap-2 px-2 py-1 text-white text-base pointer-events-auto">
            <div className="flex items-center gap-2">
                <button
                    onClick={isPlaying ? handlePause : handlePlay}
                    className="hover:text-yellow-400 px-2 focus:outline-none"
                    title={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? <FaPause size={19} /> : <FaPlay size={19} />}
                </button>
                {/*<button onClick={handlePlay} className="hover:text-red-500"><IoMdPlay size={20} className={'text-white'} /></button>*/}
                <button onClick={handlePause} className="hover:text-red-500">Pause</button>
                <button onClick={handleMute} className="hover:text-red-500">Mute</button>
                <button
                    onClick={isMuted || volume === 0 ? handleUnmute : handleMute}
                    className="ml-3 px-1 hover:text-yellow-400"
                    title={isMuted || volume === 0 ? "Unmute" : "Mute"}
                >
                    {isMuted || volume === 0 ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
                </button>
                <button
                    onClick={handleFullscreen}
                    className="ml-3 px-1 hover:text-yellow-400"
                    title="Fullscreen"
                >
                    <FaExpand size={17} />
                </button>
                <button
                    onClick={() => rewind(10)}
                    className="hover:text-yellow-400 px-1"
                    title="Rewind 10s"
                >
                    <FaBackward size={17} />
                </button>
                <button
                    onClick={() => forward(10)}
                    className="hover:text-yellow-400 px-1"
                    title="Forward 10s"
                >
                    <FaForward size={17} />
                </button>
            </div>
            <div className="flex items-center gap-2 min-w-[160px] justify-end flex-wrap">
                <label className="flex items-center gap-1">
                    Vol
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={e => handleVolume(Number(e.target.value))}
                        className="accent-yellow-500 ml-1"
                        style={{ width: 65, verticalAlign: "middle" }}
                    />
                </label>
                {/* 6: Time */}
                <span className="ml-2 text-sm select-none" style={{ minWidth: 64, letterSpacing: 1 }}>
                {formatTime(currentTime)} <span className="opacity-60">/</span> {formatTime(duration)}
              </span>
                {/* Playback Speed */}
                <select
                    className="ml-3 bg-black/70 text-xs text-white rounded px-1 py-px border border-gray-600 focus:outline-none"
                    value={playbackRate}
                    onChange={e => handlePlaybackRate(Number(e.target.value))}
                >
                    {playbackRates.map(rate => (
                        <option key={rate} value={rate}>
                            {rate}x
                        </option>
                    ))}
                </select>

                {/* 7: Subtitles */}
                <button
                    onClick={handleToggleSubtitle}
                    className={`ml-2 px-1 ${activeTrack !== null ? "text-yellow-400" : "text-white"} hover:text-yellow-400`}
                    title="Toggle subtitles"
                >
                    <MdSubtitles size={21} />
                </button>
                <select
                    onChange={e => handleSubtitleSelect(Number(e.target.value))}
                    className="bg-black/70 text-xs text-white rounded ml-1 px-1 py-px border border-gray-600 focus:outline-none"
                    value={activeTrack ?? ""}
                >
                    <option value="">None</option>
                    {subtitleTracks.map((track, idx) => (
                        <option key={track.language || idx} value={idx}>
                            {track.label || track.language || `Subtitle ${idx + 1}`}
                        </option>
                    ))}
                </select>

                <button
                    onClick={handlePrevVideo}
                    className="hover:text-yellow-400 px-1"
                    title="Previous"
                >
                    <FaStepBackward size={15} />
                </button>
                <button
                    onClick={handleNextVideo}
                    className="hover:text-yellow-400 px-1"
                    title="Next"
                >
                    <FaStepForward size={15} />
                </button>
            </div>
            {error && (
                <div className="ml-4 min-w-[100px] text-red-400 inline-flex items-center">
                    <span className="text-xs">Error</span>
                    <button onClick={handleRetry} className="ml-2 underline text-xs">Retry</button>
                </div>
            )}
        </div>
    </div>
);

const VideoPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [error, setError] = useState(false);
    const videoRef = useRef(null);
    const [volume, setVolume] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [play, setPlay] = useState("");
    const [duration, setDuration] = useState(0);
    const [subtitleTracks, setSubtitleTracks] = useState([
        { label: "English", language: "en", mode: false, src: "/subtitle.vtt" },
        { label: "France", language: "fra", mode: false, src: "/subtitle.vtt" }
    ]);
    const [playbackRate, setPlaybackRate] = useState(1);
    const playbackRates = [0.5, 1, 1.25, 1.5, 2];
    const startPoint = 10;
    const [activeTrack, setActiveTrack] = useState(null);

    // --- VIDEO LIST / STATE ---
    const [videoList] = useState([
        {
            src: "//vjs.zencdn.net/v/oceans.mp4",
            type: "video/mp4",
            label: "Default Video",
        },
        {
            src: "/video.mp4",
            type: "video/mp4",
            label: "Video"
        },
        {
            src: "/101510-video-720 (1).mp4",
            type: "video/mp4",
            label: "101510-video-720 (1)"
        },
        {
            src: "https://media.istockphoto.com/id/1629519562/video/sun-rise-on-the-tokyo-skyline.mp4?s=mp4-640x640-is&k=20&c=fUEKlbroASB7FdCohpnGlsjyGosXxffvu16FWy0jaHs=",
            type: "video/mp4",
            label: "Long Video"
        },
    ]);
    const [currentVideo, setCurrentVideo] = useState(videoList[0]);

    // --- HOVER STATE FOR CONTROLLER ---
    const [isControlVisible, setIsControlVisible] = useState(false);
    const controlTimeout = useRef();

    // Show controls on mouse movement/hover, hide after a short delay
    const handlePlayerMouseMove = () => {
        clearTimeout(controlTimeout.current);
        setIsControlVisible(true);
        controlTimeout.current = setTimeout(() => setIsControlVisible(false), 1800);
    };
    const handlePlayerMouseLeave = () => {
        clearTimeout(controlTimeout.current);
        setIsControlVisible(false);
    };
    useEffect(() => () => clearTimeout(controlTimeout.current), []);

    // ---- All Handlers / Formatters -------------
    const handlePlay = () => videoRef.current && videoRef.current.play();
    const handlePause = () => videoRef.current && videoRef.current.pause();
    const handleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
        }
    };

    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        function updateMute() {
            setIsMuted(v.muted || v.volume === 0);
        }
        v.addEventListener("volumechange", updateMute);
        return () => v.removeEventListener("volumechange", updateMute);
    }, [videoRef]);

    const handleUnmute = () => {
        if (videoRef.current) {
            videoRef.current.muted = false;
            setIsMuted(false);
        }
    };
    const handleFullscreen = () => {
        if (videoRef.current?.requestFullscreen) videoRef.current.requestFullscreen();
    };
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, "0")}`;
    };
    const handleVolume = (v) => {
        if (videoRef.current) {
            videoRef.current.volume = v;
            videoRef.current.muted = v === 0;
            setVolume(v);
        }
    };
    const handleTimeUpdate = () => {
        if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
    };
    const handleLoadedMetadata = () => {
        if (videoRef.current) setDuration(videoRef.current.duration);
    };
    const handleSeek = (e) => {
        const time = Number(e.target.value);
        if (videoRef.current) videoRef.current.currentTime = time;
        setCurrentTime(time);
    };
    const handleSubtitleSelect = (idx) => {
        const tracks = videoRef.current.textTracks;
        for (let i = 0; i < tracks.length; i++) {
            tracks[i].mode = (i === idx ? "showing" : "disabled");
        }
        setActiveTrack(idx >= 0 ? idx : null);
    };
    const handleToggleSubtitle = () => {
        const tracks = videoRef.current.textTracks;
        if (activeTrack === null && tracks.length > 0) {
            tracks[0].mode = "showing";
            setActiveTrack(0);
        } else {
            for (let i = 0; i < tracks.length; i++) tracks[i].mode = "disabled";
            setActiveTrack(null);
        }
    };
    const handlePlaybackRate = (rate) => {
        if (videoRef.current) {
            videoRef.current.playbackRate = rate;
            setPlaybackRate(rate);
        }
    };
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = playbackRate;
            if (startPoint) {
                videoRef.current.currentTime = startPoint;
                setCurrentTime(startPoint);
            }
        }
    }, [playbackRate, currentVideo]);
    const forward = (sec = 15) => {
        if (videoRef.current) {
            videoRef.current.currentTime = Math.min(
                videoRef.current.currentTime + sec,
                duration
            );
        }
    };
    const rewind = (sec = 15) => {
        if (videoRef.current) {
            videoRef.current.currentTime = Math.max(
                videoRef.current.currentTime - sec,
                0
            );
        }
    };
    const handleNextVideo = () => {
        setCurrentVideo(prev => {
            const idx = videoList.findIndex(v => v.src === prev.src);
            return videoList[(idx + 1) % videoList.length];
        });
    };
    const handlePrevVideo = () => {
        setCurrentVideo(prev => {
            const idx = videoList.findIndex(v => v.src === prev.src);
            return videoList[(idx - 1 + videoList.length) % videoList.length];
        });
    };
    const handleVideoError = () => setError(true);
    const handleRetry = () => {
        setError(false);
        if (videoRef.current) {
            videoRef.current.load();
            videoRef.current.play().catch(() => {});
        }
    };
    // --- UI for play button overlay ---
    // ... existing play overlay code from your sample for brevity

    return (
        <div>
            {videoList.length > 0 && (
                <div className="mb-4">
                    <select
                        onChange={e => setCurrentVideo(videoList[Number(e.target.value)])}
                        className="px-2 py-1 bg-gray-100 rounded"
                    >
                        {videoList.map((v, idx) => (
                            <option value={idx} key={v.src || idx}>
                                {v.label || v.src || `Video ${idx + 1}`}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            <div
                className="relative group w-max rounded overflow-hidden bg-black/80"
                style={{ maxWidth: 640, minWidth: 320 }}
                onMouseMove={handlePlayerMouseMove}
                onMouseLeave={handlePlayerMouseLeave}
                tabIndex={0}
            >
                {/* Play overlay (unchanged, shortened for brevity) */}
                <div className="z-10 black_player_play_button cursor-pointer justify-center items-center absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]" >
                    {play === "pause" &&
                        <button className="w-[100px] z-10 h-[100px] rounded-full bg-black/60 backdrop-blur-lg flex items-center justify-center ">
                            <IoPauseOutline className={'text-red-700 h-6 w-6 animate-spin '} size={40} />
                        </button>
                    }

                    {play === "play" &&
                        <button onClick={handlePlay} className="w-[100px] z-10 h-[100px] rounded-full bg-black/60 backdrop-blur-lg flex items-center justify-center ">
                            <IoMdPlay className={'text-red-800'} size={40} strokeWidth={1} />
                        </button>
                    }

                    {play === "waiting" &&
                        <button onClick={handlePlay} className="w-[100px] z-10 h-[100px] rounded-full bg-black/60 backdrop-blur-lg flex items-center justify-center ">
                            <RiLoader5Fill className={'text-red-800'} size={40} strokeWidth={1} />
                        </button>
                    }
                </div>
                {/* VIDEO element */}
                <video
                    ref={videoRef}
                    onClick={handlePause}
                    id="black-player"
                    className="w-full h-auto block"
                    onPause={() => setPlay("play")}
                    onPlaying={() => setPlay("playing")}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    preload="auto"
                    onEnded={() => setPlay("play")}
                    onWaiting={() => setPlay("waiting")}
                    onCanPlay={() => setPlay("play")}
                    poster="//vjs.zencdn.net/v/oceans.png"
                    onError={handleVideoError}
                    tabIndex={0}
                >
                    <source src={currentVideo.src} type={currentVideo.type} />
                    {subtitleTracks.map((subtitle, idx) => (
                        <track
                            key={`track-${idx}`}
                            label={subtitle.label}
                            kind="subtitles"
                            src={subtitle.src}
                            srcLang={subtitle.language}
                        />
                    ))}
                    <p>
                        To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="https://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
                    </p>
                </video>
                {/* --- CONTROLLER Overlay --- */}
                <PlayerController
                    isVisible={isControlVisible}
                    handlePlay={handlePlay}
                    handlePause={handlePause}
                    handleMute={handleMute}
                    handleUnmute={handleUnmute}
                    handleFullscreen={handleFullscreen}
                    formatTime={formatTime}
                    handleVolume={handleVolume}
                    volume={volume}
                    currentTime={currentTime}
                    duration={duration}
                    playbackRate={playbackRate}
                    handlePlaybackRate={handlePlaybackRate}
                    playbackRates={playbackRates}
                    rewind={rewind}
                    forward={forward}
                    subtitleTracks={subtitleTracks}
                    handleSubtitleSelect={handleSubtitleSelect}
                    handleToggleSubtitle={handleToggleSubtitle}
                    activeTrack={activeTrack}
                    handlePrevVideo={handlePrevVideo}
                    handleNextVideo={handleNextVideo}
                    error={error}
                    handleRetry={handleRetry}
                />
            </div>
        </div>
    );
};


// ... existing code ...
export default VideoPlayer;

// ... existing code ...