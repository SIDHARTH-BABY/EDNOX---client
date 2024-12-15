import React from "react";
import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  Alert,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state";
import Dropzone from "react-dropzone";
import FlexBetween from "../../components/FlexBetween";
import toast from "react-hot-toast";
// import otpForm from "./otpForm";


import {  userLogin, userRegister } from "../../api/AuthRequest";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup
    .string()
    .email("invalid email")
    .required("required"),
  password: yup.string().required("required"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picture: yup.string().required("required"),
});
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("invalid email")
    .required("required"),
  password: yup.string().required("required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [passwordLoader, setPasswordLoader] = useState(false);
  const [pageType, setPageType] = useState("login");
  const [regButton, setRegButton] = useState(true);
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  //   REGISTER

  const register = async (values, onSubmitProps) => {
    try {
      // Prepare form data
      const formData = new FormData();
      for (const key in values) {
        if (values.hasOwnProperty(key)) {
          formData.append(key, values[key]);
        }
      }

      // Safely add picturePath
      if (values.picture) {
        formData.append("picturePath", values.picture.name);
      }

      // Debug formData
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`); // Log form data for debugging
      }

      // API call to register user
      const response = await userRegister(formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle response
      if (response.data.success) {
        toast.success("User registered successfully");
        setRegButton(false);

        // Dispatch login action
        dispatch(
          setLogin({
            user: response.data.user,
            token: response.data.token,
          })
        );

        // Navigate to homepage
        navigate("/");
      } else {
        toast.error(
          response.data.error || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      // Extract error message
      const errorMessage = "An unexpected error occurred. Please try again.";

      console.error("Registration Error:", error); // Log error for debugging
      toast.error(errorMessage); // Display user-friendly error
    }
  };

  // LOGIN
  const login = async (values, onSubmitProps) => {
    try {
      console.log("running first", values);
      const response = await userLogin(values);
      console.log(response, "jjjj");

      if (response.status === 400) {
        console.log("erroorrr");
      }

      if (response.data.success) {
        toast.success("User loggeIn successfully");
        dispatch(
          setLogin({
            user: response.data.user,
            token: response.data.token,
          })
        );
        navigate("/");
      } else {
        console.log("password eoor");
        setPasswordLoader(true);
      }
    } catch (error) {
      setPasswordLoader(true);
      console.log(error);
      toast.success(error);
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };
  return (
    <div>
      {passwordLoader ? (
        <Alert
          severity="error"
          sx={{ marginBottom: "25px" }}
          onClose={() => {
            setPasswordLoader(false);
          }}
        >
          Invalid Credentials
        </Alert>
      ) : (
        ""
      )}
     
        <div>
          <Formik
            onSubmit={handleFormSubmit}
            initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
            validationSchema={isLogin ? loginSchema : registerSchema}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              setFieldValue,
              resetForm,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box
                  display="grid"
                  gap="30px"
                  gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                  sx={{
                    "& > div": {
                      gridColumn: isNonMobile ? undefined : "span 4",
                    },
                  }}
                >
                  {isRegister && (
                    <>
                      <TextField
                        label="First Name"
                        name="firstName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.firstName}
                        
                        error={
                          Boolean(touched.firstName) &&
                          Boolean(errors.firstName)
                        }
                        helperText={touched.firstName && errors.firstName}
                        sx={{ gridColumn: "span 2" }}
                      />

                      <TextField
                        label="Last Name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.lastName}
                        name="lastName"
                        error={
                          Boolean(touched.lastName) && Boolean(errors.lastName)
                        }
                        helperText={touched.lastName && errors.lastName}
                        sx={{ gridColumn: "span 2" }}
                      />

                      <TextField
                        label="Location"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.location}
                        name="location"
                        error={
                          Boolean(touched.location) && Boolean(errors.location)
                        }
                        helperText={touched.location && errors.location}
                        sx={{ gridColumn: "span 4" }}
                      />

                      <TextField
                        label="Occupation"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.occupation}
                        name="occupation"
                        error={
                          Boolean(touched.occupation) &&
                          Boolean(errors.occupation)
                        }
                        helperText={touched.occupation && errors.occupation}
                        sx={{ gridColumn: "span 4" }}
                      />
                      <Box
                        gridColumn="span 4"
                        border={`1px solid ${palette.neutral.medium}`}
                        borderRadius="5px"
                        p="1rem"
                      >
                        <Dropzone
                          acceptedFiles=".jpg,.jpeg,.png"
                          multiple={false}
                          onDrop={(acceptedFiles) =>
                            setFieldValue("picture", acceptedFiles[0])
                          }
                        >
                          {({ getRootProps, getInputProps }) => (
                            <Box
                              {...getRootProps()}
                              border={`2px dashed ${palette.primary.main}`}
                              p="1rem"
                              sx={{ "&:hover": { cursor: "pointer" } }}
                            >
                              <input {...getInputProps()} />
                              {!values.picture ? (
                                <p>Add Picture Here</p>
                              ) : (
                                <FlexBetween>
                                  <Typography>{values.picture.name}</Typography>
                                  <EditOutlinedIcon />
                                </FlexBetween>
                              )}
                            </Box>
                          )}
                        </Dropzone>
                        {touched.picture && errors.picture && (
                          <Typography color="error">
                            {errors.picture}
                          </Typography>
                        )}
                      </Box>
                    </>
                  )}

                  <TextField
                    label="Email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    name="email"
                    error={Boolean(touched.email) && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    sx={{ gridColumn: "span 4" }}
                  />

                  <TextField
                    label="Password"
                    type="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    name="password"
                    error={
                      Boolean(touched.password) && Boolean(errors.password)
                    }
                    helperText={touched.password && errors.password}
                    sx={{ gridColumn: "span 4" }}
                  />
                </Box>
                {/* BUTTON   */}

                <Box>
                  {regButton ? (
                    <Button
                      fullWidth
                      type="submit"
                      sx={{
                        m: "2rem 0",
                        p: "1rem",
                        backgroundColor: palette.primary.main,
                        color: palette.background.alt,
                        "&:hover": { color: palette.primary.main },
                      }}
                    >
                      {isLogin ? "LOGIN" : "REGISTER"}
                    </Button>
                  ) : null}
                  <Typography
                    onClick={() => {
                      setPageType(isLogin ? "register" : "login");
                      resetForm();
                    }}
                    sx={{
                      textDecoration: "underline",
                      color: palette.primary.main,
                      "&:hover": {
                        cursor: "pointer",
                        color: palette.primary.light,
                      },
                    }}
                  >
                    {isLogin
                      ? "Don't have an account? Sign Up here."
                      : "Already have an account? Login here."}
                  </Typography>
                </Box>
              </form>
            )}
          </Formik>
        </div>
     

    </div>
  );
};

export default Form;
