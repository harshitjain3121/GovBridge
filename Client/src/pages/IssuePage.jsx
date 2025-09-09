import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import MapPicker from "../components/MapPicker";
import UpvoteButton from "../components/UpvoteButton";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";
import OfficialResponseForm from "../components/OfficialResponseForm";
import OfficialResponseList from "../components/OfficialResponseList";

export default function IssuePage() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  const fetchIssue = async () => {
    try {
  const res = await API.get(`/issues/${id}`);
      setIssue(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load issue");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssue();
  }, [id]);

  if (loading) return <p>Loading issue...</p>;
  if (error) return <p>{error}</p>;
  if (!issue) return <p>No issue found.</p>;

  return (
    <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>
      <div style={{ position: "relative" }}>
        {issue.isUrgent && (
          <span style={{ position: "absolute", top: 0, right: 0, background: "#d32f2f", color: "#fff", borderRadius: 16, padding: "4px 10px", fontSize: 12, display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span aria-hidden>⚠️</span> Urgent
          </span>
        )}
        <h1 style={{ marginBottom: 4, paddingRight: 90 }}>{issue.title}</h1>
        <div style={{ color: "#666", fontSize: 12, marginBottom: 12 }}>
          {issue.createdAt && new Date(issue.createdAt).toLocaleString()}
        </div>
        <p>{issue.description}</p>
        <p>Category: {issue.category}</p>
        <p>Status: {issue.status}</p>
        {issue.image && (
          <div style={{ width: "100%", maxHeight: 420, overflow: "hidden", borderRadius: 8, background: "#f1f1f1" }}>
            <img src={issue.image} alt={issue.title} style={{ width: "100%", height: 420, objectFit: "cover", display: "block" }} />
          </div>
        )}

        <h3>Location</h3>
        <MapPicker coordinates={issue.location.coordinates} setCoordinates={() => {}} />

        <UpvoteButton issue={issue} userId={userId} onUpvote={setIssue} />

        <hr />
        <h3>Comments</h3>
        {localStorage.getItem("token") && (
          <CommentForm
            issueId={issue._id}
            onCommentAdded={(newComment) =>
              setIssue((prev) => ({
                ...prev,
                comments: [newComment, ...prev.comments],
              }))
            }
          />
        )}
        <CommentList
          comments={issue.comments}
          onCommentDeleted={(commentId) =>
            setIssue((prev) => ({
              ...prev,
              comments: prev.comments.filter((c) => c._id !== commentId),
            }))
          }
        />
      </div>
      <aside>
        <div className="card" style={{ position: "sticky", top: 16 }}>
          <h3 style={{ marginTop: 0 }}>Official Responses</h3>
          {role === "government" && (
            <OfficialResponseForm
              issueId={issue._id}
              onResponseAdded={(newResp) =>
                setIssue((prev) => ({
                  ...prev,
                  officialResponse: [newResp, ...prev.officialResponse],
                  status: newResp.statusUpdate || prev.status,
                }))
              }
            />
          )}
          <OfficialResponseList responses={issue.officialResponse} />
        </div>
      </aside>
    </div>
  );
}
