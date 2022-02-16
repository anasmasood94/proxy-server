import React, { useState } from "react";
import axios from "axios";

function SignIn() {
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const submitForm = (e) => {
    e.preventDefault();
    console.log(formValues);

    axios
      .post("http://localhost:8080/users/login", {
        email: formValues.email,
        password: formValues.password,
      })
      .then((res) => {
        alert("Credentials stored suucessfully");
        setFormValues({ email: "", password: "" });
      })
      .catch((err) => {
        alert("Error occured , Please try again later");
      });
  };

  return (
    <div className="SignIn">
      <form onSubmit={submitForm}>
        <h3>Sign In</h3>
        <div className="form-group">
          <label>Email address</label>
          <input
            required
            type="email"
            className="form-control"
            placeholder="Enter email"
            value={formValues.email}
            onChange={(e) =>
              setFormValues({ ...formValues, email: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            required
            type="password"
            className="form-control"
            placeholder="Enter password"
            value={formValues.password}
            onChange={(e) =>
              setFormValues({ ...formValues, password: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-primary btn-block my-2">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignIn;
