import React from 'react'
import {
    EditOutlined,
    DeleteOutlined,
    AttachFileOutlined,
    GifBoxOutlined,
    ImageOutlined,
    MicOutlined,
    MoreHorizOutlined,
} from "@mui/icons-material";
import {
    Box,
    Divider,
    Typography,
    InputBase,
    useTheme,
    Button,
    IconButton,
    useMediaQuery,
    LinearProgress,
} from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "../../components/UserImage";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state"
import { PostData } from '../../api/PostRequest';

const MyPostWidget = ({ picturePath }) => {
    const dispatch = useDispatch();
    const [isImage, setIsImage] = useState(false);
    const [isClip, setIsClip] = useState(false);
    const [image, setImage] = useState(null);
    const [post, setPost] = useState("");
    const { palette } = useTheme();
    const { _id } = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const mediumMain = palette.neutral.mediumMain;
    const medium = palette.neutral.medium;

    const [loader, setLoader] = useState(false)

    const handlePost = async () => {
        const formData = new FormData();
        formData.append("userId", _id)
        formData.append("description", post)

        if (image) {
            formData.append("picture", image);
            formData.append("picturePath", image.name);
        }
        setLoader(true)
        //posting post
        const response = await PostData(formData, { headers: { Authorization: `Bearer ${token}` }, })
        console.log(response.data, 'user post chytha dataa');

        if (response.data) {
            const posts = response.data
            dispatch(setPosts({ posts }));
            setImage(null);
            setPost("");
            setLoader(false)

        }


    }
    // const register = async (values, onSubmitProps) => {
    //     try {
    //       const formData = new FormData();
    //       for (let value in values) {
    //         formData.append(value, values[value]);
    //       }
    //       formData.append("picturePath", values.picture.name);
    
    //       const email = formData.get("email");
    //       const password = formData.get("password");
    //       const firstName = formData.get("firstName");
    //       const lastName = formData.get("lastName");
    //       const location = formData.get("location");
    //       const occupation = formData.get("occupation");
    //       const picturePath = formData.get("picturePath");
    //       console.log(
    //         firstName,
    //         lastName,
    //         location,
    //         occupation,
    //         picturePath,
    //         email,
    //         "coming values"
    //       );
    //       const emailExists = await checkEmailExists(email);
    //       if (emailExists) {
    //         console.error("This email is already in use.");
    //         return;
    //       }
    //       const authResult = await createUserWithEmailAndPassword(
    //         auth,
    //         email,
    //         password
    //       );
    //       const user = authResult.user;
    //       console.log(user, "User created");
    //       if (!user) throw new Error("User creation failed");
    //       if (user) {
    //         await setDoc(doc(db, "Users", user.uid), {
    //           firstName,
    //           lastName,
    //           location,
    //           occupation,
    //           picturePath,
    //           email,
    //           isAdmin:false,
    //           seenNotifications:[],
    //           unseenNotifications:[],
    //           Active:true,
    //           impressions: 1,
    //           _id:user.uid
    //         });
    //         console.log("User registered successfully");
    //         toast.success("User registered successfully");
    //       }
    //     } catch (error) {
    //       console.error("Registration error:", error);
    //       const errorMessage =
    //         error.message ||
    //         "Something went wrong during registration. Please try again.";
    //       toast.error(errorMessage);
    //     }
    //   };

    return (
        <WidgetWrapper>
            <FlexBetween gap="1.5rem">
                <UserImage image={picturePath} />
                <InputBase
                    placeholder="What's on your mind..."
                    onChange={(e) => setPost(e.target.value)}
                    value={post}
                    sx={{
                        width: "100%",
                        backgroundColor: palette.neutral.light,
                        borderRadius: "2rem",
                        padding: "1rem 2rem",
                    }}
                />
            </FlexBetween>
            {isImage && (
                <Box
                    border={`1px solid ${medium}`}
                    borderRadius="5px"
                    mt="1rem"
                    p="1rem"
                >
                    <Dropzone
                        acceptedFiles=".jpg,.jpeg,.png"
                        multiple={false}
                        onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <FlexBetween>
                                <Box
                                    {...getRootProps()}
                                    border={`2px dashed ${palette.primary.main}`}
                                    p="1rem"
                                    width="100%"
                                    sx={{ "&:hover": { cursor: "pointer" } }}
                                >
                                    <input {...getInputProps()} />
                                    {!image ? (
                                        <p>Add Image Here</p>
                                    ) : (
                                        <FlexBetween>
                                            <Typography>{image.name}</Typography>
                                            <EditOutlined />
                                        </FlexBetween>
                                    )}
                                </Box>
                                {image && (
                                    <IconButton
                                        onClick={() => setImage(null)}
                                        sx={{ width: "15%" }}
                                    >
                                        <DeleteOutlined />
                                    </IconButton>
                                )}
                            </FlexBetween>
                        )}
                    </Dropzone>
                </Box>
            )}





            <Divider sx={{ margin: "1.25rem 0" }} />

            <FlexBetween>
                <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
                    {/* { isImage ippo ullathin nere opposite akkkumm} */}
                    <ImageOutlined sx={{ color: mediumMain }} />
                    <Typography
                        color={mediumMain}
                        sx={{ "&:hover": { cursor: "pointer", color: medium } }}
                    >
                        Image
                    </Typography>
                </FlexBetween>

                {isNonMobileScreens ? (
                    <>

                        <Typography color="primary">Explore With Us</Typography>
                        {/* <FlexBetween gap="0.25rem">
                            <GifBoxOutlined sx={{ color: mediumMain }} />
                            <Typography color={mediumMain}>Clip</Typography>
                        </FlexBetween>

                        <FlexBetween gap="0.25rem" onClick={() => setIsClip(!isClip)}>
                            <AttachFileOutlined sx={{ color: mediumMain }} />
                            <Typography color={mediumMain}>Attachment</Typography>
                        </FlexBetween>

                        <FlexBetween gap="0.25rem">
                            <MicOutlined sx={{ color: mediumMain }} />
                            <Typography color={mediumMain}>Audio</Typography>
                        </FlexBetween> */}
                    </>
                ) : (
                    <FlexBetween gap="0.25rem">
                        <MoreHorizOutlined sx={{ color: mediumMain }} />
                    </FlexBetween>
                )}

                <Button
                    disabled={!post}
                    onClick={handlePost}
                    sx={{
                        color: palette.background.alt3,
                        backgroundColor: palette.primary.main,
                        borderRadius: "3rem",
                    }}
                >
                    POST
                </Button>
            </FlexBetween>
            <Box mt="1rem">
                {loader ? (<LinearProgress color="secondary" />) : null}
            </Box>

        </WidgetWrapper>
    )
}

export default MyPostWidget
