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
      res.status(500).json({
        message: 'Error retrieving the post.'
      });
    });
});

router.get('/:id/comments', (req, res) => {
  const id = req.params.id;
  Posts.findById(id)
    .then( post => {
      if (post.length > 0) {
        Posts.findPostComments(id)
        .then( comments => {
          if (comments.length > 0) {
            res.status(200).json(comments);
          } else {
            res.status(404).json( {
              message: 'That post doesn\'t have any comments' 
            });
          }
        })
        .catch( error => {
          console.log(error);
          res.status(500).json({
            message: 'Error retrieiving post comments.'
          });
        });
      } else {
        res.status(400).json({
          message: 'The post with the specified ID doesn\'t exist'
        });
      }
    })
});

router.post('/', (req, res) => {
  if( !req.body.title || !req.body.contents) {
    res.status(400).json({
      message: 'Whoa whoa whoa, you didn\'t think you could submit something without a title or contents, did you? Try again, hotshot.'
    })
  } else {
    const postData = req.body;
    Posts.insert(postData)
      .then( id => {
        res.status(201).json(id);
      })
      .catch( error => {
        console.log(error);
        res.status(500).json({
          message: 'There was an error saving the post to the database.'
        });
      });
  }
});

router.post('/:id/comments', (req, res) => {
  const id = req.params.id;
  if (!req.body.text) {
    res.status(400).json({
      message: 'Gotta have some text in that comment, bro.'
    })
  } else {
    Posts.findById(id)
      .then( post => {
        if(post.length > 0) {
          const comment = {
            text: req.body.text,
            post_id: req.params.id
          };
          Posts.insertComment(comment)
            .then( id => {
              res.status(201).json(id);
            })
            .catch( error => {
              res.status(500).json({
                message: 'Error saving comment to database.'
              });
            });
        } else {
          res.status(404).json({
            message: 'The post with the specified ID doesn\'t exist.'
          });
        }
    })
  }
});

router.put('/:id', (req, res) => {
  const id = req.params.id;
  Posts.findById(id)
    .then(post => {
      if (post.length > 0) {
        if (!req.body.title || !req.body.contents) {
          res.status(400).json({
            errorMessage: 'Hey, don\'t try to cheat the system by leaving out the title and contents.'
          });
        } else { 
          Posts.update(id, req.body)
            .then( () => {
              Posts.findById(id)
                .then( updatedPost => {
                  res.status(200).json(updatedPost);
                })
            })
            .catch( error => {
              console.log(error);
              res.status(500).json({
                error: 'I made a boo-boo while updating the post. Sorry.'
              });
            });
        }
      } else {
        res.status(404).json({
          message: 'The post with the specified ID doesn\'t exist.'
        });
      }
    });
});
  
router.delete('/:id', (req, res) => {
  const id = req.params.id;

  Posts.findById(id)
    .then( post => {
      if (post.length > 0) {
        Posts.remove(id)
          .then( () => {
            res.status(200).json(post);
          })
          .catch( error => {
            console.log(error)
            res.status(500).json({
              error: 'The post could not be removed.'
            });
          });
      } else {
        res.status(404).json({
          message: 'The post with the specified ID does not exist.'
        });
      }
    })
})

module.exports = router;