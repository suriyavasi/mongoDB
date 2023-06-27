
const express=require('express');
const app=express();
const bodyparser=require('body-parser');
const exhbs=require('express-handlebars');
const dbo=require('./db');
const ObjectId=dbo.ObjectId;


app.engine('hbs',exhbs.engine({layoutsDir:'views/',defaultLayout:"main",extname:"hbs"}))
app.set('view engine','hbs');
app.set('views','views');
app.use(bodyparser.urlencoded({extended:true}));

app.get('/',async (req,res)=>{
    let database=await dbo.getDatabase();
    const collection=database.collection('movies');
    const cursor=collection.find({});
    let film= await cursor.toArray();

    let message='';
    let edit_id,edit_movies;

    if(req.query.edit_id){
        edit_id=req.query.edit_id;
        edit_movies=await collection.findOne({_id:new ObjectId(edit_id)});
    }

    if(req.query.delete_id){
        await collection.deleteOne({_id:new ObjectId(req.query.delete_id)});
        return res.redirect('/?status=3');

    }

    switch(req.query.status){
        case '1':
            message='Inserted Successfully!';
            break;
        case '2':
                message='Updated Successfully!';
                break;
        case '3':
                message='Deleted Successfully!';
                break;
        default:
            break;
    }

    res.render('main',{message,film,edit_id,edit_movies})

});

app.post('/storemovies',async (req,res)=>{
    let database=await dbo.getDatabase();
    const collection=database.collection('movies');
    let film={movies:req.body.movies,director:req.body.director};
    await collection.insertOne(film);
    return res.redirect('/?status=1');
});

app.post('/update_movies/:edit_id',async (req,res)=>{
    let database=await dbo.getDatabase();
    const collection=database.collection('movies');
    let film={movies:req.body.movies,director:req.body.director};
    let edit_id=req.params.edit_id;

    await collection.updateOne({_id:new ObjectId(edit_id)},{$set:film});
    return res.redirect('/?status=2');
})

app.listen(8000,()=>{
    console.log('Listening to 8000 port');
})