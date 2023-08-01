import React, { useCallback, useMemo, useState } from "react";

export default function Header({
  channelId,
  onLeaveChannel,
  audio,
  onAudioEnable,
  video,
  onVideoEnable,
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
      "fa-solid " + (audio ? "fa-microphone-slash" : "fa-microphone");
    const onClick = audio ? handleAudioDisable : handleAudioEnable;
    return (
      <button className="me-2 btn" onClick={onClick}>
        <i className={iconClass}></i>
      </button>
    );
  }, [audio, handleAudioEnable, handleAudioDisable]);

  const VideoButton = useMemo(() => {
    const iconClass = "fa-solid " + (video ? "fa-video-slash" : "fa-video");
    const onClick = video ? handleVideoDisable : handleVideoEnable;
    return (
      <button className="me-2 btn" onClick={onClick}>
        <i className={iconClass}></i>
      </button>
    );
  }, [video, handleVideoEnable, handleVideoDisable]);

  return (
    <header className="d-flex align-items-center justify-content-between py-2 px-5">
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
        {AudioButton}
        {VideoButton}
        <button className="btn btn-danger" onClick={onLeaveChannel}>
          <i className="fa-solid fa-phone"></i> End Call
        </button>
      </div>
    </header>
  );
}
