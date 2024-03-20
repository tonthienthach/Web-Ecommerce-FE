import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Container, Button } from "react-bootstrap";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import "./MessageAdminPage.css";
import MessageItem from "../../components/MessageItem";
import messageApi from "../../axios/messageApi";
import io from "socket.io-client";
import Slider from "react-slick";
import ClearIcon from "@mui/icons-material/Clear";
import CropOriginalIcon from "@mui/icons-material/CropOriginal";
import MessageListItem from "../../components/MessageListItem";
import { Alert } from "react-bootstrap";

const socket = io(process.env.URL_API, {
  transports: ["websocket"],
});

function MessageAdminPage() {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [userSelected, setUserSelected] = useState(null);
  const [listImage, setListImage] = useState([]);
  const [txtMess, setTxtMess] = useState("");
  const user = useSelector((state) => state.user);
  const chatContainerRef = useRef(null);

  const handleSelectUser = async (user) => {
    if (userSelected) {
      await messageApi.updateLastSeen({
        messageId: messages[messages.length - 1]._id,
        user: user?.user?._id,
      });
    }
    setUserSelected(user);
    setMessages([]);
  };

  const sendMessage = () => {
    if (!txtMess && !listImage.length) return;
    const msg = {
      user: userSelected?._id,
      admin: user?.user?._id,
      textMessage: txtMess,
      file: listImage,
    };
    socket.emit("sendMessage", msg);
    setTxtMess("");
    setListImage([]);
  };

  // const handleSelectImage = (e) => {
  //   console.log("images", e.target.files);
  //   setListImage([...listImage, URL.createObjectURL(e.target.files[0])]);
  // };

  const handleDeleteImage = (item) => {
    const newListImage = listImage.filter((image) => image !== item);
    setListImage(newListImage);
  };

  function showWidget() {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dtksctz3g",
        uploadPreset: "o2ijzzgc",
      },
      (error, result) => {
        if (!error && result.event === "success") {
          console.log("upload", result.info.url);
          setListImage([...listImage, result.info.url]);
        }
      }
    );
    widget.open();
  }

  useEffect(() => {
    const getConversation = async () => {
      const { data } = await messageApi.getAllConversation();
      setConversations(data?.data);
      console.log("conversation", data);
    };
    getConversation();

    const getMessageByUser = async () => {
      if (!userSelected) return;
      const { data } = await messageApi.getMessageByUser(userSelected?._id);
      if (data?.data?.length) {
        setMessages(data.data);
      }
    };
    getMessageByUser();
  }, [userSelected]);

  useEffect(() => {
    // Cuộn xuống cuối khi có thay đổi trong messages
    chatContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket.io.on("open", () => {
      console.log("connected");
    });
    console.log("CHAT_" + userSelected?._id);
    socket.on("CHAT_" + userSelected?._id, (data) => {
      console.log("====================================");
      console.log("data", data);
      console.log("====================================");
      setMessages([...messages, data]);
      // setConversations((item) => {
      //   let newListConversation = item.map((conversation) => {
      //     if (conversation._id === data.conversation) {
      //       conversation.lastMessage = data;
      //     }
      //     return conversation;
      //   });
      //   return newListConversation;
      // });
    });
    socket.on("get_conversation", (data) => {
      console.log("====================================");
      console.log("data", data);
      console.log("====================================");
      setConversations(data);
    });
    return () => {
      socket.io.on("close", () => {
        console.log("unconnected");
      });
      socket.emit("sendLastSeen", {
        conversationId: messages[messages.length - 1],
        userId: user?.user?._id,
      });
      // socket.removeAllListeners();
    };
  }, [messages, userSelected]);

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          height: "100%",
          position: "relative",
          backgroundColor: "white",
        }}
      >
        <List sx={{ paddingRight: 2, width: "30%" }}>
          {conversations.map((item, i) => (
            <div key={i} onClick={() => handleSelectUser(item.user)}>
              <MessageListItem
                item={item}
                socket={socket}
                userSelected={userSelected}
              ></MessageListItem>
            </div>
          ))}
        </List>

        <Box
          component="main"
          sx={{
            //   flexGrow: 1,
            p: 3,
            height: "100%",
            width: "70%",
            borderLeft: "1px solid #C0C0C0",
            //   position: "fixed",
            //   left: "38%",
            //   // right: "14%",
            backgroundColor: "white",
          }}
        >
          {/* Your main content goes here */}
          {userSelected ? (
            <>
              <Stack
                direction="row"
                spacing={2}
                className="d-flex align-items-center mb-2"
              >
                <Avatar
                  alt={userSelected.name}
                  src={userSelected.avatar}
                  sx={{ width: 54, height: 54 }}
                />
                <Typography variant="h6">{userSelected.name}</Typography>
              </Stack>
              <Divider />
              <CardContent className="w-100 position-relative">
                <Stack className="w-100">
                  <Stack className="message-body mb-4">
                    {messages.map((message, idx) => (
                      <MessageItem
                        key={idx}
                        type={
                          message.sender === user?.user._id ? "send" : "receive"
                        }
                        message={message}
                      />
                    ))}
                    <div ref={chatContainerRef}></div>
                  </Stack>
                  <div className="section-input">
                    <div className="list-image">
                      {/* <ImageList sx={{ width: "100%", height: 150 }} cols={8}>
                    {itemData.map((item) => (
                      <ImageListItem key={item.img}>
                        <img
                          srcSet={`${item.img}`}
                          src={`${item.img}`}
                          alt={item.title}
                          className="img-message"
                          loading="lazy"
                        />
                      </ImageListItem>
                    ))}
                  </ImageList> */}
                      <Slider {...settings} slidesToShow={8}>
                        {listImage.map((item, idx) => (
                          <div key={idx} className="m-2">
                            <div className=" position-relative img-message">
                              <img
                                src={item}
                                alt={"img"}
                                className="img-message"
                              />
                              <Button
                                variant="outline"
                                className="p-0 btn-clear-img"
                                onClick={() => {
                                  handleDeleteImage(item);
                                }}
                              >
                                <ClearIcon
                                  className="border rounded-circle"
                                  sx={{
                                    fontSize: 18,
                                    color: "black",
                                    borderColor: "black",
                                    backgroundColor: "white",
                                  }}
                                ></ClearIcon>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </Slider>
                    </div>
                    <div className="d-flex align-items-center bg-white ">
                      <Button
                        variant="contained"
                        // className="mb-2 me-2"
                        onClick={showWidget}
                      >
                        <CropOriginalIcon
                          sx={{ fontSize: 32 }}
                        ></CropOriginalIcon>
                      </Button>
                      <div
                        className="input-group mt-2"
                        style={{ width: "86%" }}
                      >
                        {/* <input
                      type="file"
                      name=""
                      id="fileInput"
                      accept="image/*"
                      className="d-none"
                      onChange={(e) => handleSelectImage(e)}
                    />
                    <label htmlFor="fileInput">
                      <CropOriginalIcon
                        sx={{ fontSize: 32 }}
                      ></CropOriginalIcon>
                    </label> */}

                        <input
                          value={txtMess}
                          type="text"
                          className="form-control"
                          placeholder="Aa"
                          onChange={(e) => setTxtMess(e.target.value)}
                        />
                        <button
                          className="btn btn-send"
                          type="button"
                          id="button-addon2"
                          onClick={(e) => sendMessage()}
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                </Stack>
              </CardContent>
            </>
          ) : (
            <CardContent className="message-body-no-data">
              <Alert variant="info" className="text-center">
                No message available
              </Alert>
            </CardContent>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToScroll: 1,
};

export default MessageAdminPage;
