import './MainDisplay.css'
import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../../service/peer";
import { useSocket } from "../../context/SocketProvider";
import Mic from "../../Assets/microphone-black-shape.png";
import Video from "../../Assets/zoom.png";
import Call from "../../Assets/phone.png";
import Mute_Mic from "../../Assets/mute-microphone.png";
import No_Video from "../../Assets/no-video.png";
import avatar from '../../Assets/Ellipse 10.png'
import ringtoneSrc from '../../Assets/ringtone.mp3'
import axios from "axios";
import { useReactMediaRecorder } from "react-media-recorder";
import { useNavigate } from "react-router-dom";

const RoomPage = ({ isVideoOn, setIsVideoOn, isMicOn, setIsMicOn }) => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [isCallAccepted, setIsCallAccepted] = useState(false);
  var ringtone = new Audio(ringtoneSrc);
  const [remoteStream, setRemoteStream] = useState();

  // Merging Starts Here
  const [text, setText] = useState(["You:"]);
  const [myStream, setMyStream] = useState(null);
  const [clipNum, setClipNum] = useState(1);
  const modelUrl = "http://localhost:5000/api/translate";
  const navigate = useNavigate();

  const downloadVideo = (blobUrl, fileName) => {
    const a = document.createElement("a");
    a.download = fileName;
    a.href = blobUrl;
    a.classList.add("recorder");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  let it;
  const handleUrl = (blobUrl) => {
    console.log("handling url");
    downloadVideo(blobUrl, `clip${it}`);
    it += 1;
    console.log(blobUrl);
  };

  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({
      video: true,
      onStop: (blobUrl) => handleUrl(blobUrl),
    });

  const setStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    setMyStream(stream);
  };
  const notifyModel = (clipNumIt) => {
    // let currClipNum = clipNum;
    setClipNum((prev) => prev + 1);
    console.log("Response", clipNumIt);
    console.log(`Saved in clip${clipNumIt}.mp4`);
    setTimeout(() => {
      axios
        .post(modelUrl, { name: `clip${clipNumIt}.mp4` })
        .then((response) => {
          console.log("Response:", response.data);
          if (text.length == 0) {
            setText((prev) => [...prev, response.data.translation]);
          } else {
            setText((prev) => [...prev, response.data.translation]);
          }
        })
        .catch((error) => {
          console.error("Error:", error.message);
        });
    }, 400);
  };

  const [intervalId, setIntervalId] = useState(null);
  const [intervalId2, setIntervalId2] = useState(null);

  async function startSendingRecordings() {
    startRecording();
    console.log("Recording Started!");
    await new Promise((resolve) =>
      setTimeout(() => {
        stopRecording();
        notifyModel();
        resolve("done");
      }, 4000)
    );
    console.log("Recording Finished!");
  }

  const deleteClips = () => {
    axios
      .delete("http://localhost:5000/api/deleteClips")
      .then((response) => {
        console.log("Response:", response.data);
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
  };
  // let i = 1;
  // const testingFunc = () => {
  //   console.log(i);
  //   setTimeout(() => {
  //     console.log("stopped");
  //   }, 4000);
  //   i += 1;
  // };

  // const showDemo = () => {
  //   setStream();
  // };
  // const showCaptions = () => {
  //   let words = ["YOU:", "grandpa", "will", "clean", "car"];
  //   setTimeout(() => {
  //     for (let i = 1; i <= 8; i++) {
  //       setTimeout(() => {
  //         if (i == 1) {
  //           setText((prev) => [...prev, words[0], words[1]]);
  //         } else {
  //           setText((prev) => [...prev, words[i]]);
  //         }
  //       }, 3000 * i);
  //     }
  //   }, 1000);
  // };

  const handleMV = async (type) => {
    if (type == "mic") {
      setIsMicOn((prev) => !prev);
      socket.emit("user:msg", { to: remoteSocketId, msg: 'Heyy' });
    } else if (type == "video") {
      if (!isVideoOn) {
        // deleteClips(); NNN
        // setStream(); NNN
        handleCallUser();
        // showDemo();
        // showCaptions();
        // let myintervalId = setInterval(() => {
        //   startSendingRecordings().catch((error) => {
        //     console.error("Error in startSendingRecordings:", error);
        //   });
        // }, 4000);
        // {Comments end here}
        //NNN
        // let myintervalId = setInterval(() => {
        //   startRecording();
        //   document.querySelector(".fiveDots").innerHTML =
        //     '<div id="activeDot" style="top: -53px; left: -12px;">.</div>';
        //   setTimeout(() => {
        //     document.querySelector(".fiveDots").innerHTML = "";
        //   }, 500);
        //   console.log("started");
        // }, 5000);
        // clearInterval(intervalId);
        // setIntervalId(myintervalId);
        // it = 1;
        // setTimeout(() => {
        //   let myintervalId2 = setInterval(() => {
        //     stopRecording();
        //     console.log("stopped");
        //     notifyModel(it);
        //     clearInterval(intervalId2);
        //     setIntervalId2(myintervalId2);
        //   }, 5000);
        // }, 3000);
        //NNN
        // startSendingRecordings(); //Comment
      } else {
        setMyStream(null);
        // clearInterval(intervalId);
        // clearInterval(intervalId2);
        // setIntervalId(null);
        // setIntervalId2(null);
        // setClipNum(1);
        // stopRecording();
        await myStream.getTracks().forEach((track) => track.stop());
      }
      setIsVideoOn((prev) => !prev);
    } else {
      navigate("/");
    }
  };

  //Merging ends here

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    setIsCallAccepted(true);
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      document.querySelector('.call-box').classList.add('show-call-box');
      ringtone.play();
      console.log('ringtone played!');
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);
   
  const handleIncomingMessage = useCallback(({msg})=>{
    setText((prev)=>[...prev,msg])
  },[])

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    socket.on('user:msg',handleIncomingMessage);
    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);
  return (
    <div className="video-content">
      <div className="video-box r-wrapper">
        <div className="call-box">
          <div className="call-box-upper">
            <div className="call-box-avatar">
              <img src={avatar}></img>
            </div>
            <div className="call-box-info">
              <span className="call-box-name">Darshan Poudel</span>
              <span className="call-box-type">is now calling...</span>
            </div>
          </div>
          <div className="call-box-lower">
            <div
              className="call-box-button accept-button"
              onClick={()=>{
                ringtone.pause();
                document.querySelector('.call-box').classList.remove('show-call-box');
                setIsCallAccepted(true);
                console.log('Ringtone Paused!');
                sendStreams();
              }}
            >
              Accept
            </div>
            <div className="call-box-button reject-button" onClick={()=>{
              document.querySelector('.call-box').classList.remove('show-call-box');
            }}>Reject</div>
          </div>
        </div>
        <div className="c_and_s">
          {myStream && <button onClick={sendStreams}>S</button>}
          {remoteSocketId && <button onClick={handleCallUser}>C</button>}
        </div>
        {/* {isVideoOn ? ( */}
        {isCallAccepted ? (
          <>
            <ReactPlayer
              playing
              volume={0}
              height="1000px"
              width="1000px"
              // url={myStream}
              url={remoteStream}
            />
            <div className="my_stream">
              <ReactPlayer
                playing
                volume={0}
                height="100px"
                width="200px"
                url={myStream}
              />
            </div>
          </>
        ) : (
          <img src={No_Video} alt="no_video" />
        )}
        <video className="recorder" src={mediaBlobUrl} controls muted />
      </div>
      <div className="text-box r-wrapper">
        {text.map((word, index) => (
          <span key={index}>{word}</span>
        ))}
      </div>
      <div className="button-box r-wrapper">
        <img
          src={isMicOn ? Mic : Mute_Mic}
          onClick={handleMV.bind(this, "mic")}
          alt="mic"
        />
        <img src={Call} onClick={handleMV.bind(this, "call")} alt="call" />
        <img
          src={isVideoOn ? Video : No_Video}
          onClick={handleMV.bind(this, "video")}
          alt="video"
        />
      </div>
    </div>
  );
  // return (
  //   <div>
  //     <h1>Room Page</h1>
  //     <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
  //     {myStream && <button onClick={sendStreams}>Send Stream</button>}
  //     {remoteSocketId && <button onClick={handleCallUser}>CALL</button>}
  //     {myStream && (
  //       <>
  //         <h1>My Stream</h1>
  //         <ReactPlayer
  //           playing
  //           muted
  //           height="100px"
  //           width="200px"
  //           url={myStream}
  //         />
  //       </>
  //     )}
  //     {remoteStream && (
  //       <>
  //         <h1>Remote Stream</h1>
  //         <ReactPlayer
  //           playing
  //           muted
  //           height="100px"
  //           width="200px"
  //           url={remoteStream}
  //         />
  //       </>
  //     )}
  //   </div>
  // );
};

export default RoomPage;
