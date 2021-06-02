const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/a5', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(console.log("connected to mongodb")).catch('connection error');


//schema
const trSchema = new mongoose.Schema({
    username: String,
    s_id: String
});

const session = new mongoose.model('Session', trSchema);
//add session in db
async function addSess(data) {
    const Data = await session.findOne({
        username: data.username
    });
    if (Data !== null) {
        Data.remove();
    }
    const pr = new session({
        username: data.username,
        s_id: data.id
    })
    pr.save();
}
//get session
async function getSess(data) {
    const Data = await session.findOne({
        username: data.name
    });

    return Data;
}



module.exports.addSess = addSess;
module.exports.getSess = getSess;