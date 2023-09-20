const express = require('express');
const app = express();

let users = [
    {id: 0, data: "UserData"}    // 배열안에 오브젝트
];

let bulidingUnderConstuction = null; //시간 데이터를 저장한다.
//let bulidingUnderConstuction[10][10] + 오브젝트 형태가 들어가게

app.use(express.json());  //json을 사용하겠다.

// ============== GAME LOGIC ======================

app.post('/startConstruction', (req,res) => {
    const currentTime = new Date();           //스타트시 const로 시간을 고정해준다. DB ->로 저장할떄는 형태 결정해야함
    const constructionTime = new Date(currentTime.getTime() + 10000);
    bulidingUnderConstuction = constructionTime;

    let result = {                              //구조를 나중에 자세하게 설정
        message : bulidingUnderConstuction
    };

    console.log("SYSTEM : 건설 시작");

    res.send({                                  //기본 커맨트로 전송
        cmd : 1101, 
        message : "SYSTEM : 건설 시작",
        result
    });

});


app.get('/checkConstruction' , (req, res) => {
    if(bulidingUnderConstuction && new Date() >= bulidingUnderConstuction) //시간이 지났으면
    {
        bulidingUnderConstuction =null;
        let result = {
            message:bulidingUnderConstuction

        }       
        console.log("SYSTEM : 건설 완료");

        res.send({                                  //기본 커맨트로 전송
            cmd : 1101, 
            message : "SYSTEM : 건설 완료",
            result
});

    }
    else        //설정한 시간 이전
    {
        let remainingTime = bulidingUnderConstuction ? bulidingUnderConstuction - new Date() : 0;
        remainingTime = Math.max(0, remainingTime);     //음수 시간을 0으로 보정
        console.log("SYSTEM : 건설 중입니다 남은 시간은" + remainingTime + "ms");
        let result = {
            message:bulidingUnderConstuction
        }       

    res.send({                                  //기본 커맨트로 전송
        cmd : 1101, 
        message : "SYSTEM : 건설 중입니다",
        result
});

}

});




// ============== GAME API ======================

app.get('/', (req, res)=>{

  let result = {
    cmd : -1,
    message : "Hello world"
  };
  res.send(result);
});


app.get('/id', (req, res)=>{

    let result = {
        cmd : 100,
        message : "My Id"
    };
    res.send(result);
});

app.get('/userdata/list', (req, res) => {         //유저 리스트 반환

    let result = users.sort(function(a,b){         // ID 순서로 정령
        return b.id - a.id;

    });

    result = result.slice(0, users.length);        //유저 숫자만큼 배열 생성 0~ n-1

    res.send({                                     //패킷을 완성해서 보낸다.
        cmd : 1101,
        message : "",
        result
    });

});

app.post('/userdata' , (req, res) => {
    const{id, data} = req.body;                 //Reqest Body에 Json 데이터가 들어오면 id, data에 연결
    console.log(id,data);
    let result = {
        cmd: -1,
        message: ''
    };

    let user = users.find(x=>x.id == id);   //users 배열에서 x를 찾아서 리턴

    if(user == undefined)                   //undefined 될경우 신규 등록
    {
        users.push({id, data});             //배열에 입력 Push
        result.cmd = 1001;
        result.message = "유저 신규 등록";
    }
    else
    {
        console.log(id, user.data);
        user.data = data;
        result.cmd = 1002;
        result.message = '데이터 갱신';
    }

    console.log(users);
    res.send(result);
    
});

app.listen(3030, ()=> {
    console.log('server is running at 3030 port');
});
