import { useCallback, useMemo, useState } from "react";
import "./App.css";
import JoinChannel from "./components/joinChannel";
import Home from "./components/home";

function App() {
  const [inCall, setInCall] = useState(false);
  const [channelId, setChannelId] = useState(null);

  const handleJoinChannel = useCallback(
    (channelId) => {
      setChannelId(channelId);
      setInCall(true);
    },
    [setChannelId, setInCall]
  );

  const handleLeaveChannel = useCallback(() => {
    setChannelId(null);
    setInCall(false);
  }, []);

  const Content = useMemo(() => {
    if (inCall) {
      return <Home channelId={channelId} onLeaveChannel={handleLeaveChannel} />;
    }
    return <JoinChannel onJoinChannel={handleJoinChannel} />;
  }, [inCall, channelId, handleLeaveChannel, handleJoinChannel]);

  return <>{Content}</>;
}

export default App;
