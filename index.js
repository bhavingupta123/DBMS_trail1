const express = require('express')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const all =  require('./data')
const total =  require('./data2')
const app = express();
var check=0;
app.use(bodyparser({urlencoded:true}))

var publicDir = require('path').join(__dirname,'/public')
app.use(express.static(publicDir))

mongoose.connect("mongodb://localhost/sample");

app.set('views','views')
app.set('view engine','ejs')

app.get('/login',(req,res)=>{
    res.render('login')
})

app.get('/signup',(req,res)=>{
    const username = req.body.username;
    console.log(username)
    res.render('signup')
    
})

app.get('/vote',(req,res)=>{
    res.render('vote')
    
})

app.get('/candidatecreate',(req,res)=>{
    res.render('candidate')
    
})


app.get('/candidatelogin',(req,res)=>{
    res.render('candidatelogin')
    
})

app.post('/vote',(req,res)=>{

   const vote = req.body.vote;
    console.log(vote)
    total.findOneAndUpdate({party:vote},{$set: {votes: votes+1}},function(err,founduser){
        if(err){
            console.log(err);
        }
        else{
            console.log("update votes success");
        }
   })
    
})

app.post('/login',(req,res)=>{
    const id = req.body.id;
    const password1 = req.body.password;
    console.log(id)
    console.log(password1)
    all.find({id:id,password1:password1},function(err,founduser){
        if(err){
            console.log(err);
        }
        else{
            if(founduser!=[])
            {   console.log(founduser)
                  res.redirect('/vote')
            }
        }
   })
    
})

app.post('/signup',(req,res)=>{
    const username = req.body.username;
    const password1 = req.body.password;
    const password2 = req.body.cpassword;
    const address = req.body.address;
    const id = req.body.id;
    const date1 = req.body.date;
    const gender = req.body.gender;
    const vote =0;
    all.findOne({id:id},function(err,founduser){
        if(err){
            res.send(err);
        }else{
            if(founduser)
            {   
                console.log("bro already done")
                console.log(founduser);
                res.redirect('/login')
            }

            else
            {
                 
                if(password1===password2)
                {
                    console.log(founduser);
                    console.log("thank you for new accout")

                    const newUser = all({
                        username,
                        password1,
                        address,
                        id,
                        date1,
                        gender,
                        vote
                    });
             
                 newUser.save(()=>{
                     console.log('done')
                 });
                }
                res.redirect('/')
            }
        }
   })

})

app.get('/',(req,res)=>{
    res.render('home')
})

app.listen(3000,()=>{
    console.log("Listening on port 3000")
})