const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const ejs = require('ejs')
const PORT = process.env.PORT || 3005;


// MongoDB database setup
const url = 'mongodb://localhost:27017/newsDB'
mongoose.connect(url, {useNewUrlParser: true, useUnifiedtopology: true})
.then(() => {
    console.log("Database Connected")
}).catch((err) => {
    console.log('Database Connection failed')
})


// Create mongoDB schema
const articleSchema = {
    title: String,
    content: String
}

// Create a mmodel here
const Article = mongoose.model('Article', articleSchema)

//Template setup
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'))


/* /////////////////////////////////// Easy method to create route  ////////////////////////

// setup routes to get the article 
app.get('/articles', (req,res) => {
    Article.find((err,foundArticles) => {
        //console.log(foundArticles)
       if(err){
        res.send(err)
       }
       else{
        res.send(foundArticles)
       }
    })
})

// POST routes setup
app.post('/articles',(req,res) => {
    //console.log(req.body.title)
    //console.log(req.body.content)
    // To save this article
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    })
    newArticle.save((err) => {
        if(!err){
            res.send("Successfully added a new article")
        }
        else{
            res.send(err)
        }
    })
})

// setup the delete routes
app.delete('/articles', (req,res) => {
    Article.deleteMany((err) => {
        if(!err){
            res.send("Successfully deleted all articles")
        }
        else{
            res.send(err)
        }
    })
})


*/


// CHAINED METHOD FOR ROUTES

////////////////////////////////////   Request targetting to get all articles /////////////
app.route('/articles')
   .get((req,res) => {
    Article.find((err,foundArticles) => {
        if(!err){
            res.send(foundArticles)
        }
        else(
            res.send(err)
        )
    })
   })
   .post((req,res) => {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    }).save((err) => {
        if(!err){
            res.send("successfully saved")
        }
        else{
            res.send(err)
        }
    })
   })
   .delete((req,res) => {
    Article.deleteMany((err) => {
        if(!err){
            res.send("successfully deleted")
        }
        else{
            res.send(err)
        }
    })
   })

   ///////////////////////// Request targeting to get the specific route ///////

   app.route('/articles/:articleTitle')

   .get((req,res) => {
    Article.findOne({title: req.params.articleTitle}, (err,foundArticle) => {
        if(foundArticle){
            res.send(foundArticle)
        }
        else{
            res.send("No articles found")
        }
    })
   })

   .put((req,res) => {
    Article.updateOne(
        {title: req.params.articleTitle},
        {
            title: req.body.title,
            content: req.body.content
        },
        {overwrite: true},
        (err) => {
        if(!err){
            res.send("Successfully updated")
        }
    });
 })

 .delete((req,res) => {
    Article.deleteOne({title: req.params.articleTitle},
        (err) => {
            if(!err){
                res.send("Successfully deleted")
            }
        })
 })



// Port setup
app.listen(PORT, () => {
    console.log(`Listening to the ${PORT}`)
})