import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

import { fetchMapData } from "../api";

const MapView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mapData, setMapData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  // Custom marker icon
  const customIcon = new Icon({
    iconUrl: "/location-pin.png", // Ensure this path is correct
    iconSize: [38, 38],
    iconAnchor: [19, 38]
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchMapData(token, id);
        
        // Validate map data
        if (!data || !data.center || data.center.length !== 2) {
          throw new Error("Invalid map data");
        }
        
        setMapData(data);
        setError(null);
      } catch (err) {
        console.error("Map loading error:", err);
        setError("Failed to load map. Please try again.");
        
        // Redirect after a short delay
        const timeoutId = setTimeout(() => {
          navigate("/dashboard");
        }, 3000);

        // Cleanup timeout on component unmount
        return () => clearTimeout(timeoutId);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [navigate, token, id]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading map details...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
          <button 
            className="btn btn-sm btn-outline-danger float-end"
            onClick={() => navigate("/dashboard")}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-4">
      <div className="row align-items-center mb-4">
        <div className="col">
          <h2 className="mb-0">{mapData.title}</h2>
          <p className="text-muted">{mapData.description}</p>
        </div>
        <div className="col-auto">
          <button 
            className="btn btn-outline-secondary" 
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <MapContainer 
            center={mapData.center} 
            zoom={mapData.zoom} 
            style={{ height: "500px", width: "100%" }}
            className="rounded"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* Marker for the center point */}
            <Marker 
              position={mapData.center} 
              icon={customIcon}
            >
              <Popup>
                <div>
                  <strong>{mapData.title}</strong>
                  <p>{mapData.description}</p>
                  <small>
                    Lat: {mapData.center[0].toFixed(4)}, 
                    Lng: {mapData.center[1].toFixed(4)}
                  </small>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>

      {/* Additional Map Information */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Map Details</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Latitude
                  <span className="badge bg-primary rounded-pill">
                    {mapData.center[0].toFixed(4)}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Longitude
                  <span className="badge bg-primary rounded-pill">
                    {mapData.center[1].toFixed(4)}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Zoom Level
                  <span className="badge bg-secondary rounded-pill">
                    {mapData.zoom}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Actions</h5>
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => window.open(
                    `https://www.google.com/maps?q=${mapData.center[0]},${mapData.center[1]}`, 
                    '_blank'
                  )}
                >
                  Open in Google Maps
                </button>
                <button 
                  className="btn btn-outline-info"
                  onClick={() => navigator.clipboard.writeText(
                    `${mapData.center[0]}, ${mapData.center[1]}`
                  )}
                >
                  Copy Coordinates
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;