const express = require('express')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const all =  require('./data')
const total =  require('./data2')
const candidate =  require('./data3')
const otpv = require('./data4')
const admin = require('./data6')
const otpp = require('./data5')
const dates1 = require('./data7')
const forgot_otp = require('./data8')
const multer = require('multer')
var fs = require('fs');
const app = express();

var nodemailer = require('nodemailer');
var otpGenerator = require('otp-generator')
 
var global_id,global_id_forgot_password;
var global_email,global_email_forgot_password;
var bjp_votes,congress_votes,others_votes,aap_votes;
var check=0;

let date_ob = new Date();

let date = ("0" + date_ob.getDate()).slice(-2);

// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();

var day1,day2,mon1,mon,year1;

app.use(bodyparser({urlencoded:true}))

var publicDir = require('path').join(__dirname,'/public')
app.use(express.static(publicDir))


//mongodb+srv://bhavin:<password>@cluster0-bfvv9.mongodb.net/test?retryWrites=true&w=majority
mongoose.connect("mongodb://localhost/sample");
//mongoose.connect("mongodb+srv://bhavin:bhavinis123@cluster0-bfvv9.mongodb.net/sample");

app.set('views','views')
app.set('view engine','ejs')


var Storage= multer.diskStorage({
    destination:"./public/uploads/",
    filename:(req,file,cb)=>{
      cb(null,file.fieldname+"_"+Date.now()+require('path').extname(file.originalname));
    }
  });
  
  var upload = multer({
    storage:Storage
  }).single('filename')

app.get('/login',(req,res)=>{
    res.render('login')
})

app.get('/signup',(req,res)=>{
    const username = req.body.username;
    console.log(username)
    res.render('signup')
    
})

app.get('/voterforgotpassword',(req,res)=>{
    res.render('voterforgotpassword')
})

app.post('/voterforgotpassword',(req,res)=>{
   const forgot_id = req.body.forgot_id;
   global_id_forgot_password=forgot_id;
   all.findOne({id:forgot_id},function(err,founduser){
    if(err){
        res.send(err);
        }else{
            if(founduser)
            {   
                global_email_forgot_password=founduser.email
                console.log("fogot id");
                console.log(forgot_id);
                res.redirect('forgot_otp');
            }
            else
            {
                console.log("ffotgot123123 user not found")
            }
        }   
    }) 
})

app.get('/forgot_otp',(req,res)=>{
    
    var otp = otpGenerator.generate(6, { upperCase: false, specialChars: false ,alphabets:false});
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
        to: global_email_forgot_password,
        subject: 'FROM GOVERMENT PORTAL OF INDIA',
        text: 'OTP IS '+ otp +' please caste your vote ' + ' dont share with anyone '
      }; 
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

        const otpdata = otpp({
            otp
        });

        otpdata.save(()=>{
        console.log('done')
        res.render('forgot_otp')
    });

    
})



app.post('/forgot_otp',(req,res)=>{

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
                otpp.deleteOne({otp:otppr}, function (err, result) {
                    if (err) {
                        console.log("error query");
                    } else {
                          console.log("otp deleted in forgot otp");
                          res.redirect('/forgot_password')
                    }
                });

               
            }

            else
            {
                console.log("in otp page no one found");
            }
        }
   })
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
        text: 'OTP IS '+ otp +' please caste your vote ' + ' dont share with anyone '
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

app.get('/forgot_password',(req,res)=>{
    res.render('forgot_password')
})



app.post('/forgot_password',(req,res)=>{
    
    const pas1 = req.body.new_password1;
    const pas2 = req.body.new_password2;

    if(pas1==pas2)
    {
        all.findOneAndUpdate({id:global_id_forgot_password},{$set: {password1: pas1}},function(err,founduser){
            if(err){
                console.log(err);
            }
            else{
                res.render('passwordchanged')
            }
        })
    }
    else{
        console.log("password in forgot not match")
    }
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
                otpp.deleteOne({otp:otppr}, function (err, result) {
                    if (err) {
                        console.log("error query");
                    } else {
                          console.log("otp deleted");
                    }
                });

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

    candidate.find({}, function(err, foundCandidate){
        if(err){
          console.log(err);
        }
        else{
          console.log("Successfull");

          dates1.find({},function(err,datesd){
            if(err){
                console.log(err);
            }
            else{
                if(datesd!=[])
                {  
                    console.log("curent date");
                    console.log(date);
                    var day1=datesd[0].day1;
                    var day2=datesd[0].day2;
                    mon1=datesd[0].mon1;
                    mon2=datesd[0].mon2;
                    year1=datesd[0].year1;
                    console.log("start date");
                    console.log(day1);

                    console.log("end date");
                    console.log(day2);

                    console.log("month1");
                    console.log(mon1);

                    console.log("month2");
                    console.log(mon2);

                    console.log("year");
                    console.log(year1);

                    if(day1<=date && month>=mon1 && year1==year || month<=mon2  && year1==year  )
                    {
                        if(month<=mon2)
                            res.render("vote",{candidateList: foundCandidate});  
                    }

                    else
                    {
                       res.render('votingclosed')
                    }
                }
            }
       })
          
          
        }
        
      })
    
})

app.post('/vote',(req,res)=>{
    const vote = req.body.vote;
    var party=vote;
    console.log(vote)
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
                        res.render('thankyou')
                    }
                })
            }
    
    });

})
/*
app.get('/thankyou',(req,res)=>{
    res.render('thankyou')
})*/

app.get('/candidatecreate',(req,res)=>{
    res.render('candidate')    
})

app.post('/candidatecreate',upload,(req,res)=>{
    

    const username = req.body.username;
    const password1 = req.body.password;
    const password2 = req.body.cpassword;
    const party = req.body.party;
    const sign = req.file.filename;
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
                        sign,
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
                res.render('adminlogin')
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
    candidate.findOne({id:id,password1:password1},function(err,founduser){
        if(err){
            res.send(err);
        }
        else{
            if(founduser)
            {   
                console.log("candidate data wait");
                console.log(founduser);
                res.render("showcandidate",{candidateList:founduser});
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
                //console.log(founduser[0].vote);
                console.log(id);

                if(founduser[0].vote==0)
                {
                    global_email=founduser[0].email;
                    res.redirect('/otp')
                }
                  
                else
                {
                    console.log("FO bhbhbh")
                    res.render('alreadyvoted')
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
                    text: 'Thank you for registering '+' please caste your vote '+' thank you '+' your username is '+ username  +' thank you'
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
/*
app.get('/alreadyvoted',(req,res)=>{
    res.render('alreadyvoted')

})
*/
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

            if(founduser)
            {   
                res.render('selectoption')
            }
            
        }
   })
    
})

/*

app.get('/selectoption',(req,res)=>{
    res.render('selectoption')

})
*/


app.post('/selectoption',(req,res)=>{
  
    const option = req.body.options;

    if(option==1)
    {

        total.find({}, function(err, foundCandidate){
            if(err){
              console.log(err);
            }
            else{
              console.log("Successfull");
            }
            res.render("results",{candidateList: foundCandidate});
          })
               /* total.findOne({party:"BJP"},function(err,founduser){    
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
        })  */
    }

    else if(option==2)
    {
        candidate.find({}, function(err, foundCandidate){
            if(err){
              console.log(err);
            }
            else{
              console.log("Successfull");
            }
            res.render("delete",{candidateList: foundCandidate});
          })
    }

    else if(option==3)
    {
        res.render('candidate');
    }

    else if(option==4)
    {
        res.render('date');
    }
})
/*
app.get('/delete',(req,res)=>{
    res.render('delete')
})
*/


app.post('/date',(req,res)=>{

     day1 = req.body.day1;
     mon1 = req.body.month1;
     day2 = req.body.day2;
     month2 = req.body.month2;
     mon2 = req.body.month2;   
    // if(founduser)
     //{   
        dates1.deleteOne({}, function (err, result) {
             if (err) {
                 console.log("error query");
             } else {
                   console.log(result);
             }
         });
    // }

     var year1=2020;
     const newser = dates1({
        day1,
        mon1,
        year1,
        day2,
        mon2,
        year1,      
     });

 newser.save(()=>{
      console.log('done')
      console.log(newser)
  });
    
})

app.post('/delete',(req,res)=>{

    const cid = req.body.cid;
    var party;
    candidate.findOne({id:cid},function(err,founduser){
        if(err){
            res.send(err);
        }else{
            
            if(founduser)
            {   
                console.log(founduser)
                party=founduser["party"];
                candidate.deleteOne({id:cid}, function (err, result) {
                    if (err) {
                        console.log("error query");
                    } else {
                          console.log(result);


                          total.findOne({party:party},function(err,founduser){
                            if(err){
                                res.send(err);
                            }else{
                                
                                if(founduser)
                                {   
                                    total.deleteOne({party:party}, function (err, result) {
                                        if (err) {
                                            console.log("error query");
                                        } else {
                                              console.log(result);
                                        }
                                    });
                                }
                                
                            }
                        })
                    }
                });
            }
            
        }
   })

  
    
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
/*
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8080;
}
app.listen(port);
*/
app.listen(8080,()=>{
    console.log("Listening on port 3000")
})