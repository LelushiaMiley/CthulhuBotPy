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
    var messageContainer = document.getElementById("messageContainer");
    function resize () {
        message_box.style.height = 'auto';
        message_box.style.height = message_box.scrollHeight+'px';
        var unit_test = parseInt(message_box.style.height.replace("px", ""));
        console.log(unit_test);
        if(unit_test <= 300){
            unit = message_box.scrollHeight - 40 + 140;
            messageContainer.style.height = "calc(100% - " + unit +"px)";
            if(messageContainer.scrollTop > messageContainer.scrollHeight-700){
                updateScroll();
            }
        }
        message_box.scrollTop = message_box.scrollHeight;
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
            messageContainer.style.height = "calc(100% - 140px)";
            if(messageContainer.scrollTop > messageContainer.scrollHeight-700){
                updateScroll();
            }
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

// member_data:
// 0 - user id
// 1 - user name
// 2 - display colour
// 3 - online/offline
// 4 - PFP URL
// 5 - role/0

// role_check:
// 0 - no role/not needed
// 1 - has role

// presence:
// 0 - offline
// 1 - online

function handle_member(member_data,role_check,presence){
    var online = document.getElementById("online");
    var offline = document.getElementById("offline");
    var online_no_role = document.getElementById("no_role");
    var offline_role = document.getElementById("offline_user");
    var role_check_div = document.getElementById(member_data[5]);
    var new_member = document.createElement("DIV");
    new_member.setAttribute("class", "member");
    new_member.setAttribute("id", "member-" + member_data[0]);
    member_left = document.createElement("DIV");
    member_right = document.createElement("DIV");
    member_left.setAttribute("class", "member_left");
    member_right.setAttribute("class", "member_right");
    new_member.appendChild(member_left);
    new_member.appendChild(member_right);
    user = document.createElement("DIV");
    if(presence != 0){
        if(member_data[7] != ''){
            user.setAttribute("class", "member_name member_name_with_status");
            if(member_data[7] != undefined){
                var emoji = document.createElement("IMG");
                emoji.setAttribute("class", "status_emoji");
                emoji.setAttribute("src", member_data[7]);
            } else {
                var emoji = document.createElement("IMG");
                emoji.setAttribute("class", "status_emoji hidden_emoji");
            }
            if(member_data[6] != 0 && member_data[6] != "None"){
                user.setAttribute("class", "member_name member_name_with_status");
                var activity = document.createElement("DIV");
                activity.setAttribute("class", "member_status_message emoji_status");
                activity.innerHTML = member_data[6];
            } else {
                user.setAttribute("class", "member_name");
            }
        } else {
            if(member_data[6] != 0 && member_data[6] != "None"){
                user.setAttribute("class", "member_name member_name_with_status");
                var activity = document.createElement("DIV");
                activity.setAttribute("class", "member_status_message");
                activity.innerHTML = member_data[6];
            } else {
                user.setAttribute("class", "member_name");
            }
        }
    } else {
        user.setAttribute("class", "member_name");
    }
    user.setAttribute("style", "color: " + member_data[2]);
    user.innerText = member_data[1];
    member_PFP = document.createElement("IMG");
    member_PFP.setAttribute("class", "member_PFP");
    member_PFP.setAttribute("src", member_data[4]);
    status_ = document.createElement("DIV");
    status_.setAttribute("class", "member_status " + member_data[3]);
    inner_left = document.createElement("DIV");
    inner_left.setAttribute("class", "inner_left");
    member_left.appendChild(inner_left);
    inner_left.appendChild(member_PFP);
    member_right.appendChild(user);
    if(presence != 0){
        if(member_data[7] != ''){
            member_right.appendChild(emoji);
        }
        if(member_data[6] != 0 && member_data[6] != "None"){
            member_right.appendChild(activity);
        }
    }
    inner_left.appendChild(status_);
    if(presence == 0){
        offline_role.appendChild(new_member);
        offline_role.setAttribute("style", "display:block;");
    } else if(role_check_div && role_check != 0) {
        role_check_div.appendChild(new_member);
    } else if(!role_check_div && role_check != 0){
        var role = document.createElement("DIV");
        role.setAttribute("class", "role_list");
        role.setAttribute("id", member_data[5]);
        online.appendChild(role);
        role_name = document.createElement("DIV");
        role_name.setAttribute("class","role_name");
        role_name.innerText = member_data[5];
        role.appendChild(role_name);
        role.appendChild(new_member);
    } else {
        if(!online_no_role){
            role = document.createElement("DIV");
            role.setAttribute("class", "role_list");
            role.setAttribute("id", "no_role");
            online.appendChild(role);
            role_name = document.createElement("DIV");
            role_name.setAttribute("class","role_name");
            role_name.innerText = "Online-";
            role.appendChild(role_name);
            role.appendChild(new_member);
        } else{
            online_no_role.appendChild(new_member);
        }
    }
}

eel.expose(update_member_list_js);
function update_member_list_js(all_member_data){
    var remove_online = document.getElementById("memberArea");
    remove_online.innerHTML = '';
    var memberArea = document.getElementById("memberArea");
    var online = document.createElement("DIV");
    online.setAttribute("id", "online");
    online.setAttribute("style", "color: rgb(46, 51, 56); font-weight: 700px;");
    memberArea.appendChild(online);
    var offline = document.createElement("DIV");
    offline.setAttribute("id", "offline");
    offline.setAttribute("style", "color: rgb(46, 51, 56);");
    memberArea.appendChild(offline);

    role = document.createElement("DIV");
    role.setAttribute("class", "role_list");
    role.setAttribute("id", "offline_user");
    role.setAttribute("style", "display:none;");
    offline.appendChild(role);
    role_name = document.createElement("DIV");
    role_name.setAttribute("class","role_name");
    role_name.innerText = "Offline-";
    role.appendChild(role_name);

    for(i=0;i<all_member_data.length;i++){
        var id_check = document.getElementById("member-" + all_member_data[i][0]);
        if(id_check){
            continue;
        } else{
            var member_data = [];
            var member_data_ = [];
            if(all_member_data[i][3] == "online" || all_member_data[i][3] == "idle" || all_member_data[i][3] == "dnd"){ // 1 refers to online, and 0 refers to offline;
                member_data.push(1);
                if(all_member_data[i][5] == 0){
                    // console.log(all_member_data[i]);
                    member_data_.push(all_member_data[i][0]);
                    member_data_.push(all_member_data[i][1]);
                    member_data_.push(all_member_data[i][2]);
                    member_data_.push(all_member_data[i][3]);
                    member_data_.push(all_member_data[i][4]);
                    member_data_.push(all_member_data[i][5]);
                    member_data_.push(all_member_data[i][6]);
                    member_data_.push(all_member_data[i][7]);
                    // console.log(member_data_);
                    handle_member(member_data_,0,member_data);
                } else {
                    member_data_.push(all_member_data[i][0]);
                    member_data_.push(all_member_data[i][1]);
                    member_data_.push(all_member_data[i][2]);
                    member_data_.push(all_member_data[i][3]);
                    member_data_.push(all_member_data[i][4]);
                    member_data_.push(all_member_data[i][5]);
                    member_data_.push(all_member_data[i][6]);
                    member_data_.push(all_member_data[i][7]);
                    // console.log(member_data_);
                    handle_member(member_data_,1,member_data);
                }
            } else {
                member_data.push(0);
                member_data_.push(all_member_data[i][0]);
                member_data_.push(all_member_data[i][1]);
                member_data_.push(all_member_data[i][2]);
                member_data_.push(all_member_data[i][3]);
                member_data_.push(all_member_data[i][4]);
                handle_member(member_data_,0,member_data);
            }
        }

    }
    var all_roles = document.querySelectorAll(".role_name");
    for(i=0;i<all_roles.length;i++){
        var nodes = all_roles[i].parentNode.childNodes.length - 1;
        all_roles[i].innerText = all_roles[i].innerText + "—" + String(nodes);
    }
}


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
                    eel.update_member_list(all_data[i][z][0]);
                } else{
                    channel.setAttribute("class", "text-channel");
                }
                channel.setAttribute("id", all_data[i][z][0]);
                hashtag = document.createElement("i");
                hashtag.setAttribute("class", "fas fa-hashtag fa-sm channel_hashtag");
                channel_name = document.createElement("span");
                channel_name.setAttribute("class", "channel_name");
                channel_name.innerText= all_data[i][z][1];
                // channel.innerText = "#" + all_data[i][z][1];
                append_to_category.appendChild(channel);
                channel.appendChild(hashtag);
                channel.appendChild(channel_name);
            }
        }
    }



    var text_channels = document.querySelectorAll(".text-channel");
    for(var i=0;i<text_channels.length;i++){
        text_channels[i].addEventListener("click", function(event){
            if(event.target.className == "text-channel" || event.target.className == "channel_name" || event.target.className == "fas fa-hashtag fa-sm channel_hashtag"){
                if(event.target.className == "text-channel"){
                    channel_id = event.target.id;
                    var target_el = event.target;
                } else {
                    channel_id = event.target.parentNode.id;
                    var target_el = event.target.parentNode;
                }
                var remove_focus = document.querySelector(".focused");
                if(target_el != remove_focus){
                    remove_focus.classList.remove("focused");
                    target_el.classList.add("focused");
                    var placeholder = document.getElementById("message_box");
                    var placeholder_string = "Message #" + target_el.innerText;
                    placeholder.setAttribute("placeholder", placeholder_string);
                    var remove_messages = document.getElementsByClassName("messages");
                    while(remove_messages[0]){
                        remove_messages[0].parentNode.removeChild(remove_messages[0])
                    }
                    eel.update_channel_id(channel_id);
                    eel.update_channel(channel_id);
                    eel.update_member_list(channel_id);
                }
            }
        },true);
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
        var messageArea = document.getElementById("messageArea");
        if(messageArea.childNodes.length >= 1){
            var check = 0;
            message_id = messageArea.lastChild.id;
            var last_message = document.getElementById(message_id);
            last_message_id = messageArea.lastChild.lastChild.firstChild.firstChild.id;
            try{
                var last_message_time = messageArea.lastChild.childNodes[1].childNodes[0].childNodes[1].innerText;
            } catch {
                var last_message_time = messageArea.lastChild.childNodes[0].childNodes[0].innerText;
            }
            if(last_message_time == message_data[i][7]){
                var check = 1;
            } else if(last_message_time.startsWith("Y") && message_data[i][7].startsWith("Y")){
                if(last_message_time.substring(13,18) == message_data[i][7].substring(13,18)) {
                    var check = 1;
                }
            } else if(last_message_time.startsWith("T") && message_data[i][7].startsWith("T")){
                if(last_message_time.substring(9,14) == message_data[i][7].substring(9,14)){
                    var check = 1;
                }
            } else {
                var check = 0;
            }
            if(last_message_id == message_data[i][0] && check == 1){
                var message = document.createElement("DIV");
                bot_user = "@" + message_data[i][8];
                if(message_data[i][5].includes(bot_user)){
                    message.setAttribute("class", "messages bot_ping no_username_message " + message_data[i][0]);
                } else{
                    message.setAttribute("class", "messages no_username_message " + message_data[i][0]);
                }
                message.setAttribute("id",message_data[i][1]);
                var messageArea = document.getElementById("messageArea");
                messageArea.appendChild(message);
                var addition_left = document.createElement("DIV");
                addition_left.setAttribute("class", "addition_left");
                var user_right = document.createElement("DIV");
                user_right.setAttribute("class", "user_right");
                message.appendChild(addition_left);
                message.appendChild(user_right);
                time = document.createElement("span");
                time.setAttribute("class", "messageTime additionTime time_hidden");
                time.innerText = message_data[i][7];
                addition_left.appendChild(time);
                var user_content = document.createElement("DIV");
                user_content.setAttribute("class", "user_content");
                user_right.appendChild(user_content);
                content = document.createElement("span");
                content.setAttribute("class","messageContent");
                content.setAttribute("id", message_data[i][1]);
                content.innerHTML = message_data[i][5];
                user_content.appendChild(content);
                var element = document.getElementById("messageContainer");
                if(message_data[8]){
                    updateScroll();
                } else if(element.scrollTop > element.scrollHeight-700){
                    updateScroll();
                }
            } else {
                var message = document.createElement("DIV");
                bot_user = "@" + message_data[i][8];
                if(message_data[i][5].includes(bot_user)){
                    message.setAttribute("class", "messages bot_ping " + message_data[i][0]);
                } else{
                    message.setAttribute("class", "messages " + message_data[i][0]);
                }
                // message.setAttribute("class", "messages " + message_data[i][0]);
                message.setAttribute("id",message_data[i][1]);
                var messageArea = document.getElementById("messageArea");
                messageArea.appendChild(message);
                var message = document.getElementById(message_data[i][1]);
                var pfp = document.createElement("IMG");
                pfp.setAttribute("src", message_data[i][4]);
                pfp.setAttribute("class","userPFP");
                var author = document.createElement("span");
                author.setAttribute("class","messageUser");
                color = message_data[i][3];
                author.setAttribute("style", "color: " + color);
                author.setAttribute("id", message_data[i][0]);
                author.innerText = message_data[i][2];
                content = document.createElement("span");
                content.setAttribute("class","messageContent");
                content.setAttribute("id", message_data[i][1]);
                content.innerHTML = message_data[i][5];
                time = document.createElement("span");
                time.setAttribute("class", "messageTime");
                time.innerText = message_data[i][7];
                var user_left = document.createElement("DIV");
                user_left.setAttribute("class", "user_left");
                message.appendChild(user_left);
                var user_right = document.createElement("DIV");
                user_right.setAttribute("class", "user_right");
                message.appendChild(user_right);
    
                var user_icon = document.createElement("DIV");
                user_icon.setAttribute("class", "user_icon");
                user_left.appendChild(user_icon);
                var user_and_time = document.createElement("DIV");
                user_and_time.setAttribute("class", "user_and_time");
                user_right.appendChild(user_and_time);
                var user_content = document.createElement("DIV");
                user_content.setAttribute("class", "user_content");
                user_right.appendChild(user_content);
    
                user_icon.appendChild(pfp);
                user_and_time.appendChild(author);
                user_and_time.appendChild(time);
                user_content.appendChild(content);
            }
        } else {
            var message = document.createElement("DIV");
            bot_user = "@" + message_data[i][8];
            if(message_data[i][5].includes(bot_user)){
                message.setAttribute("class", "messages bot_ping " + message_data[i][0]);
            } else{
                message.setAttribute("class", "messages " + message_data[i][0]);
            }
            // message.setAttribute("class", "messages " + message_data[i][0]);
            message.setAttribute("id",message_data[i][1]);
            var messageArea = document.getElementById("messageArea");
            messageArea.appendChild(message);
            var message = document.getElementById(message_data[i][1]);
            var pfp = document.createElement("IMG");
            pfp.setAttribute("src", message_data[i][4]);
            pfp.setAttribute("class","userPFP");
            var author = document.createElement("span");
            author.setAttribute("class","messageUser");
            color = message_data[i][3];
            author.setAttribute("style", "color: " + color);
            author.setAttribute("id", message_data[i][0]);
            author.innerText = message_data[i][2];
            content = document.createElement("span");
            content.setAttribute("class","messageContent");
            content.setAttribute("id", message_data[i][1]);
            content.innerHTML = message_data[i][5];
            time = document.createElement("span");
            time.setAttribute("class", "messageTime");
            time.innerText = message_data[i][7];
            var user_left = document.createElement("DIV");
            user_left.setAttribute("class", "user_left");
            message.appendChild(user_left);
            var user_right = document.createElement("DIV");
            user_right.setAttribute("class", "user_right");
            message.appendChild(user_right);

            var user_icon = document.createElement("DIV");
            user_icon.setAttribute("class", "user_icon");
            user_left.appendChild(user_icon);
            var user_and_time = document.createElement("DIV");
            user_and_time.setAttribute("class", "user_and_time");
            user_right.appendChild(user_and_time);
            var user_content = document.createElement("DIV");
            user_content.setAttribute("class", "user_content");
            user_right.appendChild(user_content);

            user_icon.appendChild(pfp);
            user_and_time.appendChild(author);
            user_and_time.appendChild(time);
            user_content.appendChild(content);
        }
    }

    var allAuthors = document.getElementsByClassName("messageUser");
    for(i=0;i<allAuthors.length;i++){
        allAuthors[i].addEventListener("mouseover", event => {
            color = event.target.style.color;
            event.target.setAttribute("style", "color: " + color + "; " + "border-bottom: 1px solid " + color + ";");
        });
        allAuthors[i].addEventListener("mouseout", event => {
            color = event.target.style.color;
            event.target.setAttribute("style", "color: " + color + ";");
        });
    }
    var messageArea = document.getElementById("messageArea");
    var first_child = messageArea.firstChild;
    first_child.setAttribute("style", "margin-top: 0px!important;");
    var last_child = messageArea.lastChild;
    last_child.setAttribute("style", "margin-bottom: 15px!important;");
    updateScroll();
}

eel.expose(new_message);
function new_message(message_data){
    var focused_channel = document.querySelector(".focused");
    console.log("It starts");
    if(focused_channel != null){
        if(focused_channel.id == message_data[6]){
            var messageArea = document.getElementById("messageArea");
            var last_child = messageArea.lastChild;
            last_child.setAttribute("style", "");
            message_id = messageArea.lastChild.id;
            var last_message = document.getElementById(message_id);
            last_message_id = messageArea.lastChild.lastChild.firstChild.firstChild.id;
            if(last_message_id == message_data[0]){
                // last_message.setAttribute("style", "margin-bottom: 0px!important");
                var message = document.createElement("DIV");
                bot_user = "@" + message_data[10];
                if(message_data[5].includes(bot_user)){
                    message.setAttribute("class", "messages no_username_message bot_ping " + message_data[0]);
                } else {
                    message.setAttribute("class", "messages no_username_message " + message_data[0]);
                }
                message.setAttribute("style", "margin-bottom: 15px!important;");
                message.setAttribute("id",message_data[1]);
                var messageArea = document.getElementById("messageArea");
                messageArea.appendChild(message);
                var addition_left = document.createElement("DIV");
                addition_left.setAttribute("class", "addition_left");
                var user_right = document.createElement("DIV");
                user_right.setAttribute("class", "user_right");
                message.appendChild(addition_left);
                message.appendChild(user_right);
                time = document.createElement("span");
                time.setAttribute("class", "messageTime additionTime time_hidden");
                time.innerText = message_data[9];
                addition_left.appendChild(time);
                var user_content = document.createElement("DIV");
                user_content.setAttribute("class", "user_content");
                user_right.appendChild(user_content);
                content = document.createElement("span");
                content.setAttribute("class","messageContent");
                content.setAttribute("id", message_data[1]);
                content.innerHTML = message_data[5];
                user_content.appendChild(content);
                var element = document.getElementById("messageContainer");
                if(message_data[8]){
                    updateScroll();
                } else if(element.scrollTop > element.scrollHeight-700){
                    updateScroll();
                }
            } else {
                console.log("Down here!");
                var message = document.createElement("DIV");
                bot_user = "@" + message_data[10];
                if(message_data[5].includes(bot_user)){
                    message.setAttribute("class", "messages bot_ping " + message_data[0]);
                } else{
                    message.setAttribute("class", "messages " + message_data[0]);
                }
                message.setAttribute("style", "margin-bottom: 15px!important;");
                message.setAttribute("id",message_data[1]);
                var messageArea = document.getElementById("messageArea");
                messageArea.appendChild(message);
                var message = document.getElementById(message_data[1]);
                var pfp = document.createElement("IMG");
                pfp.setAttribute("src", message_data[4]);
                pfp.setAttribute("class","userPFP");
                var author = document.createElement("span");
                author.setAttribute("class","messageUser");
                color = message_data[3];
                console.log(color);
                author.setAttribute("style", "color: " + color);
                author.setAttribute("id", message_data[0]);
                author.innerText = message_data[2];
                content = document.createElement("span");
                content.setAttribute("class","messageContent");
                content.setAttribute("id", message_data[1]);
                content.innerHTML = message_data[5];
                time = document.createElement("span");
                time.setAttribute("class", "messageTime");
                time.innerText = message_data[9];

                var user_left = document.createElement("DIV");
                user_left.setAttribute("class", "user_left");
                message.appendChild(user_left);
                var user_right = document.createElement("DIV");
                user_right.setAttribute("class", "user_right");
                message.appendChild(user_right);

                var user_icon = document.createElement("DIV");
                user_icon.setAttribute("class", "user_icon");
                user_left.appendChild(user_icon);
                var user_and_time = document.createElement("DIV");
                user_and_time.setAttribute("class", "user_and_time");
                user_right.appendChild(user_and_time);
                var user_content = document.createElement("DIV");
                user_content.setAttribute("class", "user_content");
                user_right.appendChild(user_content);

                user_icon.appendChild(pfp);
                user_and_time.appendChild(author);
                user_and_time.appendChild(time);
                user_content.appendChild(content);
                var element = document.getElementById("messageContainer");
                if(message_data[8]){
                    updateScroll();
                } else if(element.scrollTop > element.scrollHeight-700){
                    updateScroll();
                }
            }
        }
    }
}
