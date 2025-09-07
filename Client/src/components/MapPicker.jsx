import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
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

export default function MapPicker({ coordinates, setCoordinates }) {
  return (
    <MapContainer center={[20, 77]} zoom={5} style={{ height: "300px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
      />
      <LocationMarker coordinates={coordinates} setCoordinates={setCoordinates} />
    </MapContainer>
  );
}
