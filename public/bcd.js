var possible_friends = [];
const token = sessionStorage.getItem('token');
var user = '';
const searchInput = document.querySelector('.search-input');
const suggestionsPanel = document.querySelector('.suggestions');
var dt;
const pendg = document.getElementsByClassName('pending')[0];
var socket = io.connect('http://localhost:3000');


var t = document.getElementById('check');
var tk = t.innerHTML;
t.hidden = true;
console.log(token, localStorage.getItem('token'))
if (token != tk) {

  $('.conta').remove();
  var d = document.createElement('h3');
  d.innerHTML = "permission denied";
  var n = document.getElementById('add');
  n.appendChild(d);
}
//get user data
$.ajax({
  type: 'get',
  url: 'http://localhost:3000/specific/' + token,

  success: function (dat) {
    user = dat;
    localStorage.setItem('user', JSON.stringify(user));
    socket.emit('login', {
      username: user.username
    });



    if (user.trade_requests.length == 0) {
      var ere = document.createElement('h4');
      ere.innerHTML = 'no pending requests';
      document.getElementsByClassName('treq')[0].appendChild(ere);
    }
    if (user.friends.length == 0) {
      var ere = document.createElement('h4');
      ere.innerHTML = 'no friends to show';
      document.getElementsByClassName('flst')[0].appendChild(ere);
    }
    var re = user.friends_requests;
    if (user.friends_requests.length == 0) {
      var ere = document.createElement('h4');
      ere.innerHTML = 'no pending requests';
      document.getElementsByClassName('pending')[0].appendChild(ere);
    }
    console.log(dat.friends_requests);
    //for pending request for friends
    re.forEach(function (pend) {

      const lab = document.createElement('label');
      const confirm = document.createElement('button');
      const del = document.createElement('button');
      confirm.setAttribute('id', pend);
      del.setAttribute('id', pend);
      confirm.innerHTML = 'confirm';
      del.innerHTML = 'delete';
      lab.innerHTML = pend;
      pendg.appendChild(lab);
      pendg.appendChild(confirm);
      pendg.appendChild(del);
      pendg.appendChild(document.createElement('br'));
      pendg.appendChild(document.createElement('br'));

      del.addEventListener('click', function () {
        $.ajax({
          type: 'post',
          url: 'http://localhost:3000/delFrequest/' + token,
          data: JSON.stringify({
            username: lab.innerHTML

          }),
          contentType: "application/json; charset=utf-8",

          success: function (ret) {
            window.location.reload();
            console.log('ok');
          },
          error: function (params) {
            console.log("error")
          }
        });


      })



      //confirming friend request
      confirm.addEventListener('click', function () {
        $.ajax({
          type: 'post',
          url: 'http://localhost:3000/apprequest/' + token,
          data: JSON.stringify({
            username: lab.innerHTML

          }),
          contentType: "application/json; charset=utf-8",

          success: function (ret) {
            socket.emit('reload', {
              name: pend
            });
            setTimeout(function () {
              window.location.reload();
            }, 1500)


          },
          error: function (params) {
            console.log("error")
          }
        });


      })


    })


  },
  error: function (params) {
    console.log('error');
  }
});
$.ajax({
  type: 'get',
  url: 'http://localhost:3000/friends/' + token,

  success: function (friends) {
    possible_friends = friends;
  },
  error: function (params) {
    console.log("error")

  }
});




searchInput.addEventListener('keyup', function () {
  const input = searchInput.value;
  suggestionsPanel.innerHTML = '';
  const suggestions = possible_friends.filter(function (country) {
    return country.username.toLowerCase().startsWith(input);
  });
  suggestions.forEach(function (suggested) {
    const div = document.createElement('div');
    const but = document.createElement('button');
    but.setAttribute('id', suggested.username);
    but.innerHTML = "Add Friend";
    div.innerHTML = suggested.username;
    but.addEventListener('click', function () {
      //do a post request here               
      $.ajax({
        type: 'post',
        url: 'http://localhost:3000/frndrequest/' + token,
        data: JSON.stringify({
          username: div.innerHTML

        }),
        contentType: "application/json; charset=utf-8",

        success: function (ret) {
          but.innerHTML = "request sended"
          but.disabled = true;
          socket.emit('reload', {
            name: suggested.username
          });
          setTimeout(function () {
            window.location.reload();
          }, 1500);

        },
        error: function (params) {
          console.log("error")
        }
      });

    })
    suggestionsPanel.appendChild(div);
    suggestionsPanel.appendChild(but);
  });
  if (input === '') {
    suggestionsPanel.innerHTML = '';
  }
})

//event listener for options
var app = document.querySelector('.rec');
var c = document.getElementsByClassName('fr_card')[0];
c.addEventListener('change', function name(event) {

  $('.recCards').remove();
  const selected = event.target.value;
  const sel = dt.filter(f => f.username == selected);
  const selectedFriend = sel[0].cards;
  console.log(selectedFriend);
  selectedFriend.forEach(function (crds) {
    var ch = document.createElement('input');
    ch.setAttribute('type', 'checkbox');
    ch.setAttribute('class', 'recCards');
    ch.setAttribute('value', crds.name);
    var lb = document.createElement('label');
    lb.innerHTML = crds.name;
    lb.setAttribute('class', 'recCards');
    app.appendChild(ch);
    app.appendChild(lb);
    app.appendChild(document.createElement('br'));

  });
  bt = document.createElement('button');
  bt.setAttribute('id', 'con_trade');
  bt.setAttribute('class', 'recCards');
  bt.innerHTML = 'Confirm Trade';
  app.appendChild(bt);
  var selR = [];
  var selS = [];
  bt.addEventListener('click', function (e) {
    var rCards = document.getElementsByClassName('recCards');
    for (let i = 0; i < rCards.length; i++) {
      if (rCards[i].checked == true) {
        selR.push(selectedFriend.filter(p => p.name == rCards[i].value));
      }

    }
    const sCards = document.getElementsByClassName('sendc');
    for (let i = 0; i < sCards.length; i++) {
      if (sCards[i].checked == true) {
        selS.push(user.cards.filter(p => p.name == sCards[i].value));
      }

    }
    console.log(selR, selS);
    socket.emit('reload', {
      name: selected
    });

    //sending trade request
    $.ajax({
      type: 'post',
      url: 'http://localhost:3000/sndTRequest/' + token,
      data: JSON.stringify({
        sender: {
          username: user.username,
          cards: selS
        },
        receiver: {
          username: selected,
          cards: selR
        }

      }),
      contentType: "application/json; charset=utf-8",

      success: function (ret) {
        alert('Trade request sended successfully ');
        bt.disabled = true;
        window.location.reload();

      },
      error: function (params) {
        alert('problem in sending request');
      }
    });
  })
})
document.getElementById('logout').addEventListener('click', function (params) {
  sessionStorage.clear();
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  console.log('hj');
  window.location.replace('http://localhost:3000');
})



window.addEventListener('storage', function (e) {
  window.location.replace('http://localhost:3000');
});

$.ajax({
  type: 'get',
  url: 'http://localhost:3000/all',

  success: function (friends) {
    dt = friends;
  },
  error: function (params) {
    console.log("error")

  }
});


socket.on('reload', function (data) {

  window.location.reload();
})