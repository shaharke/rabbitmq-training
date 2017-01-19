const Rx = require('rx')

var q = 'tasks';
var open = require('amqplib').connect('amqp://localhost');

// Consumer
var channelP = open.then(function(conn) {
  return conn.createChannel();
}).then(function(ch) {
  return ch.assertQueue(q).then(function(ok) {
    return ch;
  });
}).catch(console.warn);

channelP.then(function(ch) {
  var source = Rx.Observable.create(function (observer) {
    ch.consume(q, function(msg) {
     if (msg !== null) {
        observer.onNext(msg.content.toString());
        ch.ack(msg);
      }})
    })

  var subscription = source.bufferWithCount(5).bufferWithCount(5)
     .map(function(arr) { return Rx.Observable.fromArray(arr); })
     .map(function(m) { return '****' + m })
     .subscribe(
    function (x) { console.log('onNext: %s', x); },
    function (e) { console.log('onError: %s', e); },
    function () { console.log('onCompleted'); });
})

