import "./App.css";
import { useState, useEffect } from "react";
import * as yup from "yup";

function App() {
  // Get values from inputs
  const [formInputs, setFormInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
    queryType: "",
    isCheck: false,
  });

  // Validation schema using Yup
  const userSchema = yup.object().shape({
    firstName: yup.string().min(4).required("This field is required"),
    lastName: yup.string().min(4).required("This field is required"),
    email: yup
      .string()
      .email("Please enter a valid email address")
      .required("This field is required"),
    message: yup.string().min(6).required("This field is required"),
    queryType: yup
      .string()
      .oneOf(
        ["General Enquiry", "Support Request"],
        "Please select a query type"
      ),
    isCheck: yup
      .boolean()
      .oneOf([true], "To submit this form, please consent to being contacted"),
  });

  // State to track if the form was submitted successfully
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  // Submit the form
  function handleSubmitForm(event) {
    event.preventDefault();
    testValdiation();
    console.log(formInputs);
    setFormInputs(formInputs);
    // Clear Values from inputs after submission
    // setFormInputs({
    //   firstName: "",
    //   lastName: "",
    //   email: "",
    //   message: "",
    //   queryType: "",
    //   isCheck: false,
    // });
  }

  // Test Validation function
  async function testValdiation() {
    try {
      await userSchema.validate(formInputs, {
        abortEarly: false, // Validate all fields and not stop at the first error
      });
      setErrors({}); // Clear errors if validation is successful
      setIsSubmitted(true);
    } catch (error) {
      // Construct a validation errors object
      const validationErrors = {};
      error.inner.forEach((err) => {
        validationErrors[err.path] = err.message;
      });
      setErrors(validationErrors); // Set validation errors
    }
  }

  // OnChange function to update form inputs
  function handleOnChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    setFormInputs({ ...formInputs, [name]: value });
  }

  // Handle Checkbox input value
  function handleCheckboxValue(event) {
    const checkValue = event.target.checked;
    setFormInputs({ ...formInputs, isCheck: checkValue });
  }

  // Save data in the db.json file
  useEffect(() => {
    async function saveData() {
      if (isSubmitted == false) return;
      try {
        await fetch("http://localhost:3001/formInputsValue", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formInputs),
        });
        // if (response.ok) {
        // console.log("Data Saved");
        // } else {
        //   console.error("Error");
        // }
      } catch (error) {
        console.error("Error is:", error);
      }
    }

    saveData();

  }, [isSubmitted, formInputs]);

  return (
    
    <form onSubmit={handleSubmitForm}>
      <h1>Contact Us</h1>
      <div id="fullName">
        <div id="firstName">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            value={formInputs.firstName}
            name="firstName"
            onChange={handleOnChange}
            className={errors.firstName ? "inputError" : ""}
          />
          {errors.firstName ? (
            <p className="error">{errors.firstName}</p>
          ) : null}
        </div>
        <div id="lastName">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={formInputs.lastName}
            name="lastName"
            onChange={handleOnChange}
            className={errors.lastName ? "inputError" : ""}
          />
          {errors.lastName ? <p className="error">{errors.lastName}</p> : null}
        </div>
      </div>
      <label htmlFor="email">Email Address</label>
      <input
        type="text"
        id="email"
        value={formInputs.email}
        name="email"
        onChange={handleOnChange}
        className={errors.email ? "inputError" : "email"}
      />
      {errors.email ? <p className="error">{errors.email}</p> : null}

      <div id="queryTypeWrapper" className="radio-container">
        <label htmlFor="generalEnquiry">Query Type</label>
        <div id="queryTypeOptions">
          <div id="generalEnquiry">
            {formInputs.queryType === "General Enquiry" ? (
              <img
                src="/images/icon-radio-selected.svg"
                onClick={handleOnChange}
              ></img>
            ) : (
              <input
                type="radio"
                id="generalEnquiry"
                name="queryType"
                value="General Enquiry"
                onChange={handleOnChange}
              />
            )}

            <label htmlFor="generalEnquiry" className="no-asterisk">
              General Enquiry
            </label>
          </div>
          <div id="supportRequest">
            {formInputs.queryType === "Support Request" ? (
              <img
                src="/images/icon-radio-selected.svg"
                onClick={handleOnChange}
              ></img>
            ) : (
              <input
                type="radio"
                id="supportRequest"
                name="queryType"
                value="Support Request"
                onChange={handleOnChange}
              />
            )}

            <label htmlFor="supportRequest" className="no-asterisk">
              Support Request
            </label>
          </div>
        </div>
        {errors.queryType ? <p className="error">{errors.queryType}</p> : null}
      </div>
      <div id="message">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          value={formInputs.message}
          name="message"
          onChange={handleOnChange}
          className={errors.message ? "inputError" : "message"}
        ></textarea>
        {errors.message ? <p className="error">{errors.message}</p> : null}
      </div>
      <div id="checkbox-container">
        {formInputs.isCheck ? (
          <img
            src="/images/icon-checkbox-check.svg"
            alt="Checked"
            onClick={handleCheckboxValue}
          />
        ) : (
          <input
            type="checkbox"
            name="isCheck"
            id="isCheck"
            onChange={handleCheckboxValue}
            checked={formInputs.isCheck}
          />
        )}
        <label htmlFor="isCheck">
          I consent to being contacted by the team
        </label>
      </div>
      {errors.isCheck ? <p className="error">{errors.isCheck}</p> : null}

      <button id="btnSubmit" type="submit">
        Submit
      </button>
      {/* Display success message if the form is submitted successfully */}
      {isSubmitted ? (
        <div id="wrapper">
          <div id="messageSentWrapper" className={isSubmitted ? "show" : ""}>
            <div id="messageSent">
              <img src="/images/icon-success-check.svg" alt="" />
              <h2> Message Sent!</h2>
            </div>
            <p>Thanks for completing the form. We&apos;ll be in touch soon!</p>
          </div>
        </div>
      ) : null}
    </form>
  );
}

export default App;
