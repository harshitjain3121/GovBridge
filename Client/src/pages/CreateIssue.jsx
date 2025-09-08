import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import GoogleMapPicker from "../components/GoogleMapPicker";

export default function CreateIssue() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      setLoading(false);
    }
  }, [navigate]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("other");
  const [isUrgent, setIsUrgent] = useState(false);
  const [coordinates, setCoordinates] = useState([0, 0]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    // Basic validation
    if (!title.trim() || !description.trim() || !image || !coordinates || coordinates.length !== 2 || coordinates[0] === 0) {
      setError("Please complete all fields and pick a valid location");
      setSuccess("");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("image", image);
    formData.append("category", category);
    formData.append("isUrgent", String(isUrgent));
    // Send coordinates as JSON array string
    formData.append("coordinates", JSON.stringify(coordinates));

    try {
      setSubmitting(true);
      const res = await API.post("/issues", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status >= 200 && res.status < 300) {
        setSuccess("Issue created successfully!");
        setError("");
        setTitle("");
        setDescription("");
        setImage(null);
        setCategory("other");
        setIsUrgent(false);
        setCoordinates([0, 0]);
        setTimeout(() => {
          navigate("/");
        }, 1200);
      } else {
        setError("Unexpected response from server");
        setSuccess("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create issue");
      setSuccess("");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <h1 className="section-title">Create New Issue</h1>
      {error && <div className="badge danger" style={{ marginBottom: "12px" }}>{error}</div>}
      {success && <div className="badge success" style={{ marginBottom: "12px" }}>{success}</div>}
      <div className="card">
        <form onSubmit={handleSubmit}>
          <label className="text-muted">Title</label>
          <input
            className="input"
            type="text"
            name="title"
            placeholder="Short, descriptive title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <label className="text-muted">Description</label>
          <textarea
            className="input"
            name="description"
            placeholder="Describe the issue, including details and context"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <label className="text-muted">Image</label>
          <input
            className="input"
            type="file"
            name="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
            required
          />
          <label className="text-muted">Category</label>
          <select
            className="input"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="sanitation">Sanitation</option>
            <option value="road">Road</option>
            <option value="lighting">Lighting</option>
            <option value="water">Water</option>
            <option value="safety">Safety</option>
            <option value="other">Other</option>
          </select>
          <label className="mt-2">
            <input
              type="checkbox"
              checked={isUrgent}
              onChange={(e) => setIsUrgent(e.target.checked)}
            />{" "}
            Mark as urgent
          </label>

          <h3 className="mt-4">Select Location</h3>
          <div className="mt-2" style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <span className="badge">Coordinates</span>
            <span className="text-muted">{coordinates[0]}, {coordinates[1]}</span>
          </div>
          <div className="mt-3">
            <GoogleMapPicker coordinates={coordinates} setCoordinates={setCoordinates} />
          </div>

          <button className="button blue mt-4" type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create Issue"}
          </button>
        </form>
      </div>
    </div>
  );
}
