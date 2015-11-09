'use strict';
var clc = require('cli-color');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/bfx');
var Schema = mongoose.Schema;
var TradesSchema = new Schema({
   seq: String,
   timestamp: Number,
   price: Number,
   amount: Number
});
var Trades = mongoose.model('socketTrades', TradesSchema);
var ws = function(api_key, api_secret) {
var WebSocket = require('ws');
var ws = new WebSocket("wss://api2.bitfinex.com:3000/ws");
   ws.api_key = '7kGrX7bMkwKB16fzwHqKYMySuDAhah0OgUqTv0GvCmW';
   ws.api_secret = 'bfopPuyyNO56fSK9MB3wICgzM0MybrpsODZHseNL0yo';
   ws.on('open', function open() {
      ws.send(JSON.stringify({
         "event": "subscribe",
         "channel": "trades",
         "pair": "BTCUSD"
      }));
   });
   ws.on('message', function(data, flags) {
        var data = JSON.parse(data);
       var p = data[3];
      var a = data[4];
      if (a > 0) {
         p = clc.green(p)
      } else {
         p = clc.red(p)
      };
      console.log(clc.blue('ID: ' + clc.yellow(data[1])) +
         clc.blue(' Time: ' + clc.yellow(data[2])) +
         clc.blue(' Price: ') + p +
         clc.blue(' Amount: ' + clc.white(data[4]))

      );
      var latest = new Trades({
         seq: data[1],
         timestamp: data[2],
         price: data[3],
         amount: data[4]
      });
      latest.save(function(err) {
         if (err) throw err;
         console.log("saved");
      });
   })
};
ws();
