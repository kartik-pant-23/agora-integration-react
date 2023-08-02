import React, { useMemo } from "react";
import { AgoraVideoPlayer } from "agora-rtc-react";

import styles from "./VideoPanel.module.css";

export default function VideoPanel({ videoTrack, userId }) {
  const backgroundColorStyle = useMemo(
    () => ({
      borderColor: userId === "You" ? "#0d6ef0" : "#303030",
    }),
    [userId]
  );

  return (
    <div className="p-1 w-100">
      <div className={styles.videoContainer} style={backgroundColorStyle}>
        {videoTrack && (
          <AgoraVideoPlayer className={styles.video} videoTrack={videoTrack} />
        )}
        <div className={styles.nameContainer}>{userId}</div>
      </div>
    </div>
  );
}
