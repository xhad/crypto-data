'use strict';
var clc = require('cli-color');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost:27017/bitfinex_usd');
var Schema = mongoose.Schema;
var TradesSchema = new Schema({
    tid: String,
    timestamp: Number,
    price: Number,
    amount: Number
});
var Trades = mongoose.model('socketTrades', TradesSchema);
var ws = function(api_key, api_secret) {
    var WebSocket = require('ws');
    var ws = new WebSocket("wss://api2.bitfinex.com:3000/ws");
    ws.api_key = 'KEY';
    ws.api_secret = 'SECRET';
    ws.on('open', function open() {
        ws.send(JSON.stringify({
            "event": "subscribe",
            "channel": "trades",
            "pair": "BTCUSD"
        }));
    });
    ws.on('message', function(data, flags) {
        var data = JSON.parse(data);
        console.log(data);
        var tid = data[2];
        var timestamp = data[3];
        var price = data[4];
        var amount = data[5];
        var latest = new Trades({
            tid: data[1],
            timestamp: +timestamp,
            price: +price,
            amount: +amount
        });

        if (timestamp)
          latest.save(function(err) {
            if (err) throw err;
            console.log("saved");
        });
    })
};
ws();
