import React from "react";
import { Link } from "react-router-dom";

export default function IssueCard({ issue, handleUpvote, userId }) {
  const hasUpvoted = issue.upvotes.some((u) => u._id === userId || u === userId);

  const statusClass =
    issue.status === "resolved" ? "badge success" :
    issue.status === "pending" ? "badge warning" :
    "badge";

  return (
    <div className="card">
      <h3 className="mt-0">{issue.title}</h3>
      <div className="mt-2" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <span className="badge">{issue.category}</span>
        <span className={statusClass}>{issue.status}</span>
        {issue.isUrgent && <span className="badge danger">Urgent</span>}
      </div>
      <p className="mt-3">{issue.description.substring(0, 120)}...</p>
      {issue.image && (
        <div className="media-box mt-3">
          <div className="media-content">
            <img className="img-fluid" src={issue.image} alt={issue.title} />
          </div>
        </div>
      )}
      <div className="mt-4" style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
        <button className="button" onClick={() => handleUpvote(issue._id)}>
          {hasUpvoted ? "Remove Upvote" : "Upvote"} ({issue.upvotes.length})
        </button>
        <Link to={`/issues/${issue._id}`}>
          <button className="button secondary">View Details</button>
        </Link>
      </div>
    </div>
  );
}
