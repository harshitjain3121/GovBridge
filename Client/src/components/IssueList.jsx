import React, { useState } from "react";
import IssueCard from "./IssueCard";
import API from "../api/axios";

export default function IssueList({ issues, onIssuesUpdate }) {
  const userId = localStorage.getItem("userId");
  const [upvotingIssues, setUpvotingIssues] = useState(new Set());

  const handleUpvote = async (issueId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to upvote issues");
      return;
    }

    // Add to upvoting set to show loading state
    setUpvotingIssues(prev => new Set(prev).add(issueId));

    try {
      const res = await API.get(`/issues/${issueId}/upvote`);
      
      // Update the issues list with the new upvote data
      if (onIssuesUpdate) {
        onIssuesUpdate(prevIssues => 
          prevIssues.map(issue => 
            issue._id === issueId 
              ? { ...issue, upvotes: res.data.upvotes }
              : issue
          )
        );
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upvote. Please try again.");
    } finally {
      // Remove from upvoting set
      setUpvotingIssues(prev => {
        const newSet = new Set(prev);
        newSet.delete(issueId);
        return newSet;
      });
    }
  };

  if (!issues || issues.length === 0) {
    return (
      <div style={{ 
        textAlign: "center", 
        padding: "60px 20px",
        background: "#f8fafc",
        borderRadius: "12px",
        border: "1px solid #e2e8f0"
      }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
        <h3 style={{ color: "#6b7280", marginBottom: "8px", fontSize: "18px" }}>
          No Issues Found
        </h3>
        <p style={{ color: "#9ca3af", fontSize: "14px" }}>
          There are currently no issues to display. Check back later or create a new issue.
        </p>
      </div>
    );
  }

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      gap: "32px",
      padding: "0",
      maxWidth: "800px",
      margin: "0 auto"
    }}>
      {issues.map((issue) => (
        <IssueCard 
          key={issue._id} 
          issue={issue} 
          handleUpvote={handleUpvote} 
          userId={userId}
          isUpvoting={upvotingIssues.has(issue._id)}
        />
      ))}
    </div>
  );
}
