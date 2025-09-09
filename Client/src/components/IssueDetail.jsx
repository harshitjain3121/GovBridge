import React from "react";
import MapPicker from "./MapPicker";

export default function IssueDetail({ issue }) {
  return (
    <div className="card" style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
      <h2 style={{ marginBottom: 8 }}>{issue.title}</h2>
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 12, 
        marginBottom: 16,
        flexWrap: "wrap"
      }}>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 8,
          background: "#f8f9fa",
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid #e9ecef"
        }}>
          <span style={{ fontSize: 16 }}>📅</span>
          <span style={{ 
            color: "#495057", 
            fontSize: 14, 
            fontWeight: 500 
          }}>
            {issue.createdAt && new Date(issue.createdAt).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 8,
          background: "#e3f2fd",
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid #bbdefb"
        }}>
          <span style={{ fontSize: 16 }}>🕒</span>
          <span style={{ 
            color: "#1976d2", 
            fontSize: 14, 
            fontWeight: 500 
          }}>
            {issue.createdAt && new Date(issue.createdAt).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}
          </span>
        </div>
      </div>
      <p>{issue.description}</p>
      <p>Category: {issue.category}</p>
      <p>Status: {issue.status}</p>
      {issue.isUrgent && <p style={{ color: "red" }}>Urgent!</p>}
      {issue.image && (
        <div style={{ width: "100%", maxHeight: 420, overflow: "hidden", borderRadius: 8, background: "#f1f1f1" }}>
          <img src={issue.image} alt={issue.title} style={{ width: "100%", height: 420, objectFit: "cover", display: "block" }} />
        </div>
      )}
      <h3>Location</h3>
      <MapPicker coordinates={issue.location.coordinates} setCoordinates={() => {}} />
    </div>
  );
}
