document.getElementById('confirm').addEventListener('click', function (params) {
    var r = params.target.value;

    $.ajax({
        type: 'post',
        url: 'http://localhost:3000/apTRequest',
        data: JSON.stringify({
            id: r
        }),
        contentType: "application/json; charset=utf-8",

        success: function (ret) {
            if (ret) {
                alert('Trade request accepted successfully ')
            } else {
                alert('sorry,trade request in no more valid')
            }
            window.location.replace('http://localhost:3000/userhome/' + sessionStorage.getItem('token'));

        },
        error: function (params) {
            alert('problem in sending request');
        }
    });
})


//request delete 
document.getElementById('reject').addEventListener('click', function (params) {
    var r = params.target.value;
    console.log(r);
    $.ajax({
        type: 'post',
        url: 'http://localhost:3000/delTRequest',
        data: JSON.stringify({
            id: r
        }),
        contentType: "application/json; charset=utf-8",

        success: function (ret) {
            alert('Trade request rejected successfully ');
            window.location.replace('http://localhost:3000/userhome/' + sessionStorage.getItem('token'));

        },
        error: function (params) {
            alert('problem in sending request');
        }
    });
})