import React from "react";
import IssueCard from "./IssueCard";
import API from "../api/axios";

export default function IssueList({ issues }) {
  const userId = localStorage.getItem("userId");

  const handleUpvote = async (issueId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Login to upvote");
      return;
    }

    try {
      const res = await API.get(`/issues/${issueId}/upvote`);
      // Update the local state
      window.location.reload(); // simple approach, can be improved
    } catch (err) {
      console.error(err);
      alert("Failed to upvote");
    }
  };

  if (!issues || issues.length === 0) return <p>No issues found.</p>;

  return (
    <div>
      {issues.map((issue) => (
        <IssueCard key={issue._id} issue={issue} handleUpvote={handleUpvote} userId={userId} />
      ))}
    </div>
  );
}
