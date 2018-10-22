(function() {
    function getPlayers(){
        var players = []
        for(var i = 0; i < model.players().length; i++){
            players[i] = model.players()[i];
            delete players[i].allies;
        }
        return players
    }
    model.chatSelected.subscribe(function(){
        if (model.chatSelected()){
            console.log("Sending...");
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