

var express = require('express');
var hostname = 'localhost'; 
var port = 3000; 
var mongoose = require('mongoose'); 

mongoose.connect('mongodb://localhost:27017/commentsDB',{useNewUrlParser: true}, (err) => {
    if(!err) {console.log('MongoDB connection OK')}
    else {console.log('Error connection : ' + err)}
});

var app = express(); 
var bodyParser = require("body-parser"); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var commentSchema = new mongoose.Schema({
    message: String,
}, {
    timestamps: true
});

var Comment = mongoose.model('Comment', commentSchema); 
var myRouter = express.Router(); 
myRouter.route('/')
.all(function(req,res){ 
      res.json({message : "Bienvenue sur notre API ", methode : req.method});
});

//Route pour afficher les commentaires

myRouter.route('/comments')
.get(function(req,res){ 
	Comment.find(function(err, comments){
        if (err){
            res.send(err); 
        }
        res.json(comments);  
    }); 
});

//Route pour l'ajout commentaire

myRouter.route('/comment')
.post(function(req,res){
      var comment = new Comment(req.body);
      comment.message = req.body.message;
      //comment.timestamps = req.body.timestamps
      comment.save(function(err){
        if(err){
          res.send(err);
        }
        res.json({message : 'Bravo, le commentaire est maintenant stockée en base de données'});
      }); 
}); 

//Route mise à jour et suppression

myRouter.route('/comment/:id')
.get(function(req,res){ 
            Comment.findById(req.params.comment_id, function(err, comment) {
            if (err)
                res.send(err);
            res.json(comment);
        });
})
.put(function(req,res){ 
                Comment.findById(req.params.comment_id, function(err, comment) {
                if (err){
                    res.send(err);
                }
                        comment.message = req.body.message;
                              comment.save(function(err){
                                if(err){
                                  res.send(err);
                                }
                                res.json({message : 'mise à jour des données OK'});
                              });                
                });
})
.delete(function(req,res){ 

    Comment.remove({_id: req.params.comment_id}, function(err, comment){
        if (err){
            res.send(err); 
        }
        res.json({message:"supprimée"}); 
    }); 
    
});
app.use(myRouter);   
app.listen(port, hostname, function(){
	console.log("Mon serveur fonctionne sur http://"+ hostname +":"+port); 
});

