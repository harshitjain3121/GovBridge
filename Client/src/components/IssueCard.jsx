import React from "react";
import { Link } from "react-router-dom";

export default function IssueCard({ issue, handleUpvote, userId, isUpvoting = false }) {
  const hasUpvoted = issue.upvotes?.some((u) => u._id === userId || u === userId) || false;

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return { bg: '#ecfdf5', color: 'var(--color-resolved)', border: '#d1fae5' };
      case 'in-progress': return { bg: '#fffbeb', color: 'var(--color-in-progress)', border: '#fef3c7' };
      case 'pending': return { bg: '#f1f5f9', color: 'var(--color-pending)', border: '#e2e8f0' };
      case 'rejected': return { bg: '#fef2f2', color: 'var(--color-rejected)', border: '#fee2e2' };
      default: return { bg: '#f1f5f9', color: 'var(--color-pending)', border: '#e2e8f0' };
    }
  };

  const statusColors = getStatusColor(issue.status);

  return (
    <div className="card" style={{ 
      position: "relative", 
      display: "flex", 
      flexDirection: window.innerWidth < 768 ? "column" : "row", 
      minHeight: "200px",
      transition: "all 0.2s ease",
      cursor: "pointer",
      overflow: "hidden"
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)";
    }}>
      {/* Urgent Badge */}
      {issue.isUrgent && (
        <div style={{ 
          position: "absolute", 
          top: 16, 
          right: 16, 
          background: "linear-gradient(135deg, var(--color-danger), #b91c1c)", 
          color: "#fff", 
          borderRadius: 20, 
          padding: "6px 12px", 
          fontSize: 12, 
          display: "inline-flex", 
          alignItems: "center", 
          gap: 6,
          fontWeight: "600",
          boxShadow: "0 2px 8px rgba(220, 38, 38, 0.3)",
          zIndex: 2
        }}>
          <span aria-hidden>⚠️</span> Urgent
        </div>
      )}

      {/* Content Section */}
      <div style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column", 
        padding: "20px",
        minWidth: 0
      }}>
        {/* Issue Header */}
        <div style={{ marginBottom: "16px" }}>
          <h3 style={{ 
            margin: "0 0 12px 0", 
            color: "#1f2937", 
            fontSize: "20px",
            fontWeight: "600",
            lineHeight: "1.4"
          }}>
            {issue.title}
          </h3>
          
          {/* Date and Time */}
          <div style={{ 
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 12,
            flexWrap: "wrap"
          }}>
            <span style={{ 
              background: "var(--color-light)", 
              padding: "4px 10px", 
              borderRadius: 16, 
              fontSize: 12,
              color: "var(--color-muted)",
              fontWeight: "500",
              border: "1px solid var(--color-border)"
            }}>
              📅 {issue.createdAt && new Date(issue.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
            <span style={{ 
              background: "#eff6ff", 
              padding: "4px 10px", 
              borderRadius: 16, 
              fontSize: 12,
              color: "var(--color-primary)",
              fontWeight: "500",
              border: "1px solid #bfdbfe"
            }}>
              🕒 {issue.createdAt && new Date(issue.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}
            </span>
          </div>

          {/* Status and Category Badges */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
            <span 
              className="badge" 
              style={{ 
                background: statusColors.bg,
                color: statusColors.color,
                border: `1px solid ${statusColors.border}`,
                fontWeight: "600",
                textTransform: "capitalize"
              }}
            >
              {issue.status}
            </span>
            <span 
              className="badge" 
              style={{ 
                background: "#f0f9ff", 
                color: "var(--color-primary)",
                border: "1px solid #bae6fd",
                fontWeight: "500",
                textTransform: "capitalize"
              }}
            >
              {issue.category}
            </span>
          </div>
        </div>

        {/* Issue Description */}
        <p style={{ 
          color: "var(--color-muted)", 
          lineHeight: "1.6", 
          marginBottom: "16px",
          fontSize: "15px",
          flex: 1
        }}>
          {issue.description.length > 200 
            ? `${issue.description.substring(0, 200)}...` 
            : issue.description
          }
        </p>

        {/* Issue Stats */}
        <div style={{ 
          display: "flex", 
          gap: "20px", 
          marginBottom: "16px", 
          fontSize: "14px", 
          color: "var(--color-muted)",
          flexWrap: "wrap"
        }}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            👆 {issue.upvotes?.length || 0} upvotes
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            💬 {issue.comments?.length || 0} comments
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            📝 {issue.officialResponse?.length || 0} responses
          </span>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          marginTop: "auto", 
          display: "flex", 
          gap: "12px", 
          alignItems: "center", 
          flexWrap: "wrap"
        }}>
          <button 
            className="button" 
            onClick={() => handleUpvote(issue._id)}
            disabled={isUpvoting}
            style={{
              background: hasUpvoted ? "var(--color-success)" : "var(--color-primary)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "12px 20px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: isUpvoting ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              opacity: isUpvoting ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!isUpvoting) {
                e.target.style.transform = "translateY(-1px)";
                e.target.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            {isUpvoting ? (
              <>
                <div style={{
                  width: "12px",
                  height: "12px",
                  border: "2px solid #ffffff",
                  borderTop: "2px solid transparent",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite"
                }} />
                Upvoting...
              </>
            ) : (
              <>
                {hasUpvoted ? "✅" : "👍"} {hasUpvoted ? "Upvoted" : "Upvote"}
              </>
            )}
          </button>
          
          <Link to={`/issues/${issue._id}`} style={{ textDecoration: "none" }}>
            <button 
              className="button secondary"
              style={{
                background: "var(--color-light)",
                color: "var(--color-text)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
                padding: "12px 20px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#e2e8f0";
                e.target.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "var(--color-light)";
                e.target.style.transform = "translateY(0)";
              }}
            >
              👁️ View Details
            </button>
          </Link>
        </div>
      </div>

      {/* Image Section */}
      {issue.image && (
        <div style={{ 
          width: window.innerWidth < 768 ? "100%" : "300px",
          height: window.innerWidth < 768 ? "200px" : "200px",
          flexShrink: 0,
          borderRadius: window.innerWidth < 768 ? "0 0 12px 12px" : "0 12px 12px 0",
          overflow: "hidden",
          border: "1px solid var(--color-border)"
        }}>
          <img 
            src={issue.image} 
            alt={issue.title}
            style={{ 
              width: "100%", 
              height: "100%", 
              objectFit: "cover",
              display: "block"
            }}
          />
        </div>
      )}
    </div>
  );
}
