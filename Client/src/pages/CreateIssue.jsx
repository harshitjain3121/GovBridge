import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import MapPicker from "../components/MapPicker";

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


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !image || !coordinates || coordinates.length !== 2) {
      setError("Please fill all required fields, including image and valid coordinates");
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);
    formData.append("category", category);
    formData.append("isUrgent", isUrgent);
    // Send coordinates as JSON array string
    formData.append("coordinates", JSON.stringify(coordinates));

    try {
      await API.post("/issues", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create issue");
      setSuccess("");
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Create New Issue</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="input"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className="input"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <select
          className="input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="sanitation">Sanitation</option>
          <option value="road">Road</option>
          <option value="lighting">Lighting</option>
          <option value="water">Water</option>
          <option value="safety">Safety</option>
          <option value="other">Other</option>
        </select>
        <label>
          <input
            type="checkbox"
            checked={isUrgent}
            onChange={(e) => setIsUrgent(e.target.checked)}
          />{" "}
          Mark as urgent
        </label>

        <h3>Select Location on Map</h3>
        <div style={{ marginBottom: "10px" }}>
          <label>Coordinates: </label>
          <input 
            type="text" 
            value={`${coordinates[0]}, ${coordinates[1]}`} 
            readOnly 
            style={{ marginLeft: "10px", padding: "5px" }}
          />
        </div>
        <MapPicker coordinates={coordinates} setCoordinates={setCoordinates} />

        <button className="button" type="submit">Create Issue</button>
      </form>
    </div>
  );
}
