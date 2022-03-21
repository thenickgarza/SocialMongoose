const router = require('express').Router();
const{ createUser, getAllUser, getUserByID, updateUser, deleteUser, addFriends, removeFriend } = require('../../controllers/user-contoller');

router.route('/')

.post(createUser)

.get(getAllUser);

// route to GET one, PUT and DELETE for /api/user/:id
router.route('/:id')

.get(getUserByID)

.put(updateUser)

.delete(deleteUser)

// route to follow a friend 
router.route('/:userId/friends/:friendId').post(addFriends).delete(removeFriend)


module.exports = router