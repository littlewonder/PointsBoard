var userList = new Mongo.Collection('Users');

Template.mainlist.helpers({
    'users': function() {
        return userList.find({ addedby: Meteor.userId() }, { sort: { points: -1 } });
    },
    'count': function() {
        return userList.find({ addedby: Meteor.userId() }).count();
    },
    'select': function() {
        var clickedid = Session.get('clicked');
        if ((this._id) === clickedid) {
            return "selecteduser";
        }
    },
    'check': function() {
        var counter = userList.find({ addedby: Meteor.userId() }).count();
        if (counter == 0) {
            return "hidden";
        }
    }
});

Template.mainlist.events({
    'click .userlist': function() {
        var userid = this._id;
        Session.set('clicked', userid);
    },
    'click .inc': function() {
        var clickedid = Session.get('clicked');
        if (clickedid === undefined) {
            document.getElementById("error").innerHTML = "Please select a User";
        } else {
            userList.update(clickedid, { $inc: { points: 5 } });
            document.getElementById("error").innerHTML = " "
        }
    },
    'click .dec': function() {
        var clickedid = Session.get('clicked');
        if (clickedid === undefined) {
            document.getElementById("error").innerHTML = "Please select a User";
        } else {
            userList.update(clickedid, { $inc: { points: -5 } });
            document.getElementById("error").innerHTML = " "
        }
    },
    'click .rm': function() {
        var clickedid = Session.get('clicked');
        if (clickedid === undefined) {
            document.getElementById("error").innerHTML = "Please select a User";
        } else {
            if (confirm("Do you really want to delete it?")) {
                userList.remove(clickedid);
            }
        }
    }
});


Template.newuser.events({
    'submit form': function(event) {
        event.preventDefault();
        var username = event.target.newname.value;
        var userpoints = event.target.newpoints.value;
        var numberpoints = parseInt(userpoints, 10);
        var currentuserid = Meteor.userId();
        userList.insert({
            name: username,
            points: numberpoints,
            addedby: currentuserid
        });
        event.target.newname.value = null;
        event.target.newpoints.value = null;
    }

});