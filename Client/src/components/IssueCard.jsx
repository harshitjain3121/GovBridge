import React from "react";
import { Link } from "react-router-dom";

export default function IssueCard({ issue, handleUpvote, userId }) {
  const hasUpvoted = issue.upvotes.some((u) => u._id === userId || u === userId);

  return (
    <div className="card" style={{ border: "1px solid #ccc", margin: "10px 0", padding: "10px" }}>
      <h3>{issue.title}</h3>
      <p>{issue.description.substring(0, 100)}...</p>
      <p>Category: {issue.category}</p>
      <p>Status: {issue.status}</p>
      {issue.isUrgent && <p style={{ color: "red" }}>Urgent!</p>}
      {issue.image && <img src={issue.image} alt={issue.title} style={{ maxWidth: "100%" }} />}
      <button className="button" onClick={() => handleUpvote(issue._id)}>
        {hasUpvoted ? "Remove Upvote" : "Upvote"} ({issue.upvotes.length})
      </button>
      <Link to={`/issues/${issue._id}`} style={{ marginLeft: "10px" }}>
        <button className="button">View Details</button>
      </Link>
    </div>
  );
}
