const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());


const users = [
    {username : 'gkswhddnr', password : 'gkswhddnr1'},
    {username : 'user2', password : 'password2'},
];

const secretKey = 'secretkey';           //비밀 키 (반드시 보안);

function verifyToken(req, res, next)    // 미들웨어 함수를 사용하여 토큰 검사
 {
  const token = req.headers.authorization;

  if(!token){
    return res.status(403).json({message : "No token provided"});
  }
  
  jwt.verify(token, secretKey, (err, decoded) => {
    if(err){
        return res.status(401).json({message: 'failed to authenticate token'});
    }
    req.decoded == decoded;
    next();
  })
}

app.post('/login' , (req , res) => {
 const {username, password} = req.body;

 const user = users.find(u=> u.username === username && u.password === password);

 if (user) 
{
    const token = jwt.sign({username: user.username} , secretKey, {expiresIn: '1h'});
    res.status(200).json({token});
}
else
{
    res.status(401).json({message : 'login failed'})
}

});

app.get('/protected' , verifyToken , (req, res) => {
    res.status(200).json({message: 'This is a protected endpoint' , user: req.decoded});
})

const PORT = process.env.PORT || 3000;
app.listen(PORT , ()=> {
    console.log('Server is running on port 3000');
});