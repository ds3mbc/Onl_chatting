	
/**
 * 모듈을 추출합니다.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var socketio = require('socket.io');

var app = express();

// 환경 설정
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//라우팅 설정 
app.get('/', routes.index);
//app.get('/newroom', routes.newroom);
app.get('/start', routes.start);


var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

//소켓 통신
//소켓 서버
var io = socketio.listen(server);

io.sockets.on('connection', function(socket){
    //message 이벤트
    socket.on('message', function(data){
        //클라이언트의 message 이벤트를 발생
        io.sockets.emit('message', data);
    });
});


