import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import MapPicker from "../components/MapPicker";
import ImageCropper from "../components/ImageCropper";

const StyledSelect = ({ options = [], placeholder, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const selectedOption = options.find(option => option.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  const handleOptionClick = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const styles = `
    .styled-select-wrapper {
      position: relative;
      width: 100%;
      font-family: 'Inter', sans-serif;
    }
    .select-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background-color: #f9f9f9;
      cursor: pointer;
      transition: border-color 0.3s, box-shadow 0.3s;
    }
    .styled-select-wrapper.open .select-header {
      border-color: #34d399;
      box-shadow: 0 0 0 2px rgba(52, 211, 153, 0.5);
    }
    .select-header-label { color: #333; }
    .select-header-label.placeholder { color: #888; }
    .select-arrow {
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 5px solid #555;
      transition: transform 0.3s;
    }
    .styled-select-wrapper.open .select-arrow { transform: rotate(180deg); }
    .options-list {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: 0;
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 8px;
      list-style: none;
      padding: 4px 0;
      margin: 0;
      z-index: 10;
      max-height: 200px;
      overflow-y: auto;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .option-item {
      padding: 12px 16px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .option-item:hover { background-color: #f0f0f0; }
    .option-item.selected {
      background-color: #e6f2ff;
      font-weight: 600;
      color: #0056b3;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className={`styled-select-wrapper ${isOpen ? 'open' : ''}`} ref={wrapperRef}>
        <div className="select-header" onClick={() => setIsOpen(!isOpen)}>
          <span className={`select-header-label ${!selectedOption ? 'placeholder' : ''}`}>
            {displayLabel}
          </span>
          <div className="select-arrow"></div>
        </div>
        {isOpen && (
          <ul className="options-list">
            {options.map((option) => (
              <li
                key={option.value}
                className={`option-item ${value === option.value ? 'selected' : ''}`}
                onClick={() => handleOptionClick(option.value)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

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
  const [imagePreview, setImagePreview] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [coordinates, setCoordinates] = useState([0, 0]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [category, setCategory] = useState("other");

  const categoryOptions = [
    { value: 'sanitation', label: 'Sanitation' },
    { value: 'road', label: 'Road' },
    { value: 'lighting', label: 'Lighting' },
    { value: 'water', label: 'Water' },
    { value: 'safety', label: 'Safety' },
    { value: 'other', label: 'Other' },
  ];

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImage) => {
    setImage(croppedImage);
    setShowCropper(false);
    setImagePreview(null);
  };

  const handleCancelCrop = () => {
    setShowCropper(false);
    setImagePreview(null);
    // Reset the file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

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
        setImagePreview(null);
        setShowCropper(false);
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
      <h2>Report New Issue</h2>
      {error && <div className="badge danger" style={{ marginBottom: "12px" }}>{error}</div>}
      {success && <div className="badge success" style={{ marginBottom: "12px" }}>{success}</div>}

      {showCropper && (
        <ImageCropper
          imageSrc={imagePreview}
          onCropComplete={handleCropComplete}
          onCancel={handleCancelCrop}
        />
      )}
      <div className="card">
        <form onSubmit={handleSubmit}>
          <label className="label-text">Title</label>
          <div className="input-wrapper" style={{ marginTop: "5px" }}>
            <input
              className="form-input"
              type="text"
              name="title"
              placeholder="Short and descriptive"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <label className="label-text">Description</label>
          <div className="input-wrapper" style={{ marginTop: "5px" }}>
            <textarea
              className="form-input"
              name="description"
              placeholder="Describe the issue"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <label className="label-text">Image</label>
          <div className="input-wrapper" style={{ marginTop: "5px", marginBottom: 0, paddingBottom: 0 }}>
            <input
              className="form-input"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </div>
          <div style={{ marginBottom: "2.5%" }}>
            <p style={{
              fontSize: '12px',
              color: '#6c757d',
              fontStyle: 'italic',
              paddingLeft: 5,
              marginBottom: 0,
              marginTop: 0
            }}>
              📸 Issue must be clearly visible inside cropped image
            </p>

            {image && (
              <div style={{
                marginTop: '1px',
                padding: '10px',
                backgroundColor: '#f8f9fa',
                borderRadius: '6px',
                border: '1px solid #e9ecef'
              }}>
                <p style={{
                  margin: '0 0 8px 0',
                  fontSize: '14px',
                  color: '#495057',
                  fontWeight: '500'
                }}>
                  ✅ Image ready for upload
                </p>
                <p style={{
                  margin: '0',
                  fontSize: '12px',
                  color: '#6c757d'
                }}>
                  Image has been cropped to standard dimensions (4:3 aspect ratio)
                </p>
              </div>
            )}
          </div>

          <label className="label-text">Category</label>
          <div className="input-wrapper" style={{ marginTop: "5px" }}>
            <StyledSelect
              className="form-input"
              name="category"
              value={category}
              options={categoryOptions}
              onChange={setCategory}
              required
            />
          </div>

          <label className="label-text">
            <input
              style={{
                accentColor:"#34d399",
                width: '15px',
                height: '15px',
                marginRight: "5px"
              }}
              className="checkbox-style"
              type="checkbox"
              checked={isUrgent}
              onChange={(e) => setIsUrgent(e.target.checked)}
            />
            Mark as urgent
          </label>

          <h3 className="label-text" style={{marginBottom:2}}>Select Location</h3>
          <div className="mt-2" style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", marginTop:2 }}>
            <span className="badge" style={{fontSize:15, margin:4}}>Coordinates</span>
            <span className="text-muted">{coordinates[0]}, {coordinates[1]}</span>
          </div>
          <div className="mt-3">
            <MapPicker coordinates={coordinates} setCoordinates={setCoordinates} />
          </div>

          <button className="button blue mt-4" type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create Issue"}
          </button>
        </form>
      </div>
    </div>
  );
}