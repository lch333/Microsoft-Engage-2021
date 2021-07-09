let state = {
	socketId : null,
	localStream: null,
	remoteStream: null,
}

export const setSocketId = (socketId)=> {
 
   	state =   
    {
  	  ...state,
	  socketId,
        
	};
};

export const setLocalStream = (stream) =>
{
	state =   
    {
  	  ...state,
	  localStream: stream,
        
	};
};

export const setRemoteStream = (stream) =>
{
	state =   
    {
  	  ...state,
	  remoteStream: stream,
        
	};
};

export const getState= ()=>
{
	return state;
}
