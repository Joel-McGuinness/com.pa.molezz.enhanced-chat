(function() {
    function getPlayers(){
        var players = []
        // Looping players and removing the allies object.
        // This lead to a cicular-json error as each object kept referencing each other forever.
        for(var i = 0; i < model.players().length; i++){
            players[i] = model.players()[i];
            delete players[i].allies;
        }
        return players
    }
    // Adding players to the chatState so we can access player usernames in live_game_chat.js
    model.chatSelected.subscribe(function(){
        if (model.chatSelected()){
            model.chatState = ko.computed(function() {                
                return {
                    selected: model.chatSelected(),
                    spectator: model.isSpectator() && model.teamChat() && ! model.playerInTeam(),
                    team: model.teamChat(),
                    players: getPlayers(),
                };
            });
            ko.computed(function() {
                api.panels.chat && api.panels.chat.message('state', model.chatState());
            });
        }
    })
})();
