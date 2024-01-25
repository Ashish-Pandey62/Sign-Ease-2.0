import "./MainDisplay.css";
import Mic from "../../Assets/microphone-black-shape.png";
import Video from "../../Assets/zoom.png";
import Call from "../../Assets/phone.png";
import Mute_Mic from "../../Assets/mute-microphone.png";
import No_Video from "../../Assets/no-video.png";
import axios from "axios";
import { useState } from "react";
import ReactPlayer from "react-player";
import { useReactMediaRecorder } from "react-media-recorder";
import { useNavigate } from "react-router-dom";

const MainDisplay = ({ isVideoOn, setIsVideoOn, isMicOn, setIsMicOn }) => {
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
      audio: false,
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
    } else if (type == "video") {
      if (!isVideoOn) {
        // deleteClips(); NNN
        setStream();
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
        //NNNN
        // startSendingRecordings(); //Comment
      } else {
        setMyStream(null);
        //NNN
        // clearInterval(intervalId);
        // clearInterval(intervalId2);
        // setIntervalId(null);
        // setIntervalId2(null);
        // setClipNum(1);
        // stopRecording();
        //NNN
        await myStream.getTracks().forEach((track) => track.stop());
      }
      setIsVideoOn((prev) => !prev);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="video-content">
      <div className="video-box r-wrapper">
        <div className="test">
          <h4>Connected</h4>
          <button>Send Stream</button>
          <button>CALL</button>
        </div>
        {isVideoOn ? (
          <>
            <ReactPlayer
              playing
              volume={0}
              height="1000px"
              width="1000px"
              url={myStream}
            />
            <div className="my_stream">'MYYY'</div>
          </>
        ) : (
          <img src={No_Video} />
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
        />
        <img src={Call} onClick={handleMV.bind(this, "call")} />
        <img
          src={isVideoOn ? Video : No_Video}
          onClick={handleMV.bind(this, "video")}
        />
      </div>
    </div>
  );
};

export default MainDisplay;
