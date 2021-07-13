This repository contains my project for Microsoft Engage 2021 Mentorship Program.

This project involves a video calling and chatting website for 2 users.
The website is hosted here:- https://engage-teams-clone-e.herokuapp.com/

**Technologies Used:** <br />
The frontend is developed using HTML, CSS and Vanilla Javascript.  <br />
Node.js is used for writing the server side code.  <br />
For developing the main part of the project WebRTC is used.  <br />
Socket.io is used to transport signaling data and connect two users by their socket ids.  <br />

**Working:**  <br />
To use this application, a user is given a unique personal code on visiting the website. He can share this code with another user, who can enter it in the “Enter code” text box to connect with the first user. <br />
In case the entered code is wrong or the associated user is already in another meet, the call fails and a corresponding message comes up. <br />

After a successful connection, two users can chat with each other and a “Start Video Call” Button appears on their side bar. If either of the two users click on the button, the video call will start. <br />

The video call comes with the following settings (buttons): <br />
Mute/Unmute&nbsp&nbsp, Camera On/Off, Leave Call, Screen Share/Switch to camera.<br />
The names of the buttons indicate their respective functions. <br />

If any one of the users leave the call, the video call will end on both sides. The chatting can still be continued. The two users stay connected until one of them leaves the site. <br />

Note: Once a user successfully connects with another, his personal code cannot be used again to make another connection. In order to start a new meet, he can refresh the page and get a new code.<br />

**Applying Agile Methodology:**  <br />
Agile scrum methodology is a project management system that relies on incremental development and involves working in sprints.<br />
The project work was divided into 4 sprints: <br />
**Phase 1**:
* Did Research on various technologies.
* Learnt Node.js
* Decided to use WebRTC and socket.io.
* Finalised the Tech Stack
* Planned on making a two-user application.

**Phase 2:**
* Worked on the UI.
* Wrote code for the side bar
* Connected two users by their socket ids.

**Phase 3:**
* Studied more about how WebRTC works.
* Worked on the main video calling part.
* Added features to mute/unmute ,  camera on/off and share screen.
* Fixed few bugs.

**Phase 4:**
* Added the leave call button.
* Dealt with features mentioned in Adopt Phase.
* Added chat feature during the video meet.
* Added the “Start Video Call” button to allow chatting before and after a video meet.
* Fixed few Bugs.
* Learnt to deploy on Heroku.

**Reference:**
* https://socket.io/
* https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Connectivity
* https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection
