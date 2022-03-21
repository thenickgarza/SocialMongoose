const { Thought, User } = require('../models');

const thoughtController = {
    // this is the endpoint to add a thought
    addThought ({ params, body}, res) {
        Thought.create(body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                {_id: [params.userId]},
                {$push: {thoughts: _id}},
                {new: true}
            );
        })
        .then(dbUserData => {
            if(!dbUserData) {
                return res.status(404).json({ message: "No user found with this id!"})
            }
            res.json(dbUserData)
        })
        .catch((err) => res.json(err))
    },
    // this is the endpoint to create a reaction 
    createReaction({params, body}, res){
        Thought.findOneAndUpdate(
            {_id:params.thoughtId},
            {$push:{reactions:body}},
            {new: true}
            )
            .then((dbUserData)=> {
                if(!dbUserData){
                    return res.status(404).json({message:'no thought with this ID'});
                }
                res.json(dbUserData)
            })
            .catch((err)=>{
                res.json(err);
            })
    },
    // this is the endpoint to get all the thoughts 
    getAllThought (req, res){
        Thought.find({})
        .populate({
            path:'reactions',
            select:'-__v'
        })
        .select('-__v')
        .sort({id: -1})
        .then(dbUserData => {
            res.json(dbUserData)
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err);
        })
    },
    // this is the endpoint to get a thought by its id
    getThoughtByID ({params}, res){
        Thought.findById({_id:params.id})
        .populate({
            path:'reactions',
            select:'-__v'
        })
        .select('-__v')
        .sort({id: -1})
        .then(dbUserData =>{
            if(!dbUserData){
                return res.status(404).json({message: "No thought found with this id" })
            }
            res.json(dbUserData)
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
    }, 
    // updates a thought
    thoughtUpdate({params, body}, res){
        User.findById({_id:params.userId})
        .then((userData) => {
            if(!userData) {
                return res.status(404).json({message: "you can't delete this thought"})
            }
            return Thought.findOneAndUpdate({_id:params.thoughtId}, body, {new: true, runValidators: true})
            .then((dbUserData) =>{
                if(!dbUserData) {
                    return res.status(404).json({message:" No Thought found with this id"})
                }
                res.json(dbUserData);
            })
            .catch((err)=> {
                console.log(err);
                res.json(err)
            })
        })
    },
    // deletes a thought
    deleteThought({params} , res){
        Thought.findOneAndRemove({_id:params.thoughtId})
        .then((deleteThought) => {
            if(!deleteThought) {
                return res.status(404).json({message:'No thought found with this ID'})
            }
            return User.findOneAndUpdate(
                {_id: params.userId},
                {$pull:{thoughts:params.thoughtId}},
                {new: true}
            )
        })
        .then((dbUserData)=> {
            if(!dbUserData){
                return res.status(404).json({message:"No User found with this id "})
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            res.json(err);
        })
    },
    // deletes a reaction
    deleteReact({params}, res){
        Thought.findByIdAndUpdate(
            {_id: params.thoughtId},
            {$pull: {reactions: {reactionId: params.reactionId}}},
            {new: true}
        )
        .then((dbUserData)=> {
            res.json(dbUserData)
        })
        .catch((err)=> res.json(err));
    }


}

module.exports = thoughtController;