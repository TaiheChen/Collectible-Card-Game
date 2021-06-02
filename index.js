// Name: Taihe Chen
// Student number: 101047827
const express = require('express');
const socket = require('socket.io');
const app = express();
app.use(express.json());
app.set('view engine', 'pug');
const users = require('./user');
const cards = require('./cards');

const session = require('./session');
app.use(express.static('public'));

//var cards = ["card1", "card2", "card3", "card4", "card5"];
//var friends = ["friend1", "friend2", "friend3", "friend4", "friend5", ]
//just for check
app.get('/check',
    async function (req, res) {

        res.send(cards);
    });
app.get('/', function (req, res) {
    res.render('home.pug');
})


//main entring page for user
app.get('/userhome/:token', async function (req, res) {
    usr = await users.userHome(req.params.token)

    res.render('userMain.pug', {
        username: usr.username,
        card: usr.cards,
        friend: usr.friends,
        friendr: usr.friends_requests,
        trade: usr.trade_requests,
        token: usr._id,
        tk1: req.params.token
    })
})
//show details of token
app.get('/cards/:name', async function (req, res) {
    usr = await cards.getC(req.params.name)
    res.render('tokenDetail.pug', {
        card: usr
    })
})
//getting possible friends data
app.get('/friends/:token', async function (req, res) {
    const fr = await users.possibleData(req.params.token);

    res.send(fr);
})
//specific user data

app.get('/specific/:token', async function (req, res) {
    usr = await users.userHome(req.params.token)

    res.send(usr);
})
//friends profile
app.get('/friend/:name/:token', async function (req, res) {
    usr = await users.getD(req.params.name);


    res.render('friendsProfile.pug', {
        name: usr.username,
        cards: usr.cards,
        token: req.params.token
    })
})


//-----------------------------------------
//trade profile page
app.get('/trade/:tid', async function (req, res) {
    usr = await users.TRequest(req.params.tid);
    //usr = JSON.stringify(usr);

    res.render('trade.pug', {
        sender: usr.sender,
        receiver: usr.receiver,
        tid: req.params.tid,

    })
})



//Registering a user in database if user already exist return false to client
app.post('/register', async function (req, res) {

    ret = await users.addUser(req.body);
    res.send(ret);

});
//login to account
app.post('/login', async function (req, res) {

    ret = await users.login(req.body);
    res.send(ret);

});
//send friend reuest
app.post('/frndrequest/:token', async function (req, res) {

    ret = await users.friendRequest({
        token: req.params.token,
        receiver: req.body.username
    });
    res.send(ret);

});
//approve friend request
app.post('/apprequest/:token', async function (req, res) {

    ret = await users.ApproveRequest({
        token: req.params.token,
        receiver: req.body.username
    });
    res.send(ret);

});
//-------
app.get('/gtt/:token', async function (req, res) {
    usr = await users.getDt(req.params.token)

    res.send(usr);
})
//delete a trade request
app.post('/delFrequest/:token', async function (req, res) {
    //console.log('hello');
    ret = await users.dFRequest({
        token: req.params.token,
        receiver: req.body.username
    });
    res.send(ret);

});

//approve trade request
app.post('/apTRequest', async function (req, res) {

    ret = await users.ApproveTRequest(req.body);
    res.send(ret);

});
//send trade request
app.post('/sndTRequest/:token', async function (req, res) {
    //console.log(req.body);
    ret = await users.snTRequest(req.body, req.params.token);
    res.send(ret);

});
//friends data
app.get('/all', async function (req, res) {
    usr = await users.getData();

    res.send(usr);
})


//delete trade request
app.post('/delTRequest', async function (req, res) {
    //console.log(req.body);
    ret = await users.dlTRequest(req.body.id);
    res.send(ret);

});


const server = app.listen(3000, function () {
    console.log('server started at port 3000');
});

const io = socket(server);
io.on('connection', function (socket) {


    socket.on('reload', async function (data) {
        console.log('reload', data);
        var n = await session.getSess(data);
        console.log('here reloade', n);
        socket.broadcast.emit('reload', "ok");
    })

    socket.on('login', async function (data) {
        console.log(data, socket.id);
        var j = await session.addSess({
            username: data.username,
            id: socket.id
        })

    })


})