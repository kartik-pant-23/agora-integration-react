import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";
import { useCallback, useEffect, useState } from "react";
import _reduce from "lodash.reduce";

const APP_ID = "31f8881002764136849d5ae3e70ee515";
const useClient = createClient({ mode: "rtc", codec: "vp8" });
const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

const handleUserPublished =
  ({ client, setUsers }) =>
  async (user, mediaType) => {
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

export default function useAgoraClient({ channelId, onFailure }) {
  const { ready, tracks } = useMicrophoneAndCameraTracks();
  const client = useClient();
  const [users, setUsers] = useState({});

  const initializeAgoraEventHandlers = useCallback(
    async ({ client, tracks, channelName, setUsers, onFailure }) => {
      try {
        client.on("user-published", handleUserPublished({ client, setUsers }));
        client.on("user-unpublished", handleUserUnpublished({ setUsers }));
        client.on("user-left", handleUserLeft({ setUsers }));
        await client.join(APP_ID, channelName, null, null);
        await client.publish(tracks);
      } catch (e) {
        onFailure(e);
      }
    },
    []
  );

  useEffect(() => {
    if (ready && tracks) {
      initializeAgoraEventHandlers({
        client,
        tracks,
        channelName: channelId,
        setUsers,
        onFailure,
      });
    }
  }, [ready, tracks, client, channelId, setUsers, onFailure]);

  return [client, users, tracks];
}
