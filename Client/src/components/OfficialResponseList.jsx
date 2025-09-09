import React from "react";

export default function OfficialResponseList({ responses }) {
  if (!responses || responses.length === 0) return <p>No official responses yet.</p>;

  return (
    <div>
      {responses.map((resp) => (
        <div key={resp._id} style={{ borderBottom: "1px solid #ccc", padding: "5px 0" }}>
          <p>
            <strong>{resp.responseBy?.name} ({resp.responseBy?.role}):</strong> {resp.response}
          </p>
          <p>Status Update: {resp.statusUpdate || "N/A"}</p>
          {resp.createdAt && (
            <div style={{ color: "#777", fontSize: 12 }}>
              {new Date(resp.createdAt).toLocaleString()}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
