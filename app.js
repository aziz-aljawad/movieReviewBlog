var express =require('express');
var bodyParser =require('body-parser');
var methodOverride =require('method-override');
var mongoose =require('mongoose');
var expressSanitizer = require('express-sanitizer');
var app = express();

//APP CONFIGS
mongoose.connect('mongodb://localhost/movieReview');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(expressSanitizer());
app.use(methodOverride('_method'));
//Movie Review Schema
var movieReviewSchema = new mongoose.Schema(
    {
        reviewTitle:String,
        title:String,
        poster_url:String,
        genre:String,
        plot:String,
        ReleaseDate:String,
        Rating:Number,
        created: {type:Date , default: Date.now},
        runtime:Number,
        Review:String
    });
var Review =mongoose.model("Review",movieReviewSchema);

// Review.create(
//     {
//         reviewTitle:"testing review title ",
//         title:"Avengers: Infinity War",
//         poster_url:"https://ia.media-imdb.com/images/M/MV5BMjMxNjY2MDU1OV5BMl5BanBnXkFtZTgwNzY1MTUwNTM@._V1_UX182_CR0,0,182,268_AL_.jpg",
//         genre:"Action, Adventure, Fantasy",
//         plot:"The Avengers and their allies must be willing to sacrifice all in an attempt to defeat the powerful Thanos before his blitz of devastation and ruin puts an end to the universe.",
//         ReleaseDate:" 27 April 2018",
//         Rating:9.5,
//         runtime:150,
//         Review:"good movie"
//     });
//ROOT ROUTE
app.get('/',function(req,res)
{
    res.redirect('/movies');
});
app.get('/movies',function(req,res)
{
    Review.find(function (err,reviews) 
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render('index',{reviews: reviews});
        }
    })
});
//NEW 
app.get('/movies/new',function(req,res)
{
    res.render('new');
});
//CREATE ROUTE
app.post('/movies',function(req,res)
{
    req.body.review.body=req.sanitize(req.body.review.body)
    Review.create(req.body.review,function(err,newReview)
    {
        if(err)
        {
            res.render('new');
        }
        else
        {
             res.redirect('/movies');
            console.log("===================================");
            console.log("A new review has been added to the database!!");
            console.log("===================================");
            console.log(`${newReview}`);
            console.log("===================================");
        }
    });
});
//SHOW
app.get('/movies/:id',function (req,res)
{
    Review.findById(req.params.id,function(err,foundReview)
    {
        if (err) 
        {
             res.redirect('/movies');
        }
        else
        {
            res.render('show',{review: foundReview});
        }
    });
    
});
//edit
app.get('/movies/:id/edit',function(req,res)
{
    Review.findById(req.params.id,function(err,foundReview)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render('edit',{review: foundReview});
        }
    })
});
//UPDATE ROUTE
app.put('/movies/:id',function(req,res)
{
    req.body.review.body=req.sanitize(req.body.review.body)
    Review.findByIdAndUpdate(req.params.id,req.body.review,function(err,updatedReview)
    {
        if (err) 
        {
             res.redirect('/movies');
        }
        else
        {
            res.redirect('/movies/'+ req.params.id); 
        }
    });
});
//DELETE
app.delete('/movies/:id',function(req,res)
{
    Review.findByIdAndRemove(req.params.id,function(err,review2Delete)
    {
        if (err)
        {
           console.log(err) 
        }
        else
        {
            console.log(`${review2Delete._id} has been deleted`);
            console.log(`-------------------------------------------------------------------`);
            res.redirect('/movies');
        }
    });
});
var port = 3000;
app.listen(port,function()
{
    console.log(`App is working in port ${port}`)
})