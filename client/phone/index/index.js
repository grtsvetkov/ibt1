Session.set('key', 0);

Template.phoneIndex.created = function(){
    window.addEventListener("deviceorientation", function(event){
        Session.set('alpha',event.alpha.toFixed(1));
        Session.set('beta',event.beta.toFixed(1));
        Session.set('gamma',event.gamma.toFixed(1));
        Session.set('orient', window.orientation || 0);
    }, true);
};

Template.phoneIndex.events({
    'click #btnConnect': function (e, tpl) {
        key = parseInt(tpl.find('#txtText').value);
        Session.set('key', key);
        ServerSession.set(Session.get('key'), {status: 2});
    }
});

Template.phoneIndex.helpers({
    test: function() {
        return 'alpha:' + Session.get('alpha') + '; ' + 'beta:' + Session.get('beta') + '; ' + 'gamma:' + Session.get('gamma') + ';';
    },
    key: function () {
        return Session.get('key');
    },

    keyIsConnected: function () {

        if (Session.get('key')) {
            var data = ServerSession.get(Session.get('key'));

            if (data && (data.status == 3 || data.status == 4)) {
                ServerSession.set(Session.get('key'), {status: 4, coord: {alpha: Session.get('alpha'), beta: Session.get('beta'), gamma: Session.get('gamma'), orient: Session.get('orient')}});
                return true;
            }
        }

        return false;
    }
});