import React, { useState } from "react";
import API from "../api/axios";

export default function CommentForm({ issueId, onCommentAdded }) {
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Login to comment");
      return;
    }

    try {
      const res = await API.post(`/comments/${issueId}`, { comment: text });
      onCommentAdded && onCommentAdded(res.data.comment);
      setText("");
    } catch (err) {
      console.error(err);
      alert("Failed to post comment");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: "10px 0" }}>
      <input
        type="text"
        className="input"
        placeholder="Add a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className="button">Post</button>
    </form>
  );
}
