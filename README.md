This repository contains my project for Microsoft Engage 2021 Mentorship Program.

This project involves a video calling and chatting website for 2 users.
The website is hosted here:- 

Technologies Used:
The frontend is developed using HTML, CSS and Vanilla Javascript.
Node.js is used for writing the server side code.
For developing the main part of the project WebRTC is used. 
Socket.io is used to transport signaling data and connect two users by their socket ids .

Working:
To use this application, a user is given a unique personal code on visiting the website. He can share this code with another user, who can enter it in the “Enter code” text box to connect with the first user. 
In case the entered code is wrong or the associated user is already in another meet, the call fails and a corresponding message comes up.

After a successful connection, two users can chat with each other and a “Start Video Call” Button appears on their side bar. If either users clicks on this, video call will start between them.

The video call comes with following buttons:
1. Mute/Unmute   2. Camera On/Off    3. Leave Call    4. Screen Share/Switch to camera.
The functions of these buttons are as suggested by their names.
If any one of the users leave the call, the video call will end on both sides. The chatting can still be continued. The two users stay connected until one of them leaves the site.

Note: Once a user successfully connects with another, his personal code cannot be used to again to make another connection. In order to start a new meet, he can refresh the page and get a new code.

Applying Agile Methodology:
Agile scrum methodology is a project management system that relies on incremental development and involves working in sprints.

The project work was divided into 4 sprints:
Phase 1:
* Did Research on various technologies.
* Learnt Node.js
* Decided to use WebRTC and socket.io.
* Finalised the Tech Stack
* Planned on making a two-user application.

Phase 2:
* Worked on the UI.
* Wrote code for the side bar
* Connected two users by their socket ids.

Phase 3:
* Studied more about how WebRTC works.
* Worked on the main video calling part.
* Added features to mute/unmute ,  camera on/off and screen share.
*Fixed few bugs.

Phase 4:
* Added the leave call button.
* Dealt with features mentioned in Adopt Phase.
* Added chat feature during the video meet.
* Added the “Start Video Call” button to allow chatting before and after a video meet.
* Fixed few Bugs.
* Learnt to deploy on Heroku.

Reference:
