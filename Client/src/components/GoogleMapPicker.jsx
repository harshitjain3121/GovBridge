import React, { useCallback, useMemo, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader, Autocomplete } from "@react-google-maps/api";

export default function GoogleMapPicker({ coordinates, setCoordinates, apiKey }) {
  const [autocomplete, setAutocomplete] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey || import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const center = useMemo(() => {
    if (coordinates && coordinates[0] !== 0) {
      return { lat: coordinates[1], lng: coordinates[0] };
    }
    return { lat: 20, lng: 77 };
  }, [coordinates]);

  const handlePlaceChanged = useCallback(() => {
    if (!autocomplete) return;
    const place = autocomplete.getPlace();
    if (place && place.geometry && place.geometry.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setCoordinates([lng, lat]);
    }
  }, [autocomplete, setCoordinates]);

  const handleMapClick = useCallback((e) => {
    setCoordinates([e.latLng.lng(), e.latLng.lat()]);
  }, [setCoordinates]);

  if (loadError) {
    return <div className="text-danger">Failed to load Google Maps</div>;
  }

  return (
    <div className="media-box">
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
        <Autocomplete onLoad={setAutocomplete} onPlaceChanged={handlePlaceChanged}>
          <input className="input" type="text" placeholder="Search places..." style={{ maxWidth: 360 }} />
        </Autocomplete>
      </div>
      <div className="media-content" style={{ height: 360 }}>
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={{ height: "100%", width: "100%" }}
            center={center}
            zoom={coordinates && coordinates[0] !== 0 ? 13 : 5}
            onClick={handleMapClick}
          >
            {coordinates && coordinates[0] !== 0 && (
              <Marker position={{ lat: coordinates[1], lng: coordinates[0] }} />
            )}
          </GoogleMap>
        )}
      </div>
    </div>
  );
}


