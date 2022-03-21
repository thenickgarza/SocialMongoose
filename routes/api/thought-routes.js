const router = require('express').Router();
const {addThought,getAllThought,getThoughtByID, thoughtUpdate,deleteThought,createReaction, deleteReaction} = require('../../controllers/thought-controller');

// route to get all thought
router.route('/').get(getAllThought)

// route to add thought
router.route('/').post(addThought)

// route to get one thought by Id
router.route('/:id').get(getThoughtByID)

// route to update thought 
router.route('/:userId/:thoughtId').put(thoughtUpdate)

// route for delete a thought
router.route('/:userId/:thoughtId').delete(deleteThought)

// route to create reaction
router.route('/react/:userId/:thoughtId').post(createReaction)

// route to delete reaction
router.route('/:userId/:thoughtId/react/:reactionId').delete(deleteReaction)

module.exports = router;