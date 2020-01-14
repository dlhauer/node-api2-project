const Posts = require('../data/db');
const router = require('express').Router();

router.get('/', (req, res) => {
  Posts.find()
    .then( posts => {
      res.status(200).json(posts)
    })
    .catch( error => {
      console.log(error)
      res.status(500).json({
        message: 'Error retrieving the posts.'
      });
    });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  Posts.findById(id)
    .then( post => {
      if (post.length > 0) {
        res.status(200).json(post);
      } else {
        res.status(400).json({
          message: 'The post with the specified ID doesn\'t exist, ya dingus.'
        });
      }
    })
    .catch( error => {
      console.log(error);
      res.status(404).json({
        message: 'Error retrieving the post.'
      });
    });
});

router.get('/:id/comments', (req, res) => {
  const id = req.params.id;
  Posts.findPostComments(id)
    .then( comments => {
      if (comments.length > 0) {
        res.status(200).json(comments);
      } else {
        res.status(404).json( {
          message: 'The post with the specified ID doesn\'t exist, ya fruitcake.'
        })
      }
    })
    .catch( error => {
      console.log(error);
      res.status(500).json({
        message: 'Error retrieiving post comments.'
      });
    });
});


module.exports = router;