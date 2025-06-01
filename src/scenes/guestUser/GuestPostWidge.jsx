import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { feedPosts } from "../../api/PostRequest";
import { setPosts } from "../../state";
import GuestPostWidget from "./GuestPostWidget";

const GuestPostWidge = ({ isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);

  const getPosts = async () => {
    let token = "123";
    const response = await feedPosts({
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data) {
      console.log("its workingggggggggggggg");
      const data = response.data;
      dispatch(setPosts({ posts: data }));
    }
  };

  useEffect(() => {
    getPosts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {Array.isArray(posts)
        ? posts.map(
            ({
              _id,
              userId,
              firstName,
              lastName,
              description,
              location,
              picturePath,
              userPicturePath,
              likes,
              comments,
            }) => (
              <GuestPostWidget
                key={_id}
                postId={_id}
                postUserId={userId}
                name={`${firstName} ${lastName}`}
                description={description}
                location={location}
                picturePath={picturePath}
                userPicturePath={userPicturePath}
                likes={likes}
                comments={comments}
              />
            )
          )
        : null}
    </>
  );
};

export default GuestPostWidge;
