const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
mongoose.connect('mongodb://localhost/a5', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

//defining table
const pSchema = new mongoose.Schema({
    artist: String,
    attack: Number,
    cardClass: String,
    health: Number,
    name: String,
    rarity: String
});

const cards = new mongoose.model('cards', pSchema);
//complete data of cards
async function getData() {
    //console.log("hello from cards");
    const cardsData = await cards.find();
    return cardsData;
}
//get 10 records of cards
async function getCards() {
    var cardList = [];
    const cards = await getData();
    for (let i = 0; i < 10; i++) {

        var r = Math.floor(Math.random() * 1500000) % 1279;
        cardList.push(cards[r]);

    }

    return cardList;
}
//get specified card
async function getC(n) {
    const ca = await cards.findOne({
        name: n
    });

    return ca;
}

module.exports.getCards = getCards;
module.exports.getData = getData;
module.exports.getC = getC;