const fs = require ("fs")
const url=require("url");
const qs=require("querystring");
const exp = require("express");
const http = require('http')
const {join} = require('path')
const pug = require('pug');
var bp = require('body-parser')
var data = require('./posts.json')
var us = require('./users.json')
const json = fs.readFileSync(join(__dirname,"/posts.json"))
const user = fs.readFileSync(join(__dirname,"/users.json"))
fs.writeFile(join(__dirname,"/text.txt"), '', function(){console.log('done')})
let loggedin = false

let parsed = JSON.parse(json)
let users = JSON.parse(user)
const app = exp();

app.set("view engine","pug")

app.set("views","views")

app.use(exp.static(__dirname+'/public'));

app.get("/",(req,res)=>{
    res.render('index', { parsed: parsed,loggedin });
  })
app.get("/post/:id",(req,res)=>{
  let localid = req.params.id;
  console.log(localid)
  parsed.forEach(element => {
    // console.log(req.body.ID)
    // console.log(element.ID)
    // console.log(req.body.password)
    // console.log(element.password)
    if (element !=null && element.id==localid ){
      res.render("content",{id:element.id,Title:element.Title,image:element.image,Post:element.Post})
    }

})});

app.get("/delete/:id",(req,res)=>{
  let localid = req.params.id;
  console.log(localid)
  // console.log(localid)
  // data.forEach(element => {
  //   // console.log(req.body.ID)
  //   // console.log(element.ID)
  //   // console.log(req.body.password)
  //   // console.log(element.password)
  //   if (element.id==localid ){
  //     console.log(element)
  //     delete data[localid]
  //   }
  // })
  delete data[localid]
  console.log(data)
  fs.writeFileSync(join(__dirname,'/posts.json'), JSON.stringify(data), 'utf8',function(){console.log('deleted')});

  res.redirect("../loader");
  
});
app.get("/loader",(req,res)=>{
  res.header("Refresh", "1");
    res.render('index', { parsed: parsed,loggedin });
})



app.get("/add",(req,res)=>{
    res.render("addpost");
  })
app.get("/login",(req,res)=>{
    let loggedin = false
    res.render("login");
  })

  app.use(exp.urlencoded());

  app.use(exp.json());
app.post("/loged",(req,res)=>{
  users.forEach(element => {
    // console.log(req.body.ID)
    // console.log(element.ID)
    // console.log(req.body.password)
    // console.log(element.password)
    if (req.body.ID == element.ID && req.body.password == element.password){
      loggedin=true;
      res.render("index",{username:element.ID,image:element.pic,parsed: parsed,loggedin:loggedin})
    }
    
  });
    res.render("login")
  
})


app.post('/send', function(req, res){
  var last = data.length-1
  if(data.length==0){
    newTask = {
      "id": 0,
      "Title": req.body.name,
      "image" :"../images/"+req.body.image+".png",
      "Post" :req.body.description,
  };
  }
  else{
    newTask = {
      "id": Number(last) + 1,
      "Title": req.body.name,
      "image" :"../images/"+req.body.image+".png",
      "Post" :req.body.description,
  };
  }

  data.push(newTask)
  fs.writeFileSync(join(__dirname,'/posts.json'), JSON.stringify(data), 'utf8',function(){console.log('done')});
  res.render("addpost")
  
});
  app.listen(5000);