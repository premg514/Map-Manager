import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear previous errors when user starts typing
    setError(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    // Prevent empty submissions
    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    try {
      setIsSubmitting(true);
      const data = await loginUser(formData.username, formData.password);
      
      // Store authentication token
      localStorage.setItem("token", data.token);
      
      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      // Handle login errors
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Welcome Back</h2>

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

              <form onSubmit={handleLogin} noValidate>
                {/* Username Input */}
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-person"></i>
                    </span>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      className="form-control"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label htmlFor="password" className="form-label mb-0">Password</label>
                    <Link to="/forgot-password" className="small text-muted">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock"></i>
                    </span>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="form-control"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span 
                          className="spinner-border spinner-border-sm me-2" 
                          role="status" 
                          aria-hidden="true"
                        ></span>
                        Logging in...
                      </>
                    ) : (
                      "Log In"
                    )}
                  </button>
                </div>
              </form>

              {/* Social Login Divider (Optional) */}
              <div className="my-4 d-flex align-items-center">
                <hr className="flex-grow-1" />
                <span className="px-3 text-muted">or</span>
                <hr className="flex-grow-1" />
              </div>

             
            </div>

            {/* Footer Link */}
            <div className="card-footer text-center py-3">
              Don't have an account? 
              <Link to="/register" className="ms-2 link-primary">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;