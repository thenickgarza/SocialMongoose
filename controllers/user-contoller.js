const { User } = require('../models')

const UserController = {
    // this creates a new user
    createUser({body}, res){
        User.create(body)
        .then(dbUserData => {
            res.json(dbUserData)
        })
        .catch(err => res.status(400).json(err));
    },
    // this is the endpoint for getting all users
    getAllUser(req, res){
      User.find({})
      .populate({
        path:'thoughts',
        select:'-__v'
      })
      .select('-__v')
      .then(dbUserData => 
        res.json(dbUserData))
        .catch(err => { 
          console.log(err);
          res.status(400).json(err);
        })
    
    },
    // this is the endpoint to get a user by id
    getUserByID({params},res) {
      User.findOne({_id:[params.id]})
      .populate({
        path:'thoughts',
        select:"-__v"
      })
      .select('-__v')
      .then(dbUserData => {
        if(!dbUserData){
          return res.status(400).json({message:'No user found with this id'});
        }
        res.json(dbUserData)
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      })
    },
    // updates a user
    updateUser({body, params}, res) {
      User.findOneAndUpdate({_id:params.id}, body , {new:true, runValidators: true})
      .then(dbUserData => {
        if(!dbUserData){
          return res.status(400).json({message: 'No user found with this id'});
        }
        res.json(dbUserData)
      })
      .catch(err => res.status(400).json(err))
    },
    // deletes a user 
    deleteUser({params}, res){
      User.findByIdAndDelete({_id:[params.id]})
      .then(dbUserData =>{
        if(!dbUserData){
          return res.status(400).json({message: 'No user found with this id'})
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err))
    },
    // adds a friend
    addFriends(req,res){
      User.findOneAndUpdate(
        {_id:req.params.userId},
        {$addToSet:{ friends :req.params.friendId}},
        {new:true}
      )
      .then((dbUserData)=> {
        if(!dbUserData){
          return res.status(404).json({message:'No User with this Id'})
        }
        res.json(dbUserData)
      })
      .catch(err => {
        console.log(err)
        res.json(err)
      })
    }, 
    // deletes the friend 
    removeFriend({params},res){
      User.findByIdAndUpdate(
        {_id: params.userId},
        {$pull: {friends:params.friendId}},
        {new:true},
      )
      .then((dbUserData)=> {
        if(!dbUserData){
          res.status(404).json({message:'No user found'});
        }
        res.json(dbUserData);
      })
      .catch((err)=>{
        console.log(err)
        res.json(err)
      })
    }
  
    
  };
  module.exports = UserController