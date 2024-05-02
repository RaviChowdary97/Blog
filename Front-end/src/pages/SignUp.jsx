import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  console.log(formData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("please fill out all fields");
    }

    try {
      setErrorMessage(null);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success == false) {
        return setErrorMessage(data.message);
      }

      if (res.ok) {
        return navigate("/sign-in");
      }
    } catch (err) {
      setErrorMessage(err.message);
    }
  };
  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(45deg, #C9B0FD, #EA6B50)",
        color: "#FFFFFF",
      }}
    >
      {/* formik should be applied here */}
      <div style={{ width: "80%", maxWidth: "500px" }}>
        <h2 className="text-center" style={{ fontSize: "27px" }}>
          Sign Up
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-2">
            <label style={{ marginBottom: "5px", fontSize: "17px" }}>
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              placeholder="Username"
              style={{
                fontSize: "20px",
                height: "30px",
                padding: "10px 20px",
                width: "100%",
                borderRadius: "5px",
              }}
              onChange={handleChange}
            />
          </div>
          <div className="form-group mb-2">
            <label style={{ marginBottom: "5px", fontSize: "17px" }}>
              Email address
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Email"
              style={{
                fontSize: "20px",
                height: "30px",
                padding: "10px 20px",
                width: "100%",
                borderRadius: "5px",
              }}
              onChange={handleChange}
            />
          </div>
          <div className="form-group mb-4">
            <label style={{ marginBottom: "5px", fontSize: "17px" }}>
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              style={{
                fontSize: "20px",
                height: "30px",
                padding: "10px 20px",
                width: "100%",
                borderRadius: "5px",
              }}
              onChange={handleChange}
            />
          </div>
          <div style={{ display: "grid", flexWrap: "nowrap", gap: "5px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "20px",
              }}
            >
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  fontSize: "1.2rem",

                  backgroundColor: "#007BFF",
                  borderRadius: "10px",
                  width: "100%",
                  background: "linear-gradient(45deg, crimson, yellow)",
                  color: "#FFFFFF",
                }}
              >
                Sign Up
              </button>
            </div>
            <OAuth />
          </div>
        </form>
        <div className="flex mt-2">
          <span>Have an account? </span>
          <Link
            to="/sign-in"
            style={{
              textDecoration: "none",
              color: "black",
              fontWeight: "bold",
            }}
          >
            Sign In
          </Link>
        </div>
        <div
          className="mt-2"
          style={{
            color: "black",
            fontWeight: "bold",
            background: "linear-gradient(45deg, #6a82fb, #fc5c7d)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {errorMessage && <alert>{errorMessage}</alert>}
        </div>
      </div>
    </div>
  );
}
