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

import OtpFormm from "./OtpFormm";
import { sendOtp, userLogin, userRegister } from "../../api/AuthRequest";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, db, googleProvider, imgStorage } from "../../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {ref,uploadBytes,getDownloadURL} from "firebase/storage"
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

const FirebaseForm = () => {
  const [passwordLoader, setPasswordLoader] = useState(false);
  const [pageType, setPageType] = useState("login");
  const [otpField, setOtpField] = useState(false);
  const [otp, setOtp] = useState("");
  const [userDetails, setUserDetails] = useState();
  const [regButton, setRegButton] = useState(true);
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";
  const [url,setUrl] = useState(null)
  const checkEmailExists = async (email) => {
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      return signInMethods.length > 0; // Email exists if sign-in methods are returned
    } catch (error) {
      toast.error("email already exist");
      return false;
    }
  };
  //   REGISTER
  const register = async (values, onSubmitProps) => {
    try {
      const formData = new FormData();
      for (let value in values) {
        formData.append(value, values[value]);
      }
      formData.append("picturePath", values.picture.name);

      const email = formData.get("email");
      const password = formData.get("password");
      const firstName = formData.get("firstName");
      const lastName = formData.get("lastName");
      const location = formData.get("location");
      const occupation = formData.get("occupation");
      const picturePath = formData.get("picturePath");
      console.log(
        firstName,
        lastName,
        location,
        occupation,
        picturePath,
        email,
        "coming values"
      );
      
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        console.error("This email is already in use.");
        return;
      }
      const imageRef = ref(imgStorage,"image")
      uploadBytes(imageRef,picturePath).then(()=>{ 
        getDownloadURL(imageRef).then((url)=>{
            console.log(url,'url');
            
            setUrl(url)
        }).catch((err)=>{
            console.log(err,'sec');
            
        })
      }).catch((err)=>{
        console.log(err,'first');
        
      })
      const authResult = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = authResult.user;
      console.log(user, "User created");
      if (!user) throw new Error("User creation failed");
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          firstName,
          lastName,
          location,
          occupation,
          picturePath: url,
          email,
          isAdmin:false,
          seenNotifications:[],
          unseenNotifications:[],
          Active:true,
          impressions: 1,
          _id:user.uid
        });
        console.log("User registered successfully");
        toast.success("User registered successfully");
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        error.message ||
        "Something went wrong during registration. Please try again.";
      toast.error(errorMessage);
    }
  };

  // LOGIN
  const login = async (values, onSubmitProps) => {
    try {
      console.log("running first", values);
      const { email, password } = values;
      console.log("email, password", email, password);

      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response, "jjjj");
      if (response.user) {
        auth.onAuthStateChanged(async (user) => {
          console.log(user, "user comign here");
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          console.log(docSnap.data(),'doc snapp');
          
          if (docSnap) {
            dispatch(
              setLogin({
                user: docSnap.data(),
                token: response.user.accessToken,
              })
            );
            navigate("/");
          }
        });
      }
      if (response.status === 400) {
        console.log("erroorrr");
      }

      if (response.data.success) {
        toast.success("User registered successfully");

        dispatch(
          setLogin({
            user: response.data.user,
            token: response.user.accessToken,
          })
        );
        navigate("/");
      } else {
        console.log("password error");
        setPasswordLoader(true);
      }
    } catch (error) {
      setPasswordLoader(true);
      console.log(error);
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  const signInWithGoogle = async () => {
    try {
      // Ensure auth and googleProvider are correctly initialized
      const result = await signInWithPopup(auth, googleProvider);
      console.log("User signed in:", result.user);
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
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
      {!otpField ? (
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
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.firstName}
                        name="firstName"
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
          <Box>
            {/* <Button
        fullWidth
        onClick={signInWithGoogle} // Attach the function here without wrapping it
        sx={{
          m: "2rem 0",
          p: "1rem",
          backgroundColor: palette.neutral.mediumMain,
          color: palette.background.alt,
          "&:hover": { color: palette.primary.main },
        }}
      >
        {isLogin ? "SIGN IN WITH GOOGLE" : "REGISTER"}
      </Button> */}
          </Box>
        </div>
      ) : null}
      {otpField ? (
        <OtpFormm
          userDetails={userDetails}
          otp={otp}
          setPageType={setPageType}
          setOtpField={setOtpField}
          setRegButton={setRegButton}
        />
      ) : null}
    </div>
  );
};

export default FirebaseForm;
