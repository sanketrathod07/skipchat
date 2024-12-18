import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";

export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 1000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { username, password } = values;
    if (username === "") {
      toast.error("Username is required.", toastOptions);
      return false;
    }
    if (password === "") {
      toast.error("Password is required.", toastOptions);
      return false;
    }
    return true;
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { username, password } = values;
      try {
        const { data } = await axios.post(loginRoute, {
          username,
          password,
        });
        if (data.status === false) {
          toast.error(data.msg, toastOptions);
        }
        if (data.status === true) {
          toast.success("Login successful!", toastOptions);
          localStorage.setItem(
            process.env.REACT_APP_LOCALHOST_KEY,
            JSON.stringify(data.user)
          );
          navigate("/");
        }
      } catch (error) {
        toast.error("An error occurred. Please try again later.", toastOptions);
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>Skip Chat</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={handleChange}
            minLength="3" // Ensuring minimum length for username
            required // Making it a required field
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            required // Making it a required field
          />
          <button type="submit">Log In</button>
          <span className="span">
            Don't have an account? <Link to="/register">Create One.</Link>
          </span>
        </form>
      </FormContainer>
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;

  @media screen and (max-width: 700px) {
    padding: 0rem 2rem;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;

    img {
      height: 5rem;
      @media screen and (max-width: 700px) {
        height: 3rem;
      }
    }

    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 1rem;
    padding: 5rem;

    @media screen and (max-width: 700px) {
      padding: 4rem 2rem;
      width: 100%;
    }
  }

  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;

    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }

    @media screen and (max-width: 700px) {
      padding: 0.7rem;
      font-size: 0.9rem;
    }
  }

  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;

    &:hover {
      background-color: #4e0eff;
    }
  }

  span {
    color: white;
    text-transform: uppercase;

    @media screen and (max-width: 700px) {
      font-size: 10px;
    }

    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;
