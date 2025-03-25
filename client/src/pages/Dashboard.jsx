import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDashboardData, addMapData, deleteMap } from "../api";

const Dashboard = () => {
  const [cards, setCards] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMap, setNewMap] = useState({ 
    title: "", 
    description: "", 
    center: ["", ""], 
    zoom: 5 
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDashboardData(token);
        setCards(data);
        setError(null);
      } catch (err) {
        setError("Failed to load dashboard. Please log in again.");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [navigate, token]);

  const handleAddMap = async (e) => {
    e.preventDefault();
    const { title, description, center, zoom } = newMap;

    // Comprehensive form validation
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!description.trim()) {
      setError("Description is required");
      return;
    }
    if (!center[0] || !center[1]) {
      setError("Latitude and Longitude are required");
      return;
    }
    if (!zoom) {
      setError("Zoom level is required");
      return;
    }

    try {
      await addMapData(token, {
        title,
        description,
        center: [parseFloat(center[0]), parseFloat(center[1])],
        zoom: parseInt(zoom),
      });
      
      // Reset form and refresh data
      setNewMap({ title: "", description: "", center: ["", ""], zoom: 5 });
      setShowForm(false);
      
      // Reload dashboard data
      const updatedData = await fetchDashboardData(token);
      setCards(updatedData);
      
      // Success toast/alert could be added here
    } catch (error) {
      console.error("Error adding map data:", error);
      setError("Failed to add map. Please try again.");
    }
  };

  const handleDeleteMap = async (id) => {
    try {
      await deleteMap(token, id);
      
      // Remove the deleted map from local state
      setCards(cards.filter(card => card._id !== id));
    } catch (error) {
      console.error("Error deleting map data:", error);
      setError("Failed to delete map. Please try again.");
    }
  };
  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");
    
    // Redirect to login page
    navigate("/");
  };
  return (
    <div className="container py-4">
      <div className="row align-items-center mb-4">
        <div className="col">
          <h2 className="mb-0">My Maps Dashboard</h2>
        </div>
        <div className="col-auto">
        <button 
            className="btn btn-danger me-2" 
            onClick={handleLogout}
          >
            Logout
          </button>
          <button 
            className={`btn ${showForm ? 'btn-secondary' : 'btn-primary'}`} 
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "Add New Map"}
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      {/* Add Map Form */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <form onSubmit={handleAddMap}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <input
                    type="text"
                    placeholder="Map Title"
                    className="form-control"
                    value={newMap.title}
                    onChange={(e) => setNewMap({ ...newMap, title: e.target.value })}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <input
                    type="text"
                    placeholder="Description"
                    className="form-control"
                    value={newMap.description}
                    onChange={(e) => setNewMap({ ...newMap, description: e.target.value })}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <input
                    type="number"
                    step="any"
                    placeholder="Latitude"
                    className="form-control"
                    value={newMap.center[0]}
                    onChange={(e) => setNewMap({ ...newMap, center: [e.target.value, newMap.center[1]] })}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <input
                    type="number"
                    step="any"
                    placeholder="Longitude"
                    className="form-control"
                    value={newMap.center[1]}
                    onChange={(e) => setNewMap({ ...newMap, center: [newMap.center[0], e.target.value] })}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <input
                    type="number"
                    placeholder="Zoom Level"
                    className="form-control"
                    value={newMap.zoom}
                    onChange={(e) => setNewMap({ ...newMap, zoom: e.target.value })}
                  />
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-success">
                    Create Map
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Maps Grid */}
      {!isLoading && (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {cards.length > 0 ? (
            cards.map((card) => (
              <div key={card._id} className="col">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{card.title}</h5>
                    <p className="card-text text-muted">{card.description}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => navigate(`/map/${card._id}`)}
                      >
                        View Map
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteMap(card._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="alert alert-info text-center" role="alert">
                No maps found. Create your first map!
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;