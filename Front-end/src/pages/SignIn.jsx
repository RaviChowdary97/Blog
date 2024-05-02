import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";
export default function SignUp() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  console.log(formData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("please fill out all fields"));
    }

    try {
      dispatch(signInStart);
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success == false) {
        dispatch(signInFailure(data.message));
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        return navigate("/");
      }
    } catch (err) {
      dispatch(signInFailure(err.message));
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
        <h2 className="text-center" style={{ fontSize: "30px" }}>
          Sign In
        </h2>
        <form onSubmit={handleSubmit}>
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
          <div style={{ display: "grid", flexWrap: "nowrap", gap: "10px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "20px",
              }}
            >
              <button
                type="submit"
                className="btn "
                style={{
                  fontSize: "1.2rem",

                  backgroundColor: "#007BFF",
                  borderRadius: "10px",
                  width: "100%",
                  background: "linear-gradient(45deg, crimson, yellow)",
                  color: "#FFFFFF",
                }}
              >
                {loading ? (
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>

            <OAuth />
          </div>
        </form>
        <div className="flex mt-2">
          <span>Don't Have an account? </span>
          <Link
            to="/sign-up"
            style={{
              textDecoration: "none",
              color: "black",
              fontWeight: "bold",
            }}
          >
            Sign Up
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
