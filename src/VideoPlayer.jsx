 'use client'
import React, {useEffect, useRef, useState} from "react";
 import "video.js/dist/video-js.css";

const VideoPlayer = () => {
    const videoRef = useRef(null);
    const [volume, setVolume] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [subtitleTracks, setSubtitleTracks] = useState([
        {
            label: "English",
            language: "en",
            mode: false,
            src: "/subtitle.vtt"
        },
        {
            label: "France",
            language: "fra",
            mode: false,
            src: "/subtitle.vtt"
        }
    ]);

    const handlePlay = () => videoRef.current && videoRef.current.play();
    const handlePause = () => videoRef.current && videoRef.current.pause();
    const handleMute = () => videoRef.current && (videoRef.current.muted = true);
    const handleUnmute = () => videoRef.current && (videoRef.current.muted = false);

    const [activeTrack, setActiveTrack] = useState(null);
    const handleFullscreen = () => {
        if (videoRef.current) {
            if (videoRef.current.requestFullscreen) {
                videoRef.current.requestFullscreen();
            }
        }
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
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };
    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };
    const handleSeek = (e) => {
        const time = Number(e.target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = time;
        }
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
        if (activeTrack === null) {
            // No active subtitle. Turn on the first track (or default to index 0)
            if (tracks.length > 0) {
                tracks[0].mode = "showing";
                setActiveTrack(0);
            }
        } else {
            // Disable all
            for (let i = 0; i < tracks.length; i++) {
                tracks[i].mode = "disabled";
            }
            setActiveTrack(null);
        }
    };


    return (
        <div className="video-container">
            <video
                ref={videoRef}
                id="my-player"
                className="video-js"
                controls
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                preload="auto"
                poster="//vjs.zencdn.net/v/oceans.png"
                data-setup='{}'>
                <source src="//vjs.zencdn.net/v/oceans.mp4" type="video/mp4" />
                {subtitleTracks.map((subtitle, idx) => (
                    <track
                        key={`track-${idx}`}
                        label={subtitle.label}
                        kind="subtitles"
                        src={subtitle.src}
                        srcLang={subtitle.language}
                    />
                ))}
                <p className="vjs-no-js">
                    To view this video please enable JavaScript, and consider upgrading to a
                    web browser that
                    <a href="https://videojs.com/html5-video-support/" target="_blank">
                        supports HTML5 video
                    </a>
                </p>
            </video>
            <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                step="0.1"
                onChange={handleSeek}
                style={{
                    width: "100%",
                    accentColor: "red",
                    margin: "10px 0"
                }}
            />
            <div className="player-controller">
                <button onClick={handlePlay}>Play</button>
                <button onClick={handlePause}>Pause</button>
                <button onClick={handleMute}>Mute</button>
                <button onClick={handleUnmute}>Unmute</button>
                <button onClick={handleFullscreen}>Fullscreen</button>
                <label style={{ marginLeft: "10px" }}>
                    Volume
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={e => handleVolume(Number(e.target.value))}
                        style={{ marginLeft: "5px", verticalAlign: "middle" }}
                    />
                </label>
                <button disabled style={{ marginLeft: "10px" }}>
                    Current: {formatTime(currentTime)}
                </button>
                <button disabled style={{ marginLeft: "5px" }}>
                    Total: {formatTime(duration)}
                </button>



                <div style={{ display: "inline-block", marginLeft: "10px" }}>
                    <select style={{ marginLeft: "10px" }} onChange={e => handleSubtitleSelect(Number(e.target.value))}>
                        {subtitleTracks.map((track, idx) => (
                            <option key={track.language || idx}
                                    value={idx}>
                                {track.label || track.language || `Subtitle ${idx + 1}`}
                            </option>
                        ))}
                    </select>
                    <button
                        style={{ marginLeft: "8px" }}
                        onClick={handleToggleSubtitle}
                    >
                        {activeTrack === null ? "Start Subtitle" : "Stop Subtitle"}
                    </button>

                </div>
            </div>
        </div>
    );
};

 export default VideoPlayer;
