

const socket = io("/");


// alloting personal code to a user right after joining////////////////////////////////////////////////////////
socket.on("connect", ()=>
{
  allotPersonalCode(socket.id);
});

const allotPersonalCode =(p)=> 
{
  const my_code_value_paragraph = document.getElementById("my-code-value-paragraph")
  my_code_value_paragraph.innerHTML = p;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Copy Button : Copying personal code to the clipboard//////////////////////////////////////////////////////////
const my_code_copy_button =  document.getElementsByClassName("my-code-copy-button")[0];

my_code_copy_button.addEventListener("click", ()=>
{
  const p= socket.id;
  navigator.clipboard && navigator.clipboard.writeText(p);
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/// Start Meet Button : Sending call to the other user based on the entered code in the text box below///////////////////////
const startMeet= document.getElementById("Start-Meet");

startMeet.addEventListener("click", ()=>
{
  const calling_code = document.getElementById("connect_input_box").value;
  sendCall(calling_code);    
})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// sending call to the sever//////////////////////////////////////////////////////////////
const sendCall = (calling_code) =>{
  socket.emit("calling-offer", calling_code );  
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//Case 1: The user associated with the entered code is already in a meet wih someone else////////////////////////////
socket.on("user_busy", () =>
{
  const callFailed = document.createElement("div");
  const callFailedContent = document.createElement("div");
  callFailed.classList.add("callFailed_wrapper");
  callFailedContent.classList.add("callFailed_content");
  callFailed.appendChild(callFailedContent);

  const title = document.createElement("p");
  title.classList.add("callFailed_title");
  title.innerHTML = "User Busy." 


  callFailedContent.appendChild(title);
  const callFailedHtml = document.getElementById("callFailed");
  callFailedHtml.appendChild(callFailed);

  setTimeout((function(){ 
    callFailedHtml.querySelectorAll("*").forEach( (e)=> e.remove());
    }), 2000);

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Case 2: The entered code is incorrect. No user present associated with the code./////////////////////////////////////
socket.on("code_wrong", () =>
{
  //console.log(1);
  const callFailed = document.createElement("div");
  const callFailedContent = document.createElement("div");
  callFailed.classList.add("callFailed_wrapper");
  callFailedContent.classList.add("callFailed_content");
  callFailed.appendChild(callFailedContent);

  const title = document.createElement("p");
  title.classList.add("callFailed_title");
  title.innerHTML = "Code is Incorrect"

  callFailedContent.appendChild(title);
  const callFailedHtml = document.getElementById("callFailed");
  callFailedHtml.appendChild(callFailed);

  setTimeout((function(){ 
    callFailedHtml.querySelectorAll("*").forEach( (e)=> e.remove());
    }), 2000);
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//socketId-> This will be the the socket Id / personal code of the user on the other side if the call is successful./////////
let socketId;

// Case 3: Call send Successfully. Two Users connected.////////////////////////////////////////////////////////////////
socket.on("call-successful", (data) =>
{
  // First set up call view
  setUpCallView();
  socketId= data;

  // Create the peer connection on both sides.
  createPeerConnection();  
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Setting the view of the video call and chat window: Displaying the necessary text box and buttons.///////////////////

const setUpCallView = () => 
{
 
  const connectContainer = document.getElementById("connect_container");
  displayNone(connectContainer);

  const newMessageInput = document.getElementById("new_message");
  display(newMessageInput);

  const startVideo = document.getElementById("startVideo");
  display(startVideo);

};

const startVideoFunction=() =>
{
  const callButtons = document.getElementById("call_buttons");
  display(callButtons);

  const placeholder = document.getElementById("video_placeholder");
  displayNone(placeholder);

  const remoteVideo = document.getElementById("remote_video");
  display(remoteVideo);

  const startVideo = document.getElementById("startVideo");
  displayNone(startVideo); 
}

const startVideoButton = document.getElementById("startVideoButton");
startVideoButton.addEventListener("click",()=>
{
  startVideoFunction();
  socket.emit("start-videocall", (socketId));
})

socket.on("start-videocall",() => 
{
 startVideoFunction();
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// adding "display_none" class to an element: Hide the element /////////////////////////////////////////////////////////
const displayNone = (element) => {
  if (!element.classList.contains("display_none")); 
  {
    element.classList.add("display_none");
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// removing "display_none" class if added to the element: Show the element /////////////////////////////////////////
const display = (element) => {
  if (element.classList.contains("display_none")) {
    element.classList.remove("display_none");
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// acessing local camera and microphone and showing that in local preview//////////////////////////////////////////////
let myVideoStream;
const myVideo = document.getElementById("local_video");
myVideo.muted = true;

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, myVideoStream);
});

///Setting the source of the local video 
const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => 
  {
    video.play();
  });
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/// Main video thing ////////////////////////////////////


let peerConnection;
//const remoteStream;
const config  = 
{
  iceServers:
  [
  {
    urls : "stun:stun.l.google.com:13902"
  }
  ]
}

//Creating WebRTC connection.....///////////////////////////////////////////////////
const createPeerConnection = () => 
{
  // creating a new RTCPeerConnection object, which represents a connection between the local device and a remote peer.
  peerConnection = new RTCPeerConnection(config); 

  /*icecandidate event occurs on an RTCPeerConnection instance:
  local ICE agent needs to deliver a message to the other peer through the signaling server*////////////////
  peerConnection.onicecandidate = (event) =>
  {
    if(event.candidate)
    {
    sendIceCandidate(socketId,event.candidate);
    }
  }

  //Creating a new MediaStream object and initialising it to remote stream 
  const remoteStream = new MediaStream();
  updateRemoteVideo(remoteStream);
  
  /*ontrack is an Event_handlers which specifies a function to be called when the track event occurs, 
  indicating that a track has been added to the peerConnection*/

  peerConnection.ontrack= (event) =>
  {
    remoteStream.addTrack(event.track);
  }

  for(const track of myVideoStream.getTracks())
  {
    ///addTrack() adds a new media track to the set of tracks which will be transmitted to the other peer///////
    peerConnection.addTrack(track,myVideoStream)
  }

};


socket.on("rtcForCaller",(data) =>
{
 socketId= data;
 sendOfferFromCaller();
});

///send SDP offer from first user(caller) to the server
const sendOfferFromCaller = async() =>
{
  /*The createOffer() method of the RTCPeerConnection interface initiates the creation of an SDP offer for the purpose of 
  starting a new WebRTC connection to a remote peer.*////////////////////////////////
  const offer = await peerConnection.createOffer();

  /*setLocalDescription changes the local description associated with the connection
    and specifies the properties of the local end of the connection*///////////////////
  await peerConnection.setLocalDescription(offer);

  let data= {
    peerSocketId: socketId,
    offer: offer
  }

  ///sending offer from caller to the server
  ///"webRTC-offer-to-server" event is emitted that is handled on the server side
  socket.emit("webRTC-offer-to-server", (data));
};



socket.on("webRTC-offer-from-server", async(offer) =>
{
  // handle WebRTC Offer
  await peerConnection.setRemoteDescription(offer);
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  // sending answer...
  let data= {
    peerSocketId: socketId,
    answer: answer
  }
  socket.emit("webRTC-answer-to-server", (data));
});

socket.on("webRTC-answer-from-server",async(answer) =>
{
  await peerConnection.setRemoteDescription(answer);
});


const sendIceCandidate=(socketId, ice) =>
{
  let data= {
    peerSocketId: socketId,
    ice: ice
  }
  socket.emit("webRTC-ice-to-server", (data));
}

socket.on("webRTC-ice-from-server", async(ice) =>
{
  await peerConnection.addIceCandidate(ice);
});

///Setting the source of the remote video 
const updateRemoteVideo= (stream) => 
{
  let vid =document.getElementById("remote_video");
  vid.srcObject= stream;
}


// mute unmute
const mic = document.getElementById("mute_button");
mic.addEventListener("click", () => 
{
  const localStream = myVideoStream;
  const micToggle = localStream.getAudioTracks()[0].enabled;
  localStream.getAudioTracks()[0].enabled = !micToggle;
  
  const unmute = "./utils/images/unmute.png";
  const mute = "./utils/images/mute.png";

  const micImage = document.getElementById("mute_button_image");
  if(micToggle)
  {
    micImage.src = mute;
    mic.style.background ="red";
  }
  else
  {
    micImage.src = unmute;
    mic.style.background ="green";    
  }
});

const camera = document.getElementById("camera_button");

camera.addEventListener("click", () => 
{
  const localStream = myVideoStream;
  const cameraToggle = localStream.getVideoTracks()[0].enabled;
  localStream.getVideoTracks()[0].enabled = !cameraToggle;
  
  const cameraOn = "./utils/images/camera-on.png";
  const cameraOff = "./utils/images/camera-off.png";

  const cameraImage = document.getElementById("camera_button_image");
  if(cameraToggle)
  {
    cameraImage.src = cameraOff;
   camera.style.background ="black";
  }
  else
  {
   cameraImage.src = cameraOn ;
   camera.style.background = "rgba(0, 0, 0, 0.2)";
  }
});

//screen sharing////////////////////////////////////////////////////
let screenSharingState= false;
let screenSharingStream ;

const screenSharingButton = document.getElementById
(
  "screen_sharing_button"
);

screenSharingButton.addEventListener("click", () => 
{
  screenSharingState = !screenSharingState;

  screenSharing(screenSharingState);
});

const screenSharing = async (screenSharingState) =>
{
  if(!screenSharingState)
  {

    const senders = peerConnection.getSenders();
    const sender = senders.find((sender)=>
          sender.track.kind===myVideoStream.getVideoTracks()[0].kind );

   //   console.log(1);
   //   console.log(sender);
      if (sender) 
      {
        sender.replaceTrack(myVideoStream.getVideoTracks()[0]);
      }

      addVideoStream(myVideo, myVideoStream);

       screenSharingStream.getTracks()
      .forEach((element) => element.stop());

      screenSharingButton.innerHTML = "Share Screen";
  }
  else
  {
     screenSharingStream = await navigator.mediaDevices.getDisplayMedia
     ({
        video: true,
      });
           
      const senders = peerConnection.getSenders();
      const sender = senders.find((sender)=>
          sender.track.kind===screenSharingStream.getVideoTracks()[0].kind );

      if (sender) 
      {
        sender.replaceTrack(screenSharingStream.getVideoTracks()[0]);
      }

      addVideoStream(myVideo, screenSharingStream);
      screenSharingButton.innerHTML = "Switch to camera";
  }
}

////leave call

const leaveCall = document.getElementById("leave_call_button");

const leaveCallView=() => 
{
  const placeholder = document.getElementById("video_placeholder");
  display(placeholder);

  const remoteVideo = document.getElementById("remote_video");
  displayNone(remoteVideo);

  const callButtons = document.getElementById("call_buttons");
  displayNone(callButtons);

  const startVideo = document.getElementById("startVideo");
  display(startVideo);

}

leaveCall.addEventListener("click", ()=>
{
  leaveCallView();
  socket.emit("leave", socketId);
})

socket.on("leave",(p) =>
{
  leaveCallView();
});

// chat feature
var message = document.getElementById('message'),
      btn = document.getElementById('send'),
      output = document.getElementById('output');

// Emit events
btn.addEventListener('click', function(){
  output.innerHTML += `<p style="text-align:right"> ` + `<strong style="color: blue">` + "You: " + '</strong>' + message.value + '</p>';
    socket.emit('chat', {
        peerId: socketId, 
        message: message.value
    });
    message.value = "";
});

// Listen for events
socket.on('chat', function(data){
    output.innerHTML += '<p>' + `<strong style="color: red">` + "Guest: " + '</strong>' + data.message + '</p>';
});
