const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const card = require('./cards');
mongoose.connect('mongodb://localhost/a5', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(console.log("connected to mongodb")).catch('connection error');
//console.log(card.getCards());
//defining table
const pSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: String,
    friends: Array,
    friends_requests: Array,
    cards: Array,
    trade_requests: []
});
var counter = 0;
var c1, c2, c3;
const trSchema = new mongoose.Schema({
    sender: {
        username: String,
        cards: Array
    },
    receiver: {
        username: String,
        cards: Array
    }

});
const users = new mongoose.model('Users', pSchema);

const trade = new mongoose.model('Trade', trSchema);
//saving a document
async function addUser(user) {
    const userData = await users.findOne({
        username: user.username
    });
    if (userData !== null) {
        return false;
    }
    cr = await card.getCards();
    const pr = new users({
        username: user.username,
        password: user.password,
        cards: cr
    });
    try {
        const result = await pr.save();
        //console.log(result);
        return result;
    } catch (e) {
        return false;
    }

}


async function getData() {
    const userData = await users.find();
    return userData;
}

//checking for login
async function login(user) {
    try {
        const userData = await users.findOne(user);
        // console.log(userData);
        const token = jwt.sign(user.username, "StayHomeStaySafe");
        // console.log(token)
        if (userData != null) {
            return token;
        } else
            return false;
    } catch (error) {
        return 'error occured;]';
    }
}
//data for user home page
async function userHome(token) {
    try {
        const decoded = jwt.verify(token, "StayHomeStaySafe");
        //console.log(decoded);
        const userData = await users.findOne({
            username: decoded
        });
        //  console.log(userData);
        if (userData != null) {
            return userData;
        } else
            return false;
    } catch (error) {
        return 'error occured;]';
    }
}

//get possible friends data
async function possibleData(token) {
    const usr = await userHome(token);
    var allData = await getData();
    allData = allData.filter((d) => usr.username != d.username);

    for (let i = 0; i < usr.friends.length; i++) {
        allData = allData.filter((d) => usr.friends[i].username != d.username);

    }
    //console.log(allData);
    return allData;
}



//sending friend request
async function friendRequest(data) {
    sender = await userHome(data.token);
    receiver = data.receiver;
    rest = users.findOne({
        username: receiver
    }, function (err, doc) {
        doc.friends_requests.push(sender.username);
        doc.save();
    });
    return rest;

}
//deleting a friend request
async function dFRequest(data) {
    sender = await userHome(data.token);
    const receiver = await users.findOne({
        username: data.receiver
    });

    rest = users.findOne({
        username: receiver.username
    }, function (err, doc) {
        //doc.friends.push(sender);

        //doc.save();
    });

    r = users.findOne({
        username: sender.username
    }, function (err, doc) {
        //doc.friends.push(receiver);
        var arr = doc.friends_requests.filter(p => p != receiver.username);


        doc.friends_requests = arr;

        doc.save();
    });
    return 'request removed';
}

//Approving a friend request
async function ApproveRequest(data) {
    sender = await userHome(data.token);
    const receiver = await users.findOne({
        username: data.receiver
    });

    rest = users.findOne({
        username: receiver.username
    }, function (err, doc) {
        doc.friends.push(sender);

        doc.save();
    });

    r = users.findOne({
        username: sender.username
    }, function (err, doc) {
        doc.friends.push(receiver);
        var arr = doc.friends_requests.filter(p => p != receiver.username);


        doc.friends_requests = arr;

        doc.save();
    });
    return 'request approved';
}
//get user data by name

async function getD(name) {
    const userData = await users.findOne({
        username: name
    });

    return userData;
}

async function getDt(tk) {
    const decoded = jwt.verify(tk, "StayHomeStaySafe");
    const userData = await users.findOne({
        username: decoded
    });

    return userData;
}

//------\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//approve trade request
//Approving a trade request
async function ApproveTRequest(data) {
    var rec = '';
    var sen = '';
    const tr = await TRequest(data.id);
    sen = tr.sender.username;
    rec = tr.receiver.username;
    var sendersCard = [];
    const receiver = users.findOne({
        username: rec
    }, function (err, doc) {
        //===========================

        for (let i = 0; i < doc.cards.length; i++) {
            for (let j = 0; j < tr.sender.cards.length; j++) {
                if (doc.cards[i]._id == tr.sender.cards[j][0]._id) {
                    counter++
                }
            }
        }
        if (counter != tr.sender.cards.length) {
            c1 = false;
        }
    });
    const sndr = users.findOne({
        username: sen
    }, function (err, doc) {
        counter = 0;
        for (let i = 0; i < doc.cards.length; i++) {
            for (let j = 0; j < tr.receiver.cards.length; j++) {
                if (doc.cards[i]._id == tr.receiver.cards[j][0]._id) {
                    counter++
                }
            }
        }
        if (counter != tr.receiver.cards.length) {
            c2 = false;
        }
    });


    if (c1 == false || c2 == false) {
        //trade request is not valid
        const rer = await dlTRequest(data.id);
        return false;
    } else {
        //updation of tables code
        const recvr = users.findOne({
            username: rec
        }, function (err, doc) {
            for (let i = 0; i < tr.sender.cards.length; i++) {
                doc.cards.push(tr.sender.cards[i][0]);
            }
            for (let i = 0; i < doc.cards.length; i++) {
                for (let j = 0; j < tr.receiver.cards.length; j++) {
                    if (doc.cards[i]._id == tr.receiver.cards[j][0]._id) {
                        doc.cards.splice(i, 1);

                        //console.log(doc.cards[i]._id, tr.receiver.cards[j][0]._id);
                    }
                }
            }
            doc.save();

            // console.log(doc);
        });

        const sdr = users.findOne({
            username: sen
        }, function (err, doc) {
            for (let i = 0; i < tr.receiver.cards.length; i++) {
                doc.cards.push(tr.receiver.cards[i][0]);
            }
            a = doc.cards;
            for (let i = 0; i < doc.cards.length; i++) {
                for (let j = 0; j < tr.sender.cards.length; j++) {
                    if (doc.cards[i]._id == tr.sender.cards[j][0]._id) {
                        a.splice(i, 1);
                    }
                }
            }
            //            doc.cards = a;
            doc.save();
        });

        const rer = await dlTRequest(data.id);
        return rer;

    }

}

//sending a trade request
async function snTRequest(data, token) {
    const pr = new trade(data);

    try {
        const result = await pr.save();
        //console.log(result);
        const receiver = users.findOne({
            username: data.receiver.username
        }, function (err, doc) {
            doc.trade_requests.push(result);

            doc.save();
            return true;
        });

    } catch (e) {
        return false;
    }

}


//deleting a trade request


async function dlTRequest(tid) {


    const tr = await trade.findById(tid);
    var nam = tr.receiver.username;
    tr.remove();

    users.findOne({
        username: nam
    }, function (err, doc) {
        var ar = doc.trade_requests;
        for (let i = 0; i < ar.length; i++) {
            if (ar[i]._id == tid) {
                ar.splice(i, 1);
            }

        }
        doc.trade_requests = ar;

        doc.save();
    });
    return true;

}



async function TRequest(tid) {
    const tr = await trade.findById(tid);
    //console.log(tr);
    return tr;

}


module.exports.addUser = addUser;
module.exports.getData = getData;
module.exports.login = login;
module.exports.userHome = userHome;
module.exports.possibleData = possibleData;
module.exports.friendRequest = friendRequest;
module.exports.ApproveRequest = ApproveRequest;
module.exports.getD = getD;
module.exports.getDt = getDt;

module.exports.ApproveTRequest = ApproveTRequest;

module.exports.snTRequest = snTRequest;

module.exports.TRequest = TRequest;
module.exports.dlTRequest = dlTRequest;
module.exports.dFRequest = dFRequest;