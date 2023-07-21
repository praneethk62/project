const express=require('express')
const router=express.Router()
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/blog'); 
const Article= require('../model/articleschema')

router.use(express.urlencoded({ extended: false }))
const articles= [
    {
    title:'test Articles',
    category:new Date(),
    description:'asdfghj'
},
];
router.get('/',(req,res)=>{
res.render('articles/index',{articles })
})



router.get('/new',(req,res)=>{
    res.render('articles/new')
})

router.get('/:id',(req,res)=>{

})

  router.post('/',async(req,res)=>{
const article= new Article({
    title:req.body.title,
    markdown:req.body.markdown,
    description:res.body.description
})
try{
 article=   await article.save()
 res.redirect('/articles/${article.id}')
}
 catch (e){
    res.render('article/new',{article:article})
 }
  })


module.exports=router 