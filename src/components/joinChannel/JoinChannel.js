import React, { useCallback, useState } from "react";

export default function JoinChannel({ onJoinChannel }) {
  const [channelId, setChannelId] = useState("");

  const handleChange = useCallback((e) => {
    setChannelId(e.target.value);
  }, []);

  const handleJoinButtonClick = useCallback(
    (e) => {
      e.preventDefault();
      if (channelId.trim() === "") {
        alert("Enter Channel ID");
        return;
      }
      onJoinChannel(channelId);
    },
    [onJoinChannel, channelId]
  );

  return (
    <div className="container py-2 px-3">
      <h1 className="fw-bold">Agora Integration</h1>
      <form
        className="form mt-4 py-4 px-5 col-md-8 col-sm-12 mx-auto bg-light"
        onSubmit={handleJoinButtonClick}
      >
        <label className="form-label">Channel ID</label>
        <div className="row">
          <div className="col pe-0">
            <input
              className="form-control"
              type="text"
              placeholder="Eg: abc-defg-hij"
              value={channelId}
              onChange={handleChange}
            />
          </div>
          <div className="col-auto">
            <button className="btn btn-primary" type="submit">
              Join
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
