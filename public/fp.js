var t = document.getElementById('check');
var um = t.innerHTML;
t.hidden = true;
var ur = JSON.parse(localStorage.getItem("user") || "[]");
var r = false;

for (let i = 0; i < ur.friends.length; i++) {

    if (ur.friends[i].username == um) {
        r = true;
    }
}
if (r == false) {
    $('.rem').remove();
    var h = document.createElement('h3');
    h.innerHTML = "unable to locate";
    document.getElementById('add').appendChild(h);

}