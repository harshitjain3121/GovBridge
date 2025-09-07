import React from "react";
import API from "../api/axios";

export default function CommentList({ comments, onCommentDeleted }) {
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    const token = localStorage.getItem("token");
    if (!token) return alert("Login required");

    try {
      await API.delete(`/comments/${commentId}`);
      onCommentDeleted && onCommentDeleted(commentId);
    } catch (err) {
      console.error(err);
      alert("Failed to delete comment");
    }
  };

  if (!comments || comments.length === 0) return <p>No comments yet.</p>;

  return (
    <div>
      {comments.map((comment) => (
        <div key={comment._id} style={{ borderBottom: "1px solid #ccc", padding: "5px 0" }}>
          <p>
            <strong>{comment.creator?.name}:</strong> {comment.comment}
          </p>
          {(comment.creator?._id === userId || role === "government") && (
            <button
              className="button"
              style={{ backgroundColor: "red" }}
              onClick={() => handleDelete(comment._id)}
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
