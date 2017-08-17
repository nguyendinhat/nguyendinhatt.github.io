const socket =io('https://stream-ryanstudio.herokuapp.com');
$("#signup").show();
$("#chat").hide();
socket.on("ds-online",arrUserInfo =>{
	$("#chat").show();
	$("#signup").hide();
	arrUserInfo.forEach((username) => {
		const {ten,peerID}=username;
		$("#list").append(`<li id="${peerID}">${ten}</li>`);
	});
	socket.on("new-connect",username =>{
		const {ten,peerID}=username;
		$("#list").append(`<li id="${peerID}">${ten}</li>`);
	});
	socket.on("user-disconnect",peerID =>{
		$(`#${peerID}`).remove();
	});
});
socket.on("sigup-fail",function(){
	alert("User đã tồn tại");
});
function openStream() {
    const config = { audio: true, video: true };
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}
// openStream().then(stream => playStream('localStream',stream))
// alert("active");
const peer = new Peer({ 
    key: 'peerjs', 
    host: 'peer-ryanstudio.herokuapp.com', 
    secure: true, 
    port: 443, 
    config: customConfig 
});
peer.on('open',id =>{
	$("#my-peer").append(id);
		$("#btnSignUp").click(()=>{
		const username = $("#txtUsername").val();
		socket.emit("user-sigup",{ten:username,peerID:id});
	});
}); 
// caller
$("#btnCall").click(() =>{
	const id = $("#remoteID").val();
	openStream().then(stream =>{
		playStream('localStream', stream);
		const call = peer.call(id, stream);
		call.on('stream',remoteStream => playStream('remoteStream',remoteStream));
	});
});
peer.on('call', call =>{
	openStream().then(stream =>{
		call.answer(stream);
		playStream('localStream',stream);
		call.on('stream',remoteStream => playStream('remoteStream',remoteStream));
	});
});
$('#list').on('click', 'li', function() {
    const id = $(this).attr('id');
    console.log(id);
    openStream().then(stream =>{
		playStream('localStream', stream);
		const call = peer.call(id, stream);
		call.on('stream',remoteStream => playStream('remoteStream',remoteStream));
	});

});

// $("#btnSignUp").click(()=>{
// 	const username = $("#txtUsername").val();
// 	socket.emit("user-sigup",username);
// });