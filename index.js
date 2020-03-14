const express = require('express')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const all =  require('./data')
const total =  require('./data2')
const candidate =  require('./data3')
const otpv = require('./data4')
const admin = require('./data6')
const otpp = require('./data5')

const multer =require('multer')

const app = express();

var nodemailer = require('nodemailer');
var otpGenerator = require('otp-generator')
 
var global_id;
var global_email;
var bjp_votes,congress_votes,others_votes,aap_votes;
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


app.get('/otp',(req,res)=>{

    res.render('otp')

    var otp = otpGenerator.generate(6, { upperCase: false, specialChars: false ,alphabets:false});
    
    console.log("in otp page id is");
    console.log(global_id);

    console.log("in otp page mail is");
    console.log(global_email);

    console.log("in otp page otp is:");
    console.log(otp);

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: "goverment.portal9@gmail.com",
          pass: "bhavinis123"
        }
      });
      
      var mailOptions = {
        from: 'youremail@gmail.com',
        to: global_email,
        subject: 'FROM GOVERMENT PORTAL OF INDIA',
        text: 'OTP IS '+ otp +' please caste your vote '+' dont share with anyone '
      }; 
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      var email_otp=global_email;
      var id_otp=global_id;

        const otpdata = otpp({
            id_otp,
            email_otp,
            otp
        });

        otpdata.save(()=>{
        console.log('done')
    });
})


app.post('/otp',(req,res)=>{

    const otppr = req.body.otp;
    
    otpp.findOne({otp:otppr},function(err,founduser){
        if(err){
            res.send(err);
        }
        
        else{
            console.log("in otp page");
            console.log(founduser)
            if(founduser)
            {   
                res.redirect('/vote')
            }

            else
            {
                console.log("in otp page no one found");
            }
        }
   })
})

app.get('/vote',(req,res)=>{
    res.render('vote')
    
})

app.post('/vote',(req,res)=>{
    const vote = req.body.vote;
    if(vote==1)
    {
        party="BJP";
    }
    
    else if(vote==2)
    {
        party="CONGRESS";
    }

    else if(vote==3)
    {
        party="AAP";
    }

    else if(vote==4)
    {
        party="OTHERS";
    }

    
    total.findOneAndUpdate({party:party},  {$inc: {votes: 1}}, function (err, doc) {
       
        if (err) 
        {
                console.log("update document error");
        } 
        
        else {
                console.log("update documentsssss success");
                console.log(doc);

                console.log("update votes success");
                console.log(global_id);

                all.findOneAndUpdate({id:global_id},{$set: {vote: 1}},function(err,founduser){
                    if(err){
                        console.log(err);
                    }
                    else{
                        res.redirect('/thankyou')
                    }
                })
            }
    
    });

})

app.get('/thankyou',(req,res)=>{
    res.render('thankyou')
})

app.get('/candidatecreate',(req,res)=>{
    res.render('candidate')    
})

app.post('/candidatecreate',(req,res)=>{
    
    const username = req.body.username;
    const password1 = req.body.password;
    const password2 = req.body.cpassword;
    const party = req.body.party;
    const id = req.body.id;
    const date1 = req.body.date;
    const gender = req.body.gender;
    var votes=0;
    candidate.findOne({id:id},function(err,founduser){
        if(err){
            res.send(err);
        }else{
            if(founduser)
            {   
                console.log("bro already done candidate present")
                console.log(founduser);
                res.redirect('/login')
            }

            else
            {
                 
                if(password1===password2)
                {
                    console.log(founduser);
                    console.log("thank you for new accout candidate")

                    const newUser = candidate({
                        username,
                        password1,
                        party,
                        id,
                        date1,
                        gender
                    });

                    newUser.save(()=>{
                        console.log('done candidate created')
                    });    

                    const votess = total({
                        party,
                        votes
                    });
                    
                    votess.save(()=>{
                     console.log('done candidate created')
                 });
                }
                res.redirect('/')
            }
        }
   })

})





app.get('/candidatelogin',(req,res)=>{
    res.render('candidatelogin')

})

app.post('/candidatelogin',(req,res)=>{
   
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


app.post('/login',(req,res)=>{
    const id = req.body.id;
    global_id=id;
    const password1 = req.body.password;
    console.log(id)
    console.log(password1)
    all.find({id:id,password1:password1},function(err,founduser){
        if(err){
            console.log(err);
        }
        else{
            if(founduser!=[])
            {   
                
                console.log("vote data");
                console.log(founduser);
                console.log(founduser[0].vote);
                console.log(id);

                if(founduser[0].vote==0)
                {
                    global_email=founduser[0].email;
                    res.redirect('/otp')
                }
                  
                else
                {
                    console.log("FO bhbhbh")
                    res.redirect('/alreadyvoted')
                }
                      
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
    const email = req.body.email;
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
                        email,
                        gender,
                        vote
                    });
             
                 newUser.save(()=>{
                     console.log('done')
                 });


                 var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: "goverment.portal9@gmail.com",
                      pass: "bhavinis123"
                    }
                  });
                  
                  var mailOptions = {
                    from: 'youremail@gmail.com',
                    to: email,
                    subject: 'FROM GOVERMENT PORTAL OF INDIA',
                    text: 'Thank you for registering'+'please caste your vote'+'thank you'+'your username is'+username  +'thank you'
                  };
                  
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });

                }
                res.redirect('/')
            }
        }
   })

})

app.get('/alreadyvoted',(req,res)=>{
    res.render('alreadyvoted')

})

app.get('/home',(req,res)=>{
    res.render('home')
})

app.get('/adminlogin',(req,res)=>{
    res.render('adminlogin')
})

app.post('/adminlogin',(req,res)=>{

    const email = req.body.email;
    const password1 = req.body.password;

    admin.findOne({email:email,password:password1},function(err,founduser){
        if(err){
            res.send(err);
        }else{
            res.redirect('/selectoption')
        }
   })
    
})


app.get('/selectoption',(req,res)=>{
    res.render('selectoption')

})


app.post('/selectoption',(req,res)=>{
  
    const option = req.body.options;

    if(option==1)
    {
                total.findOne({party:"BJP"},function(err,founduser){    
                    if(err){
                        res.send(err);
                    }else{
                        if(founduser)
                        {   
                            console.log("total votes")
                            console.log(founduser);
                            bjp_votes=founduser["votes"];
                            console.log("bjp actual votes")
                            console.log(bjp_votes)
                        }

                        else
                        {
                            
                            bjp_votes=0;
                        }
                    }
            })

            total.findOne({party:"AAP"},function(err,founduser){
        if(err){
            res.send(err);
        }else{
            if(founduser)
            {   
                console.log("total votes aap")
                console.log(founduser);
                aap_votes=founduser["votes"];
            }

            else
            {
                console.log("total votes aap")
                console.log(founduser);
                aap_votes=0;
            }
        }
        })

        total.findOne({party:"CONGRESS"},function(err,founduser){
        if(err){
            res.send(err);
        }else{
            if(founduser)
            {   
                console.log("total votes congress")
                console.log(founduser);
                congress_votes=founduser["votes"];
            }

            else
            {
                console.log("total votes congreds")
                console.log(founduser);
                congress_votes=0;
            }
        }
        })

        total.findOne({party:"OTHERS"},function(err,founduser){
        if(err){
            res.send(err);
        }else{
            if(founduser)
            {   
                console.log("total votes other")
                console.log(founduser);
                others_votes=founduser["votes"];


            }

            else
            {
                console.log("total votes other")
                console.log(founduser);
                others_votes=0;

                console.log("bjp actual votes before render")
                console.log(bjp_votes)
                res.render('results',{winner:bjp_votes});
            }
        }
        })  
    }

    else if(option==2)
    {

    }

    else if(option==3)
    {
        res.render('candidate');
    }
})

/*app.get('/results',(req,res)=>{

    var bjp_votes,congress_votes,others_votes,aap_votes;
    candidate.findOne({party:"BJP"},function(err,founduser){
        if(err){
            res.send(err);
        }else{
            if(founduser)
            {   
               bjp_votes=founduser[0].votes;
            }

            else
            {
                 
                bjp_votes=0;
            }
        }
   })

    candidate.findOne({party:"AAP"},function(err,founduser){
        if(err){
            res.send(err);
        }else{
            if(founduser)
            {   
            aap_votes=founduser[0].votes;
            }

            else
            {
                
                aap_votes=0;
            }
        }
    })

    candidate.findOne({party:"CONGRESS"},function(err,founduser){
        if(err){
            res.send(err);
        }else{
            if(founduser)
            {   
            congress_votes=founduser[0].votes;
            }

            else
            {
                
                congress_votes=0;
            }
        }
    })

    candidate.findOne({party:"OTHERS"},function(err,founduser){
        if(err){
            res.send(err);
        }else{
            if(founduser)
            {   
            others_votes=founduser[0].votes;
            }

            else
            {
                
                others_votes=0;
            }
        }
    })
    res.render('results',{winner:'0'});

})*/

app.get('/',(req,res)=>{
    res.render('home')
})

app.listen(8080,()=>{
    console.log("Listening on port 3000")
})