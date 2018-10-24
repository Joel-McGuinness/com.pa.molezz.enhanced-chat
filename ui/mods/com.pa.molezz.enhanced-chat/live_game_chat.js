(function() {
    var team;
    var displayed_players = [];
    var self_user;
    model.state.subscribe(function(){
        // Reseting variables on state update
        displayed_players = [];
        team = model.state().team;
        $("#players").remove();
        players = model.state().players;
        $('.div_chat_log').append('<div style="display: flex; flex-wrap: wrap; background:rgba(255,255,255,0.1); border:1px solid #666; border-top:0;" id="players"></div>');
        // Loop each player and check if they are an ally.
        // If the chat being opened is the 'Team' channel only render allies.
        for (i in players){
            if (players[i].stateToPlayer != "self"){
                if (players[i].stateToPlayer.search("allied") != -1){
                    $('#players').append('<div id="'+players[i].name+'" class="player"><div style="margin-right: 4px; width: 8px; background:'+players[i].color+'"/><div>'+players[i].name+'</div></div>');
                    displayed_players.push(players[i].name.toUpperCase());
                }
                else{
                    if (!team){
                        $('#players').append('<div id="'+players[i].name+'" class="player"><div style="margin-right: 4px; width: 8px; background:'+players[i].color+'"/><div>'+players[i].name+'</div></div>');
                        displayed_players.push(players[i].name.toUpperCase());
                    }
                }
                $(".player").css({
                    "margin": "4px",
                    "padding": "4px",
                    "border": "2px solid transparent",
                    "text-shadow": "none",
                    "transition": "all ease-out 0.1s",
                    "display": "flex",
                })
            }
            // Track our own username
            else{
                self_user = players[i].name;
            }
        }
        // Re-format Chatbox
        $('.chat_input_tag').css({"width": "100%", "padding":"0"});
        $('.input_chat_text').css({"border": "0", "border-left": "1px solid #4D4D4D", "width": "288px"})
        // Loop messages and only show ones relevant to chat selection
        var messages = $(".div_chat_log_feed")[0].children;
        if (messages.length != 0){
            for (i in messages){
                if (messages[i].children != undefined){
                    if (team){
                        if (messages[i].children[0].className.split(' ').indexOf("team_chat_message_player_name") == -1){
                            messages[i].style.display = "none";
                        }
                        else{
                            messages[i].style.display = "";
                        }
                    }
                    else{
                        if (messages[i].children[0].className.split(' ').indexOf("team_chat_message_player_name") != -1){
                            messages[i].style.display = "none";
                        }
                        else{
                            messages[i].style.display = "";
                        }
                    }
                }
            }
        }
    });

    // -- Name Match --
    // param input - Current string in chat input
    // param player_name - Current player name in iteration check
    //
    // return boolean - Whether the input currently matchs up to a player's name
    function nameMatch(input, player_name){
        for (var char = 0; char < input.length; char++){
            if (input[char] == player_name[char]){
                continue;
            }
            else{
                return false;
            }
        }
        return true;
    }

    // Check usernames on each key stroke when input box is selected
    $('.input_chat_text').on('input', function(){
        $('.player').css({
            "background":"",
            "border-color": "transparent",
        });
        if (this.value.indexOf('@') != -1){
            var input = this.value.substring(this.value.indexOf('@')+1).toUpperCase();
            var players = model.state().players;
            if (input.length > 0){
                for (i in players){
                    if (players[i].stateToPlayer != "self"){
                        if (this.value[this.value.length-1] == " "){
                            if(nameMatch(input.substring(0,input.length-1), players[i].name.toUpperCase())){
                                if(displayed_players.indexOf(players[i].name.toUpperCase()) != -1){
                                    var message = this.value.substring(0,this.value.indexOf('@'))+players[i].name+" ";
                                    $('.input_chat_text').val(message);
                                }
                            }
                        }
                        else{
                            if(nameMatch(input, players[i].name.toUpperCase())){
                                $('#'+players[i].name).css({
                                    "background":"rgba(0,0,0,0.4)",
                                    "border-color": "white",
                                    "border-radius":"4px",
                                });
                                break;
                            }
                        }
                    }
                }
            }
        }
    })

    model.chatLog.subscribe(function(){
        if (model.chatLog()[model.chatLog().length-1].message.toUpperCase().indexOf(self_user.toUpperCase()) != -1){
            api.audio.playSound('/SE/UI/UI_camera_anchor_saved');
        }
    });
})();