import React, { useCallback, useMemo, useState } from "react";

export default function Header({
  channelId,
  onLeaveChannel,
  audio,
  onAudioEnable,
  video,
  onVideoEnable,
  screenSharing,
  onScreenSharingEnable,
}) {
  const [showCopyToClipboardText, setTextVisibility] = useState(false);

  const handleAudioEnable = useCallback(() => {
    onAudioEnable(true);
  }, [onAudioEnable]);

  const handleAudioDisable = useCallback(() => {
    onAudioEnable(false);
  }, [onAudioEnable]);

  const handleVideoEnable = useCallback(() => {
    onVideoEnable(true);
  }, [onVideoEnable]);

  const handleVideoDisable = useCallback(() => {
    onVideoEnable(false);
  }, [onVideoEnable]);

  const handleScreenSharingEnable = useCallback(() => {
    onScreenSharingEnable(true);
  }, [onScreenSharingEnable]);

  const handleScreenSharingDisable = useCallback(() => {
    onScreenSharingEnable(false);
  }, [onScreenSharingEnable]);

  const handleCopyClick = useCallback(() => {
    // copy to clipboard
    navigator.clipboard.writeText(channelId).then(() => {
      setTextVisibility(true);
      setTimeout(() => {
        setTextVisibility(false);
      }, 1500);
    });
  }, [channelId]);

  const AudioButton = useMemo(() => {
    const iconClass =
      "fa-solid " + (!audio ? "fa-microphone-slash" : "fa-microphone px-1");
    const onClick = audio ? handleAudioDisable : handleAudioEnable;
    return (
      <button className="me-2 btn" onClick={onClick}>
        <i className={iconClass}></i>
      </button>
    );
  }, [audio, handleAudioEnable, handleAudioDisable]);

  const VideoButton = useMemo(() => {
    const iconClass = "fa-solid " + (!video ? "fa-video-slash" : "fa-video");
    const onClick = video ? handleVideoDisable : handleVideoEnable;
    return (
      <button className="me-2 btn" onClick={onClick}>
        <i className={iconClass}></i>
      </button>
    );
  }, [video, handleVideoEnable, handleVideoDisable]);

  const ScreenSharingButton = useMemo(() => {
    const onClick = screenSharing
      ? handleScreenSharingDisable
      : handleScreenSharingEnable;
    return (
      <button
        className={`me-2 btn btn-sm ${
          screenSharing ? "btn-info" : "btn-outline-secondary"
        }`}
        onClick={onClick}
      >
        {`${screenSharing ? "Stop" : "Start"} Sharing`}
      </button>
    );
  }, [screenSharing, handleScreenSharingDisable, handleScreenSharingEnable]);

  return (
    <header
      className="d-flex align-items-center justify-content-between py-2 px-5"
      style={{ flex: "0 1 auto" }}
    >
      <div className="d-flex g-2 align-items-center">
        <h3 className="m-0">
          Channel - <strong>{channelId}</strong>
        </h3>
        <button className="ms-2 btn" onClick={handleCopyClick}>
          <i className="fa-solid fa-copy"></i>
        </button>
        {showCopyToClipboardText && (
          <div className="badge bg-light text-dark ms-2">Channel ID Copied</div>
        )}
      </div>

      <div>
        {ScreenSharingButton}
        {AudioButton}
        {VideoButton}
        <button className="btn btn-danger" onClick={onLeaveChannel}>
          <i className="fa-solid fa-phone"></i> End Call
        </button>
      </div>
    </header>
  );
}
