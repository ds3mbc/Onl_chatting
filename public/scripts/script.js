$(document).ready(function(){
    //변수 선언
    var socket = io.connect();
    
    //채팅 들어올때 프롬프트로 이름 설정
    $('#start').click(function(){
        $('#pop').show();
    })
    $('#enter').click(function(){
        $('#pop').hide();
    })
    $('#exit').click(function(){
        $('#pop').hide();
    })
    
    //이벤트 연결
    socket.on('message', function(data){
        //추가할 문자열 등록.
        var output='';
        output +='<li>';
        output += data.message;
        output +='  <small>';
        output += data.date_ampm +' '+data.date_hour + ':' + data.date_minute + ':' + data.date_second;
        output +='</small>';
        output +='</li>';
        
        //문서에 삽입!
        $(output).appendTo('#lists');
    });
    
    $('#message').keyup(function(){
        //텍스트가 비어있을 때 전송버튼 비활성
        if($('#message').val() === ''){
            $('#submit').attr('disabled', true);
        } else{
            $('#submit').removeAttr('disabled');
        } 
    });
    function leadingzeros(obj, digits){
        var zero = '';
        var n = obj.toString();
        if(n.length < digits){
            for(i=0; i < digits - n.length;i++){
                zero += '0'
            }
        }
        return zero + n;
    }
    
    //메세지 전송 구현
    function submit(){
        var date_month = (new Date().getMonth()+1); //전송 월
        var date_date = new Date().getDate(); //전송 일
        var date_hour = new Date().getHours(); // 전송 시
        var date_minute = leadingzeros(new Date().getMinutes(), 2); //전송 분
        var date_second = leadingzeros(new Date().getSeconds(), 2); //전송 초
        //오전 오후 구분
        function ampm(hours){
            if(hours <12)
                return 'am';
            else {
                date_hour = date_hour - 12;
                return 'pm';
            }
        }
        
        //소켓으로 전송
        socket.emit('message', {
            message: $('#message').val(),
            date_month: date_month,
            date_date: date_date,
            date_ampm: ampm(date_hour),
            date_hour: date_hour,
            date_minute: date_minute,
            date_second: date_second
        });
        
        $('#message').val(''); //메세지창 지우기
        $('#message').focus(); //메세지창으로 포커스 이동
        $(this).attr('disabled', true); //버튼 비활성
        var height = $('#lists').height(); //채팅 높이를 꺼내서
        $('#logs').scrollTop(height + 20); //제일 밑으로 이동
    }
    //엔터칠때 전송
    $('#message').keydown(function(key){
        if(key.keyCode == 13){
            if($(this).val() !== ''){
                submit()
            }
        }
    });
    //submit 누를때 전송
    $('#submit').click(function(){
        submit()
    });
});