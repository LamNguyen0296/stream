const socket = io('https://lamnn.herokuapp.com', {transports: ['websocket', 'polling', 'flashsocket']})

$('#div-chat').hide();

socket.on('DANH_SACH_ONLINE', arrUserInfo => {
    $('#div-chat').show();
    $('#div-dangky').hide();
    arrUserInfo.forEach(user => {
        const { ten, peerId } = user;
        $('#ulUsers').append(`<li id="${peerId}">${ten}</li>`);
    })

    socket.on('CO_NGUOI_DUNG_MOI', user => {
        const { ten, peerId } = user;
        $('#ulUsers').append(`<li id="${peerId}">${ten}</li>`);
    })

    socket.on('AI_DO_NGAT_KET_NOI', peerId => {
        $(`#${peerId}`).remove();
    })
})

socket.on('DANG_KY_THAT_BAI', () => alert('Vui lòng nhập username khac'))


//************************************** */
function openStream() {
    const config = { audio: true, video: true};
    return navigator.mediaDevices.getUserMedia(config)
}

function playStream( idVideoTag, stream ) {
    const video = document.getElementById( idVideoTag );
    video.srcObject = stream;
    video.play();
}

var peer = new Peer(); 

peer.on('open', id => {
    $('#myPeer').append(id);
    $('#btnSignUp').click(() => {
        const username = $('#txtUsername').val();
        socket.emit('NGUOI_DUNG_DANG_KY', { ten: username, peerId: id } );
    });
}); 

// Caller
$('#btnCall').click(() => {
    const id = $('#remoteId').val();
    openStream().then( stream => {
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    }) 
})

// Listener
peer.on('call', call => {
    openStream().then(stream => {
        call.answer(stream);
        playStream('localStream', stream);
    })
    call.on('stream', remoteStream => playStream('remoteStream', remoteStream))
});

$('#ulUsers').on('click','li', function() {
    const id = $(this).attr('id');
    openStream().then( stream => {
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    })
});

