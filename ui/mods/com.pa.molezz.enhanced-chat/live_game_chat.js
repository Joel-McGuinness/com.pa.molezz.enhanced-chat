ko.components.register('chat_player_list',{
    viewModel: function(params){
        this.displayed_players = [];
        this.self_user;
        var players = params.state.players;
        // Loop through the players and if the team chat is selected only add allies to the array.
        for (i in players){
            if (players[i].stateToPlayer != "self"){
                if (players[i].stateToPlayer.search("allied") != -1){
                    this.displayed_players.push(players[i]);
                }
                else{
                    if (!params.state.team){
                        this.displayed_players.push(players[i]);
                    }
                }
            }
            // Track our own username
            else{
                self_user = players[i].name;
            }
        }
    },
    template: loadHtml('coui://ui/mods/com.pa.molezz.enhanced-chat/chat_player_list.html')
})

ko.components.register('chat_log',{
    viewModel: function(params){
        this.logs = params.logs
    },
    template: loadHtml('coui://ui/mods/com.pa.molezz.enhanced-chat/chat_log.html')
})

// Removes the old div_chat_log_feed html and replaces it with our new object
$('.div_chat_log_feed').remove();
$('.div_chat_log').prepend('<div data-bind="component:{name:\'chat_log\', params:{logs:model.chatLog()}}"></div>')
$('.div_chat_log').append('<div data-bind="component:{name:\'chat_player_list\', params:{state:model.state()}}"></div>');

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

var displayed_players = [];
$('.input_chat_text').on('input', function(){
    $('.player').css({
        "background":"",
        "border-color": "transparent",
    });
    if (this.value.indexOf('@') != -1){
        // Once an '@' is found we use everything after it as our input
        var input = this.value.substring(this.value.indexOf('@')+1).toUpperCase();
        var players = model.state().players;
        if (input.length > 0){
            for (i in players){
                // Make sure we can't @ tag ourselves
                if (players[i].stateToPlayer != "self"){
                    // Checking for space at the end of input as indication to attempt username resolution
                    if (this.value[this.value.length-1] == " "){
                        if(nameMatch(input.substring(0,input.length-1), players[i].name.toUpperCase())){
                            if(displayed_players.indexOf(players[i].name.toUpperCase()) != -1){
                                // Attach message back onto the front of the resolved username
                                var message = this.value.substring(0,this.value.indexOf('@'))+players[i].name+" ";
                                $('.input_chat_text').val(message);
                            }
                        }
                    }
                    else{
                        // Check if the input matches the current username, if so highlight it.
                        if(nameMatch(input, players[i].name.toUpperCase())){
                            $('[id="'+players[i].name+'"]').css({
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
        // Retreive our username when the user types '@'
        // Stops us from tagging ourselves
        else{
            displayed_players = ko.contextFor(document.getElementById("players")).$component.displayed_players.map(function(player){
                return player.name.toUpperCase();
            })
        }
    }
})

// Checks if out username has been mentioed in a message, if so a chime is played.
model.chatLog.subscribe(function(){
    if (model.chatLog()[model.chatLog().length-1].message.toUpperCase().indexOf(self_user.toUpperCase()) != -1){
        api.audio.playSound('/SE/UI/UI_camera_anchor_saved');
    }
});