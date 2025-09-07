import React, { useEffect, useState } from "react";
import API from "../api/axios";

export default function Dashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIssues = async () => {
    try {
  const res = await API.get("/issues");
      setIssues(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;
    try {
      await API.delete(`/issues/${id}`);
      setIssues(issues.filter((issue) => issue._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete issue");
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  if (loading) return <p>Loading issues...</p>;

  return (
    <div className="container">
      <h1>Dashboard - Manage Issues</h1>
      {issues.map((issue) => (
        <div key={issue._id} className="card">
          <h3>{issue.title}</h3>
          <p>{issue.description}</p>
          <p>Status: {issue.status}</p>
          <button className="button" onClick={() => handleDelete(issue._id)}>Delete Issue</button>
        </div>
      ))}
    </div>
  );
}
