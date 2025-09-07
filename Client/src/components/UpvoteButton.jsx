import React, { useState, useEffect } from "react";
import API from "../api/axios";

export default function UpvoteButton({ issue, userId, onUpvote }) {
  const [hasUpvoted, setHasUpvoted] = useState(false);

  useEffect(() => {
    if (issue.upvotes.some((u) => u._id === userId || u === userId)) setHasUpvoted(true);
    else setHasUpvoted(false);
  }, [issue.upvotes, userId]);

  const handleUpvote = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Login to upvote");
      return;
    }
    try {
      const res = await API.get(`/issues/${issue._id}/upvote`);
      setHasUpvoted(!hasUpvoted);
      onUpvote && onUpvote(res.data.issue);
    } catch (err) {
      console.error(err);
      alert("Upvote failed");
    }
  };

  return (
    <button className="button" onClick={handleUpvote}>
      {hasUpvoted ? "Remove Upvote" : "Upvote"} ({issue.upvotes.length})
    </button>
  );
}
