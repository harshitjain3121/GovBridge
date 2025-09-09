import React, { useState } from "react";
import API from "../api/axios";

export default function OfficialResponseForm({ issueId, onResponseAdded }) {
  const [responseText, setResponseText] = useState("");
  const [statusUpdate, setStatusUpdate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!responseText.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Login required");
      return;
    }

    setSubmitting(true);
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
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: "0" }}>
      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
          Response Message
        </label>
        <textarea
          className="input"
          placeholder="Enter your official response to this issue..."
          value={responseText}
          onChange={(e) => setResponseText(e.target.value)}
          rows={4}
          style={{ resize: "vertical", minHeight: "100px" }}
          required
        />
      </div>
      
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
          Update Issue Status (Optional)
        </label>
        <select
          className="input"
          value={statusUpdate}
          onChange={(e) => setStatusUpdate(e.target.value)}
        >
          <option value="">No status update</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      
      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
        <button 
          className="button" 
          type="submit" 
          disabled={submitting || !responseText.trim()}
          style={{ 
            background: "#10b981", 
            color: "white",
            opacity: (submitting || !responseText.trim()) ? 0.6 : 1,
            cursor: (submitting || !responseText.trim()) ? "not-allowed" : "pointer"
          }}
        >
          {submitting ? "Posting..." : "Post Response"}
        </button>
      </div>
    </form>
  );
}
