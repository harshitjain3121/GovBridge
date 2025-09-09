import React, { useEffect, useState } from "react";
import API from "../api/axios";
import OfficialResponseForm from "../components/OfficialResponseForm";

export default function Dashboard() {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showResponseForm, setShowResponseForm] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [adminInfo, setAdminInfo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const fetchIssues = async () => {
    try {
  const res = await API.get("/issues");
      setIssues(res.data);
      setFilteredIssues(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // Filter issues based on selected category and status
  const filterIssues = () => {
    let filtered = issues;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(issue => issue.category === selectedCategory);
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter(issue => issue.status === selectedStatus);
    }

    setFilteredIssues(filtered);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedStatus("all");
    setFilteredIssues(issues);
  };

  const fetchAdminInfo = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        const res = await API.get(`/users/${userId}`);
        setAdminInfo(res.data.user);
      }
    } catch (err) {
      console.error("Failed to fetch admin info:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;
    try {
      await API.delete(`/issues/${id}`);
      setIssues(issues.filter((issue) => issue._id !== id));
      setSuccess("Issue deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to delete issue");
      setTimeout(() => setError(""), 3000);
    }
  };

  const toggleResponseForm = (issueId) => {
    setShowResponseForm(prev => ({
      ...prev,
      [issueId]: !prev[issueId]
    }));
  };

  const handleResponseAdded = (issueId, response) => {
    // Update the issue with the new response
    const updatedIssues = issues.map(issue => 
      issue._id === issueId 
        ? { ...issue, officialResponse: [...(issue.officialResponse || []), response] }
        : issue
    );
    
    setIssues(updatedIssues);
    setFilteredIssues(updatedIssues);
    
    setShowResponseForm(prev => ({
      ...prev,
      [issueId]: false
    }));
    setSuccess("Official response added successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return '#22c55e';
      case 'in-progress': return '#f59e0b';
      case 'pending': return '#6b7280';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  useEffect(() => {
    fetchIssues();
    fetchAdminInfo();
  }, []);

  // Filter issues when category or status changes
  useEffect(() => {
    filterIssues();
  }, [selectedCategory, selectedStatus, issues]);

  if (loading) return (
    <div className="container" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
      <div style={{ textAlign: "center" }}>
        <div className="spinner" style={{ width: 40, height: 40, border: "4px solid #ccc", borderTop: "4px solid #007bff", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
        <p>Loading issues...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% {transform: rotate(360deg);} }`}</style>
      </div>
    </div>
  );

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ margin: 0, color: "#1f2937" }}>Admin Dashboard</h1>
          {adminInfo && (
            <p style={{ margin: "4px 0 0 0", color: "#6b7280", fontSize: "14px" }}>
              Welcome back, {adminInfo.name || adminInfo.email}
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span className="badge" style={{ background: "#e0f2fe", color: "#0277bd" }}>
            {filteredIssues.length} of {issues.length} Issues
          </span>
        </div>
      </div>

      {/* Filter Section */}
      <div style={{ 
        background: "#f8fafc", 
        padding: "20px", 
        borderRadius: "12px", 
        marginBottom: "24px",
        border: "1px solid #e2e8f0"
      }}>
        <h3 style={{ margin: "0 0 16px 0", color: "#374151", fontSize: "16px", fontWeight: "600" }}>
          🔍 Filter Issues
        </h3>
        <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
          {/* Category Filter */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                background: "white",
                fontSize: "14px",
                minWidth: "150px"
              }}
            >
              <option value="all">All Categories</option>
              <option value="sanitation">Sanitation</option>
              <option value="road">Road</option>
              <option value="lighting">Lighting</option>
              <option value="water">Water</option>
              <option value="safety">Safety</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                background: "white",
                fontSize: "14px",
                minWidth: "150px"
              }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <div style={{ display: "flex", alignItems: "end" }}>
            <button
              onClick={clearFilters}
              style={{
                padding: "8px 16px",
                background: "#6b7280",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#4b5563";
                e.target.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#6b7280";
                e.target.style.transform = "translateY(0)";
              }}
            >
              Clear Filters
            </button>
          </div>

          {/* Active Filters Display */}
          {(selectedCategory !== "all" || selectedStatus !== "all") && (
            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: "14px", color: "#6b7280" }}>Active filters:</span>
              {selectedCategory !== "all" && (
                <span className="badge" style={{ background: "#dbeafe", color: "#1e40af" }}>
                  Category: {selectedCategory}
                </span>
              )}
              {selectedStatus !== "all" && (
                <span className="badge" style={{ background: "#fef3c7", color: "#92400e" }}>
                  Status: {selectedStatus}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats Section */}
      {issues.length > 0 && (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "16px", 
          marginBottom: "24px" 
        }}>
          <div style={{ 
            background: "#f0f9ff", 
            padding: "16px", 
            borderRadius: "12px", 
            textAlign: "center",
            border: "1px solid #bae6fd"
          }}>
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>📋</div>
            <div style={{ fontSize: "20px", fontWeight: "700", color: "#0369a1" }}>
              {issues.length}
            </div>
            <div style={{ color: "#6b7280", fontSize: "12px" }}>Total Issues</div>
          </div>
          
          <div style={{ 
            background: "#f0fdf4", 
            padding: "16px", 
            borderRadius: "12px", 
            textAlign: "center",
            border: "1px solid #bbf7d0"
          }}>
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>✅</div>
            <div style={{ fontSize: "20px", fontWeight: "700", color: "#166534" }}>
              {issues.filter(issue => issue.status === 'resolved').length}
            </div>
            <div style={{ color: "#6b7280", fontSize: "12px" }}>Resolved</div>
          </div>
          
          <div style={{ 
            background: "#fefce8", 
            padding: "16px", 
            borderRadius: "12px", 
            textAlign: "center",
            border: "1px solid #fde68a"
          }}>
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>⏳</div>
            <div style={{ fontSize: "20px", fontWeight: "700", color: "#92400e" }}>
              {issues.filter(issue => issue.status === 'in-progress').length}
            </div>
            <div style={{ color: "#6b7280", fontSize: "12px" }}>In Progress</div>
          </div>
          
          <div style={{ 
            background: "#fef2f2", 
            padding: "16px", 
            borderRadius: "12px", 
            textAlign: "center",
            border: "1px solid #fecaca"
          }}>
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>⚠️</div>
            <div style={{ fontSize: "20px", fontWeight: "700", color: "#991b1b" }}>
              {issues.filter(issue => issue.isUrgent).length}
            </div>
            <div style={{ color: "#6b7280", fontSize: "12px" }}>Urgent</div>
          </div>
        </div>
      )}

      {error && (
        <div className="badge danger" style={{ marginBottom: "16px", padding: "12px" }}>
          {error}
        </div>
      )}
      
      {success && (
        <div className="badge success" style={{ marginBottom: "16px", padding: "12px" }}>
          {success}
        </div>
      )}

      {filteredIssues.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "40px" }}>
          <h3 style={{ color: "#6b7280", marginBottom: "8px" }}>
            {issues.length === 0 ? "No Issues Found" : "No Issues Match Your Filters"}
          </h3>
          <p style={{ color: "#9ca3af" }}>
            {issues.length === 0 
              ? "There are currently no issues to manage." 
              : "Try adjusting your filter criteria to see more issues."
            }
          </p>
          {issues.length > 0 && (
            <button
              onClick={clearFilters}
              style={{
                marginTop: "16px",
                padding: "10px 20px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer"
              }}
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {filteredIssues.map((issue) => (
            <div key={issue._id} className="card" style={{ position: "relative" }}>
              {/* Issue Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0 0 8px 0", color: "#1f2937" }}>{issue.title}</h3>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                    <span 
                      className="badge" 
                      style={{ 
                        background: getStatusColor(issue.status) + "20", 
                        color: getStatusColor(issue.status),
                        border: `1px solid ${getStatusColor(issue.status)}40`
                      }}
                    >
                      {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                    </span>
                    <span className="badge" style={{ background: "#f3f4f6", color: "#374151" }}>
                      {issue.category}
                    </span>
                    {issue.isUrgent && (
                      <span className="badge" style={{ background: "#fef2f2", color: "#dc2626" }}>
                        ⚠️ Urgent
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  <button 
                    className="button" 
                    onClick={() => toggleResponseForm(issue._id)}
                    style={{ 
                      background: "#10b981", 
                      color: "white",
                      padding: "8px 16px",
                      fontSize: "14px"
                    }}
                  >
                    {showResponseForm[issue._id] ? "Cancel" : "Create Response"}
                  </button>
                  <button 
                    className="button" 
                    onClick={() => handleDelete(issue._id)}
                    style={{ 
                      background: "#ef4444", 
                      color: "white",
                      padding: "8px 16px",
                      fontSize: "14px"
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Issue Description */}
              <p style={{ color: "#4b5563", marginBottom: "12px", lineHeight: "1.5" }}>
                {issue.description}
              </p>

              {/* Issue Image */}
              {issue.image && (
                <div style={{ marginBottom: "12px" }}>
                  <img 
                    src={issue.image} 
                    alt={issue.title}
                    style={{ 
                      maxWidth: "200px", 
                      maxHeight: "150px", 
                      objectFit: "cover", 
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb"
                    }}
                  />
                </div>
              )}

              {/* Issue Stats */}
              <div style={{ display: "flex", gap: "16px", marginBottom: "12px", fontSize: "14px", color: "#6b7280" }}>
                <span>👆 {issue.upvotes?.length || 0} upvotes</span>
                <span>💬 {issue.comments?.length || 0} comments</span>
                <span>📝 {issue.officialResponse?.length || 0} official responses</span>
                <span>📅 {new Date(issue.createdAt).toLocaleDateString()}</span>
              </div>

              {/* Response Form */}
              {showResponseForm[issue._id] && (
                <div style={{ 
                  marginTop: "16px", 
                  padding: "16px", 
                  background: "#f8fafc", 
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0"
                }}>
                  <h4 style={{ margin: "0 0 12px 0", color: "#374151" }}>Create Official Response</h4>
                  <OfficialResponseForm 
                    issueId={issue._id} 
                    onResponseAdded={(response) => handleResponseAdded(issue._id, response)}
                  />
                </div>
              )}

              {/* Existing Official Responses */}
              {issue.officialResponse && issue.officialResponse.length > 0 && (
                <div style={{ marginTop: "16px" }}>
                  <h4 style={{ margin: "0 0 8px 0", color: "#374151", fontSize: "16px" }}>Official Responses</h4>
                  {issue.officialResponse.map((response, index) => (
                    <div key={index} style={{ 
                      padding: "12px", 
                      background: "#f0f9ff", 
                      borderRadius: "6px", 
                      marginBottom: "8px",
                      border: "1px solid #bae6fd"
                    }}>
                      <p style={{ margin: "0 0 4px 0", color: "#1e40af" }}>{response.response}</p>
                      <small style={{ color: "#6b7280" }}>
                        {new Date(response.createdAt).toLocaleString()}
                      </small>
                    </div>
                  ))}
                </div>
              )}
        </div>
      ))}
        </div>
      )}
    </div>
  );
}
