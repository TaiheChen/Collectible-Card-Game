var t = localStorage.getItem('token');
if (t != null) {
    var s = document.getElementsByClassName('already')[0];
    var l = document.createElement('h2');
    var a = document.createElement('button');
    a.innerHTML = 'logout';
    l.innerHTML = "you are already logged in please log out first";
    l.style.color = 'red';
    s.appendChild(l);
    s.appendChild(a);

    a.addEventListener('click', function (params) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
    })
} else {
    document.querySelector('#btn_register').addEventListener('click', function () {
        usr = document.getElementById('user').value;
        psw = document.getElementById('pass').value;
        //register a new user
        $.ajax({
            type: 'post',
            url: 'http://localhost:3000/register',
            data: JSON.stringify({
                username: usr,
                password: psw
            }),
            contentType: "application/json; charset=utf-8",

            success: function (ret) {
                if (ret == false) {
                    document.getElementById('error').innerHTML = "user already exists";
                    document.getElementById('error').style.color = 'red';
                } else {

                    alert('registered successfully');
                    usr = document.getElementById('user').value;
                    psw = document.getElementById('pass').value;
                    $.ajax({
                        type: 'post',
                        url: 'http://localhost:3000/login',
                        data: JSON.stringify({
                            username: usr,
                            password: psw
                        }),
                        contentType: "application/json; charset=utf-8",
                        success: function (token) {
                            sessionStorage.setItem('token', token);
                            localStorage.setItem('token', token);
                            if (token) {
                                window.location.href = "http://localhost:3000/userhome/" + token;
                            }

                        },
                        error: function (params) {
                            console.log('connection error');
                        }
                    });
                }
            },
            error: function (params) {
                alert("sorry connection error");
            }
        });
    });

    document.querySelector('#btn_login').addEventListener('click', function () {
        console.log("Login CLICKED");
        usr = document.getElementById('user').value;
        psw = document.getElementById('pass').value;
        $.ajax({
            type: 'post',
            url: 'http://localhost:3000/login',
            data: JSON.stringify({
                username: usr,
                password: psw
            }),
            contentType: "application/json; charset=utf-8",
            success: function (token) {
                sessionStorage.setItem('token', token);
                localStorage.setItem('token', token);
                if (token) {
                    window.location.href = "http://localhost:3000/userhome/" + token;
                } else {
                    console.log("error")
                    document.getElementById('error').innerHTML = "invalid username or password";
                    document.getElementById('error').style.color = 'red';

                }

            },
            error: function (params) {
                console.log("error")
                document.getElementById('error').value = "invalid username or password";
                document.getElementById('error').style.color = 'red';

            }
        });
    });
}