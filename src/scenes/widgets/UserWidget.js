import React from 'react'
import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
  DeleteOutlined,
} from "@mui/icons-material";
import TextsmsIcon from '@mui/icons-material/Textsms';
import { Box, Typography, Divider, useTheme, ButtonBase, IconButton, Alert, LinearProgress } from "@mui/material";
import UserImage from "../../components/UserImage";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateIcon from '@mui/icons-material/Create';
import Modal from '@mui/material/Modal';
import { Button, Form, Input } from "antd";
import { setLogin } from '../../state';
import { createUserChat } from '../../api/ChatRequest';
import { editProflePic, editUser, getUserProfile } from '../../api/UserRequest';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Dropzone from 'react-dropzone';
import { toast } from 'react-hot-toast';

const UserWidget = ({ userId, picturePath }) => {

  const [user, setUser] = useState(null);
  const [isCurrUser, setIsCurrUser] = useState(false);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const currUserId = useSelector((state) => state.user);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const dispatch = useDispatch();

  const [loader, setLoader] = useState(false)

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [isImage, setIsImage] = useState(false)

  const [openPic, setOpenPic] = useState(false);
  const [image, setImage] = useState(null);


  useEffect(() => {
    if (userId === currUserId._id) {

      setIsCurrUser(true)

    } else {
      setIsCurrUser(false)

    }
  }, [isCurrUser])


  //Create Chat
  const createChat = async () => {
    const senderId = currUserId._id
    const receiverId = userId

    const response = await createUserChat({ senderId, receiverId })

    console.log(response.data, 'packkk');

    if (response.data) {
      navigate("../chat")
    }
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  //Profile picture Set
  const handleProfilePicture = async () => {
    const formData = new FormData();
    formData.append("userId", currUserId._id)
    if (image) {
      formData.append("picture", image);
      formData.append("picturePath", image.name);
      setIsImage(false)
    } else {
      setIsImage(true)

    }

    //posting post
    const response = await editProflePic(currUserId._id, formData)
    setLoader(true)
    console.log(response, 'noww');
    if (response.data.success) {
      toast.success(response.data.message);
      setImage(null)
      setLoader(false)
      

    } else {
      console.log("erroorrr");
    }


  }


  //edit profilee

  const onFinish = async (values) => {
    try {
      console.log('working');

      const response = await editUser(currUserId._id, values)


      if (response.data.success) {

        dispatch(
          setLogin({
            user: response.data.user,
            token: response.data.token,
          }),

          handleClose()

        );


      } else {
        console.log('vannilaa');

      }
    } catch (error) {
      console.log(error);
    }

  }


  const getUser = async () => {

    const response = await getUserProfile(userId, { headers: { Authorization: `Bearer ${token}` } })
    console.log(response.data, 'its working');

    if (response.data) {
      const data = response.data
      setUser(data);
    }
  }

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const {
    firstName,
    lastName,
    location,
    occupation,
    friends,
  } = user;

  return (
    <WidgetWrapper sx={{ position: "sticky", top: "0" }}>

      {/* FIRST ROW */}

      <FlexBetween gap="0.5rem"
        pb="1.1rem"
        onClick={() => navigate(`/profile`, { state: { userId: userId } })}
      ><FlexBetween gap='1rem'>
          <UserImage image={picturePath} />
          <Box>
            <Typography variant='h4' color={dark} fontWeight="500" sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}>
              {firstName} {lastName}
            </Typography>
            <Typography color={medium}>
              {friends ? friends.length : ""} friends
            </Typography>
          </Box>
        </FlexBetween>
        <ManageAccountsOutlined />
      </FlexBetween>
      <Divider />

      {/* SECOND ROW */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{location}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{occupation}</Typography>
        </Box>



        {isCurrUser ?
          (
            <Box>
              <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
                <CreateIcon fontSize="large" sx={{ color: main }} />
                <ButtonBase onClick={handleOpen} > <Typography color={medium}>Edit Profile</Typography></ButtonBase>
              </Box>
              <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
                <AccountCircleIcon fontSize="large" sx={{ color: main }} />
                <ButtonBase onClick={() => { setOpenPic(!openPic) }} > <Typography color={medium}>Edit Profile Picture</Typography></ButtonBase>

              </Box>
            </Box>
          )
          : <Box display="flex" alignItems="center" gap="1rem">
            <TextsmsIcon fontSize="large" sx={{ cursor: "pointer" }}
              onClick={() => { createChat() }} >Message</TextsmsIcon>

            <Typography color={medium}>Message</Typography>
          </Box>}
      </Box>

      {/* <Divider /> */}

      {/* THIRD ROW */}

      {/* <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Who's viewed your profile</Typography>
          <Typography color={main} fontWeight="500">
            {viewedProfile}
          </Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography color={medium}>Impressions of your post</Typography>
          <Typography color={main} fontWeight="500">
            {impressions}
          </Typography>
        </FlexBetween>
      </Box>

      <Divider /> */}

      {/* FOURTH ROW */}

      {/* <Box p="1rem 0">
        <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
          Social Profiles
        </Typography>

        <FlexBetween gap="1rem" mb="0.5rem">
          <FlexBetween gap="1rem">
            <img src="../assets/twitter.png" alt="twitter" />
            <Box>
              <Typography color={main} fontWeight="500">
                Twitter
              </Typography>
              <Typography color={medium}>Social Network</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: main }} />
        </FlexBetween>

        <FlexBetween gap="1rem">
          <FlexBetween gap="1rem">
            <img src="../assets/linkedin.png" alt="linkedin" />
            <Box>
              <Typography color={main} fontWeight="500">
                Linkedin
              </Typography>
              <Typography color={medium}>Network Platform</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: main }} />
        </FlexBetween>
      </Box> */}

      {/* Edit Your Profileeeee */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit Profile
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>

            <Form layout="vertical" onFinish={onFinish}>

              <Form.Item label={<label style={{ color: "white" }}>First Name</label>} name="firstName" >
                <Input placeholder={currUserId.firstName} />
              </Form.Item>

              <Form.Item label={<label style={{ color: "white" }}>Last Name</label>} name="lastName">
                <Input placeholder={currUserId.lastName} />
              </Form.Item>

              <Form.Item label={<label style={{ color: "white" }}>Location</label>} name="location">
                <Input placeholder={currUserId.location} />
              </Form.Item>

              <Form.Item label={<label style={{ color: "white" }}>Occupation</label>} name="occupation">
                <Input placeholder={currUserId.occupation} />
              </Form.Item>

              <Form.Item name="_id" hidden={true} initialValue={currUserId._id}>
                <Input />

              </Form.Item>

              <div className="d-flex flex-column">
                <Button

                  htmlType="submit"
                >
                  Submit
                </Button>
              </div>
            </Form>
          </Typography>
        </Box>
      </Modal>


      {openPic ? (
        <WidgetWrapper>
          <Box
            border={`1px solid ${medium}`}
            borderRadius="5px"
            mt="1rem"
            p="1rem"
            mb="0.5rem"
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
          <Button
            onClick={handleProfilePicture}
            sx={{
              color: palette.primary.main,
              backgroundColor: palette.primary.main,
              borderRadius: "3rem",
            }}
          >
            Set Profile Picture
          </Button>
        </WidgetWrapper>
      ) : ""}
      {isImage ? (
        <Alert severity="error">Please Select an Image</Alert>
      ) : ""}
      {loader ? (<LinearProgress />) : null}
    </WidgetWrapper>
  )
};



export default UserWidget
