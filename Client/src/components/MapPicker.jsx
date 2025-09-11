import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Import Leaflet marker images
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// Fix default marker icon for React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
});

function LocationMarker({ coordinates, setCoordinates }) {
  useMapEvents({
    click(e) {
      setCoordinates([e.latlng.lng, e.latlng.lat]);
    },
  });

  // Only show marker if coordinates are set
  return coordinates[0] !== 0 ? <Marker position={[coordinates[1], coordinates[0]]} /> : null;
}

function FlyToController({ coordinates }) {
  const map = useMap();
  const prevRef = useRef([0, 0]);
  useEffect(() => {
    if (!coordinates || coordinates[0] === 0) return;
    const [lng, lat] = coordinates;
    const prev = prevRef.current;
    if (prev[0] !== lng || prev[1] !== lat) {
      map.flyTo([lat, lng], Math.max(map.getZoom(), 12), { duration: 0.8 });
      prevRef.current = [lng, lat];
    }
  }, [coordinates, map]);
  return null;
}

export default function MapPicker({ coordinates, setCoordinates }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-detect on mount if coordinates are unset
  useEffect(() => {
    if (!coordinates || coordinates[0] === 0) {
      if (!navigator.geolocation) return;
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCoordinates([longitude, latitude]);
          setLoading(false);
        },
        () => setLoading(false),
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }, []);

  const handleDetect = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    setError("");
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoordinates([longitude, latitude]);
        setLoading(false);
      },
      (err) => {
        setError("Unable to detect location");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="media-box">
      <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "12px", flexWrap: "wrap" }}>
        <button className="button blue" onClick={handleDetect} disabled={loading}>{loading ? "Locating..." : "Detect Current Location"}</button>
      </div>
      {error && <div className="text-danger" style={{ marginBottom: "8px" }}>{error}</div>}
      <div className="media-content" style={{ height: "360px" }}>
        <MapContainer center={[20, 77]} zoom={5} style={{ height: "74%", width: "100%", borderRadius:5 }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          />
          <FlyToController coordinates={coordinates} />
          <LocationMarker coordinates={coordinates} setCoordinates={setCoordinates} />
        </MapContainer>
      </div>
    </div>
  );
}
