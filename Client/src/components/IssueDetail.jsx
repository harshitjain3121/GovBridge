import React from "react";
import MapPicker from "./MapPicker";

export default function IssueDetail({ issue }) {
  return (
    <div className="card" style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
      <h2>{issue.title}</h2>
      <p>{issue.description}</p>
      <p>Category: {issue.category}</p>
      <p>Status: {issue.status}</p>
      {issue.isUrgent && <p style={{ color: "red" }}>Urgent!</p>}
      {issue.image && <img src={issue.image} alt={issue.title} style={{ maxWidth: "100%" }} />}
      <h3>Location</h3>
      <MapPicker coordinates={issue.location.coordinates} setCoordinates={() => {}} />
    </div>
  );
}
