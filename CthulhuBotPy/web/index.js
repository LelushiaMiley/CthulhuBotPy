document.getElementById('close-button').addEventListener("click", event => { // the triggerer for the broken Python function, will look into
    eel.sys_exit();
});
eel.expose(updateScroll);
function updateScroll(){
    var element = document.getElementById("messageContainer");
    element.scrollTop = element.scrollHeight;
}

message = document.getElementById('message_box'); // declares a variable for the element to make it more accessible; avoids redundant code

message.addEventListener("keyup", function(event){  // listens for when keypresses finish; won't fire off constantly if held down due to this
    if(event.keyCode === 13) { // triggers from the key "Enter"
        message_to_send = message.value; // asigns the element's value to a variable
        event.preventDefault(); // does not work; meant to prevent "Enter" from doing anything but what it's told to here
        var message_box = document.getElementById('message_box');
        message_box.style.height = "40px";
        message_box.setAttribute("style", "height: 40px;");
        eel.update_message(message_to_send); // triggers a function on the Python end; sends the variable, too
        message.value = ""; // resets the text in the element
    }
});
var observe;
if (window.attachEvent) {
    observe = function (element, event, handler) {
        element.attachEvent('on'+event, handler);
    };
}
else {
    observe = function (element, event, handler) {
        element.addEventListener(event, handler, false);
    };
}
function init () {
    var message_box = document.getElementById('message_box');
    var messageBox = document.getElementById('messageBox');
    function resize () {
        message_box.style.height = 'auto';
        message_box.style.height = message_box.scrollHeight+'px';
    }
    /* 0-timeout to get the already changed message_box */
    function delayedResize () {
        window.setTimeout(resize, 0);
    }
    message_box.addEventListener('keydown', function (event){
        if(event.code == "Enter"){
            event.preventDefault();
            message_box.style.height = "40px";
            message_box.setAttribute("style", "height: 40px;");
        }
    })
    message_box.addEventListener('change', resize);
    message_box.addEventListener('cut', delayedResize);
    message_box.addEventListener('paste', delayedResize);
    message_box.addEventListener('drop', delayedResize);
    message_box.addEventListener('keydown', delayedResize);
    // observe(message_box, 'change',  resize);
    // observe(message_box, 'cut',     delayedResize);
    // observe(message_box, 'paste',   delayedResize);
    // observe(message_box, 'drop',    delayedResize);
    // observe(message_box, 'keydown', delayedResize);

    message_box.focus();
    message_box.select();
    resize();
}

init();

var emoji = document.getElementById("emoji");
function emojiManipulation(){
    randNumHor = Math.floor(Math.random()*11);
    var fromLeft = -22*randNumHor;
    // -132
    if(fromLeft >= -110){
        randNumVer = Math.floor(Math.random()*5);
    } else {
        randNumVer = Math.floor(Math.random()*4);
    }
    var fromTop = -22*randNumVer;
    emoji.style.backgroundPosition = fromLeft + "px " + fromTop + "px";
}
emoji.addEventListener("mouseover", emojiManipulation)

function processChannel(all_data){
    console.log(all_data);
    console.log(all_data[0]);
    console.log(all_data[0].length);
    var channelArea = document.getElementById("channelArea");
    var categories = document.getElementsByClassName("category");
    var textChannel = document.getElementsByClassName("text-channel");
    while(categories[0]){
        categories[0].parentNode.removeChild(categories[0])
    }
    while(textChannel[0]){
        textChannel[0].parentNode.removeChild(textChannel[0])
    }
    var remove_messages = document.getElementsByClassName("messages");
    while(remove_messages[0]){
        remove_messages[0].parentNode.removeChild(remove_messages[0])
    }
    for(var i=0;i<all_data.length;i++){
        for(var z=0;z<all_data[i].length;z++){
            var id = all_data[i][0][0];
            var category_id = all_data[i][0][0] + "Category";
            if(z==0){
                var category = document.createElement("DIV");
                category.setAttribute("class", "category");
                category.setAttribute("id", all_data[i][z][0]);
                // category.innerText = all_data[i][z][1];
                channelArea.appendChild(category);
                var append_to_category = document.getElementById(id);
                var categoryH1 = document.createElement("H1");
                categoryH1.setAttribute("class", "categoryH1")
                categoryH1.setAttribute("id", category_id);
                categoryH1.innerText = all_data[i][z][1].toUpperCase();
                append_to_category.appendChild(categoryH1);
                var append_to_categoryH1 = document.getElementById(category_id);
                var arrow = document.createElement("i");
                arrow.setAttribute("class", "fas fa-angle-down categoryArrow");
                var arrowId = all_data[i][z][0] + "Arrow";
                arrow.setAttribute("id", arrowId);
                append_to_categoryH1.appendChild(arrow);
            } else {
                var append_to_category = document.getElementById(id);
                var channel = document.createElement("DIV");
                if(z==1 && i==0){
                    channel.setAttribute("class", "text-channel focused");
                    var placeholder = document.getElementById("message_box");
                    var placeholder_string = "Message #" + all_data[i][z][1];
                    placeholder.setAttribute("placeholder", placeholder_string);
                    eel.update_channel_id(String(all_data[i][z][0]));
                    eel.update_channel(String(all_data[i][z][0]));
                } else{
                    channel.setAttribute("class", "text-channel");
                }
                channel.setAttribute("id", all_data[i][z][0]);
                channel.innerText = "#" + all_data[i][z][1];
                append_to_category.appendChild(channel);
            }
        }
    }
    var text_channels = document.querySelectorAll(".text-channel");
    for(var i=0;i<text_channels.length;i++){
        text_channels[i].addEventListener("click", function(event){
            channel_id = event.target.id;
            var remove_focus = document.querySelector(".focused");
            remove_focus.classList.remove("focused");
            event.target.classList.add("focused");
            var placeholder = document.getElementById("message_box");
            var placeholder_string = "Message " + event.target.innerText;
            placeholder.setAttribute("placeholder", placeholder_string);
            var remove_messages = document.getElementsByClassName("messages");
            while(remove_messages[0]){
                remove_messages[0].parentNode.removeChild(remove_messages[0])
            }
            eel.update_channel_id(channel_id);
            eel.update_channel(channel_id);
        });
    }
}

eel.expose(send_js_servers);
function send_js_servers(names,icons,ids){
    var serverArea = document.getElementById("serverArea");
    for(i=0;i<names.length;i++){
        if(icons[i] != null){
            var serverIcon = document.createElement("IMG");
            serverIcon.setAttribute("class", "serverIcon");
            serverIcon.setAttribute("src", icons[i]);
            serverIcon.setAttribute("id", ids[i]);
            serverArea.appendChild(serverIcon);
        } else {
            var serverIcon = document.createElement("DIV");
            serverIcon.setAttribute("class", "no-server-icon serverIcon");
            serverIcon.setAttribute("id", ids[i]);
            serverIcon.innerText = names[i].split(/\s/).reduce((response,word)=> response+=word.slice(0,1),'');
            serverArea.appendChild(serverIcon);
        }
        
    }
    var icons = document.querySelectorAll(".serverIcon");
    for(var i=0;i<icons.length;i++){
        icons[i].addEventListener("click", function(event){
            var serverId = event.target.id;
            var remove_focus = document.querySelector(".serverFocused");
            remove_focus.classList.remove("serverFocused");
            event.target.classList.add("serverFocused");
            // console.log(serverId)
            eel.processServerClick(serverId)(processChannel);
            // (processChannel)
        });
    }
    var server = document.querySelector(".serverIcon")
    server.setAttribute("class", "serverFocused");
    eel.processServerClick(server.id)(processChannel);
    // console.log(document.querySelector(".serverIcon").id);
}

eel.expose(send_message_data);
function send_message_data(message_data){
    var remove_messages = document.getElementsByClassName("messages");
    while(remove_messages[0]){
        remove_messages[0].parentNode.removeChild(remove_messages[0])
    }
    for(var i=message_data.length-1;i>-1;i--){
        var message = document.createElement("DIV");
        message.setAttribute("class", "messages");
        message.setAttribute("id",message_data[i][1]);
        var messageArea = document.getElementById("messageArea");
        messageArea.appendChild(message);
        var message = document.getElementById(message_data[i][1]);
        var pfp = document.createElement("IMG");
        pfp.setAttribute("src", message_data[i][4]);
        pfp.setAttribute("class","userPFP");
        var author = document.createElement("span");
        author.setAttribute("class","messages messageUser");
        color = message_data[i][3];
        console.log(color);
        author.setAttribute("style", "color: " + color);
        author.innerText = message_data[i][2];
        content = document.createElement("span");
        content.setAttribute("class","messages messageContent");
        content.innerText = message_data[i][5];
        time = document.createElement("span");
        time.setAttribute("class", "messages messageTime");
        time.innerText = message_data[i][7];
        message.appendChild(pfp);
        message.appendChild(author);
        message.appendChild(content);
        message.appendChild(time);
    }
    updateScroll();
}

eel.expose(new_message);
function new_message(message_data){
    var focused_channel = document.querySelector(".focused");
    if(focused_channel.id == message_data[6]){
        var message = document.createElement("DIV");
        message.setAttribute("class", "messages");
        message.setAttribute("id",message_data[1]);
        var messageArea = document.getElementById("messageArea");
        messageArea.appendChild(message);
        var message = document.getElementById(message_data[1]);
        var pfp = document.createElement("IMG");
        pfp.setAttribute("src", message_data[4]);
        pfp.setAttribute("class","userPFP");
        var author = document.createElement("span");
        author.setAttribute("class","messages messageUser");
        color = message_data[3];
        console.log(color);
        author.setAttribute("style", "color: " + color);
        author.innerText = message_data[2];
        content = document.createElement("span");
        content.setAttribute("class","messages messageContent");
        content.innerText = message_data[5];
        time = document.createElement("span");
        time.setAttribute("class", "messages messageTime");
        time.innerText = message_data[7];
        message.appendChild(pfp);
        message.appendChild(author);
        message.appendChild(content);
        message.appendChild(time);
        var element = document.getElementById("messageContainer");
        console.log(element.scrollTop);
        console.log(element.scrollHeight);
        if(message_data[8]){
            updateScroll();
        } else if(element.scrollTop > element.scrollHeight-600){
            updateScroll();
        }
        // updateScroll();
    }
}
