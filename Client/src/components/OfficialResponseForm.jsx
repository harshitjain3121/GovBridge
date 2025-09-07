import React, { useState } from "react";
import API from "../api/axios";

export default function OfficialResponseForm({ issueId, onResponseAdded }) {
  const [responseText, setResponseText] = useState("");
  const [statusUpdate, setStatusUpdate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!responseText.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Login required");
      return;
    }

    try {
      const res = await API.post(`/officialResponse/${issueId}`, {
        response: responseText,
        statusUpdate,
      });
      onResponseAdded && onResponseAdded(res.data.officialResponse);
      setResponseText("");
      setStatusUpdate("");
    } catch (err) {
      console.error(err);
      alert("Failed to add official response");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: "10px 0" }}>
      <textarea
        className="input"
        placeholder="Add official response..."
        value={responseText}
        onChange={(e) => setResponseText(e.target.value)}
        rows={3}
      />
      <select
        className="input"
        value={statusUpdate}
        onChange={(e) => setStatusUpdate(e.target.value)}
      >
        <option value="">No status update</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="resolved">Resolved</option>
      </select>
      <button className="button" type="submit">Post Response</button>
    </form>
  );
}
