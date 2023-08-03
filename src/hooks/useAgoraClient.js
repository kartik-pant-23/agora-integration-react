import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import _reduce from "lodash.reduce";

import { APP_ID } from "../utils/constants";

const handleUserPublished =
  ({ client, setUsers }) =>
  async (user, mediaType) => {
    console.log({ mediaType });
    await client.subscribe(user, mediaType);
    if (mediaType === "video") {
      setUsers((prev) => ({ ...prev, [user.uid]: user }));
    }
    if (mediaType === "audio") {
      user.audioTrack?.play();
    }
  };

const handleUserUnpublished =
  ({ setUsers }) =>
  (user, mediaType) => {
    if (mediaType === "audio") {
      user.audioTrack?.stop();
    }
    if (mediaType === "video") {
      setUsers((prev) =>
        _reduce(
          prev,
          (result, item) => {
            return {
              ...result,
              [item.uid]:
                item.uid === user.uid ? { ...item, videoTrack: null } : item,
            };
          },
          {}
        )
      );
    }
  };

const handleUserLeft =
  ({ setUsers }) =>
  (user) => {
    setUsers((prev) =>
      _reduce(
        prev,
        (result, item) => {
          if (item.uid === user.uid) return result;
          return { ...result, [item.uid]: item };
        },
        {}
      )
    );
  };

export const useAgoraClient = ({ channelId, onFailure }) => {
  const client = useMemo(
    () => AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }),
    []
  );
  const [users, setUsers] = useState({});

  // setting up the current user
  const [audio, setAudio] = useState(true);
  const [video, setVideo] = useState(true);
  const [screenShare, setScreenShare] = useState(false);
  const [tracks, setTracks] = useState([]);

  const videoTrackRef = useRef();
  const screenTrackRef = useRef();

  const setAudioState = useCallback(
    (enable) => {
      if (tracks) {
        tracks[0]?.setEnabled(enable);
      }
      setAudio(enable);
    },
    [tracks]
  );

  const setVideoState = useCallback(
    (enable) => {
      if (tracks) {
        tracks[1]?.setEnabled(enable);
      }
      setVideo(enable);
    },
    [tracks]
  );

  // screen sharing
  const setScreenSharingState = useCallback(
    async (enable) => {
      try {
        if (enable) {
          screenTrackRef.current = await AgoraRTC.createScreenVideoTrack(
            {},
            "disable"
          );
          // handling stop screen sharing from browser
          screenTrackRef.current
            .getMediaStreamTrack()
            .addEventListener("ended", () => {
              setScreenSharingState(false);
            });
          await client.unpublish(videoTrackRef.current);
          await client.publish(screenTrackRef.current);
          setTracks((prev) => [prev[0], screenTrackRef.current]);
          setScreenShare(true);
        } else {
          await client.unpublish(screenTrackRef.current);
          await client.publish(videoTrackRef.current);
          screenTrackRef.current.close();
          setTracks((prev) => [prev[0], videoTrackRef.current]);
          setScreenShare(false);
        }
      } catch (error) {
        onFailure(error);
      }
    },
    [client, setTracks, onFailure]
  );

  const clientCleanup = useCallback(async (client, tracks) => {
    if (client) {
      await client.leave();
      client.removeAllListeners();
    }
    if (tracks) {
      tracks.forEach((track) => {
        track.close();
        track.removeAllListeners();
      });
    }
  }, []);

  const leaveChannel = useCallback(async () => {
    clientCleanup(client, tracks);
  }, [clientCleanup, client, tracks]);

  // handle current user tracks
  useEffect(() => {
    const initializeTracks = async () => {
      try {
        const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
        videoTrackRef.current = tracks[1];
        tracks[0]?.play();
        setTracks(tracks);

        client.on("user-published", handleUserPublished({ client, setUsers }));
        client.on("user-unpublished", handleUserUnpublished({ setUsers }));
        client.on("user-left", handleUserLeft({ setUsers }));

        await client.join(APP_ID, channelId, null, null);
        await client.publish(tracks);
      } catch (error) {
        onFailure(error);
      }
    };
    initializeTracks();
    return () => {
      clientCleanup();
    };
  }, [client, channelId, onFailure, clientCleanup]);

  return [
    users,
    tracks,
    { state: audio, setState: setAudioState },
    { state: video, setState: setVideoState },
    { state: screenShare, setState: setScreenSharingState },
    leaveChannel,
  ];
};
