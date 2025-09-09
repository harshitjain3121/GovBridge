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
    <div className="container">
      <h1>{issue.title}</h1>
      <p>{issue.description}</p>
      <p>Category: {issue.category}</p>
      <p>Status: {issue.status}</p>
      {issue.isUrgent && <p style={{ color: "red" }}>Urgent!</p>}
      {issue.image && <img src={issue.image} alt={issue.title} style={{ maxWidth: "100%" }} />}

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

      {role === "government" && (
        <>
          <hr />
          <h3>Official Responses</h3>
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
          <OfficialResponseList responses={issue.officialResponse} />
        </>
      )}
    </div>
  );
}
