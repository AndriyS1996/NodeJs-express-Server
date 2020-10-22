
let chat = document.getElementById('messages');
let chat_list = document.getElementById('chat_list');
let chat_text_history = document.getElementById('chat_text_history');
let activeChat;
let myName;
let chat_write_msg = document.getElementById('chat_write_msg');

let socket = io('/');





//modal window create chat

let close_btn = document.getElementsByClassName('close')[0];

let btn_open_modal_window = document.getElementById('create_private_chat');
let modal = document.getElementsByClassName('create-private-chat-wrap')[0];
let submit_create_chat = document.getElementById('submit_create_chat');

window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

close_btn.onclick = function() {
    modal.style.display = "none";
};

btn_open_modal_window.onclick = function() {
    modal.style.display = "block";
}



submit_create_chat.onclick = function(e){
    e.preventDefault();
    fetch('/profile/createPrivateChat', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: document.forms.createPrivatChat.elements.addPerson.value,
            })
        })
        .then((response) => {
            if (response.status === 201){
                return response.json()
            }
        })
        .then((result) => {
            socket.emit('create chat', result.name);
            createChat(result.name, result.chatHistory);
        })
        .catch((err) => {
            console.log(err);
        });
        modal.style.display = "none";
        return false
};

function createChat(name, chatHistory){
    let li = document.createElement('li');
    li.hash = name;
    li.chatHistory = chatHistory;
    let strong = document.createElement('strong');
    strong.textContent = name;
    li.appendChild(strong);
    chat_list.insertBefore(li, chat_list.firstChild);
};

let privateChats = [];
fetch('/profile/getPrivateChats')
    .then((response) => {
        return response.json()
    })
    .then((result) => {
        privateChats = result.privateChats;
        myName = result.myName;
        privateChats.forEach((chat) => {
            createChat(chat.name, chat.history);
        })
    })
    .catch((err) => {
        console.log(err)
    });


// chat_list click handler

function highlightChat(li){
    if (activeChat) {
        activeChat.classList.remove('active');
    };
    activeChat = li;
    activeChat.classList.add('active');
};



function createChatHistory(history, myName){
    while (chat_text_history.firstChild) {
        chat_text_history.removeChild(chat_text_history.firstChild);
    };
    history.forEach((post) => {
        createLastPost(post, myName);
    })
};

function createLastPost(post, myName){
    let div1 = document.createElement('div');
    let div = document.createElement('div');
    post.creator === myName ? div1.classList.add('creator-post') : div1.classList.add('no-creator-post');
    post.creator === myName ? div.classList.add('creator-msg') : div.classList.add('no-creator-msg');
    div.textContent = post.msg;
    div1.append(div);
    chat_text_history.append(div1);
    chat_text_history.scrollTop = chat_text_history.scrollHeight;
};
 
if (!(activeChat)) {
    window.location.hash = '';
}

chat_list.onclick = (event) => {
    let li = event.target.closest('li');
    if (!li){ return; }
    highlightChat(li);
    window.location.hash = li.hash;
    createChatHistory(li.chatHistory, myName);
    chat_text_history.scrollTop = chat_text_history.scrollHeight; 
}

socket.on('chat message', (data) => {
    let result = JSON.parse(data);

    if ((activeChat) && ((activeChat.hash === result.post.creator) || (myName === result.post.creator))){
        createLastPost(result.post, myName);
        activeChat.chatHistory.push(result.post);
    } else {
        let li;
        for (let i = 0; i < chat_list.children.length; i++) {
            if (chat_list.children[i].hash === result.post.creator){
                li = chat_list.children[i];
                break;
            }
        };
        if (li) {
            li.chatHistory.push(result.post);
        } else {
            createChat(result.post.creator, [result.post]);
        }
    }
});



document.getElementById('chat_send_msg_button').onclick = () => {

    socket.emit('chat message', {msg: chat_write_msg.value, receiver: window.location.hash.slice(1)});
    chat_write_msg.value = '';
}


