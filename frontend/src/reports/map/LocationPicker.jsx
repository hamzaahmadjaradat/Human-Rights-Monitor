import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// إصلاح مسارات الأيقونات الافتراضية
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const LocationSelector = ({ onLocationSelect }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const coords = [e.latlng.lng, e.latlng.lat];
      setPosition(e.latlng);
      onLocationSelect(coords); // GeoJSON-style: [lng, lat]
    },
  });

  return position ? <Marker position={position} /> : null;
};

const LocationPicker = ({
  onLocationSelect,
  center = [31.5, 35.5],
  zoom = 8,
  height = "300px",
  width = "100%",
}) => {
  const [markerCoords, setMarkerCoords] = useState(null);

  const handleSelect = (coords) => {
    setMarkerCoords(coords);
    onLocationSelect(coords);
  };

  const clearLocation = () => {
    setMarkerCoords(null);
    onLocationSelect([0, 0]);
  };

  return (
    <div className="location-picker">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height, width, marginBottom: 15 }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationSelector onLocationSelect={handleSelect} />
        {markerCoords && <Marker position={[markerCoords[1], markerCoords[0]]} />}
      </MapContainer>
      <button type="button" onClick={clearLocation}>
        Clear Location
      </button>
    </div>
  );
};

export default LocationPicker;
