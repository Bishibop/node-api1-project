const express = require('express');
const server = express();

server.use(express.json());

let users = [ 
  {
    id: 1,
    name: "John Doe",
    bio: "super soldier clone of the greatest soldier that ever lived"
  },
  {
    id: 2,
    name: "Jake Doe",
    bio: "super soldier clone brother of John Doe, the greatest supersoldier ever created"
  },
  {
    id: 3,
    name: "Big John",
    bio: "Greatest soldier who ever live. Cloned a bunch."
  },
];

server.post('/api/users', (req, res) => {
  const newUser = req.body;
  if (!newUser.name || !newUser.bio) {
    res.status(400).json({
      errorMessage: "Please provide name and bio for the user."
    });
  }
  try { 
    newUser.id = Math.max(...users.map(user => user.id)) + 1;
    //console.log("new user: ", newUser);
    users.push(newUser);
    res.status(201).json(newUser);
  } catch(err) {
    res.status(500).json({
      errorMessage: "There was an error while saving the user to the database"
    });
  }
});

server.get('/api/users', (req, res) => {
  try { 
    res.status(200).json(users);
  } catch(err) {
    res.status(500).json({
      errorMessage: "The users information could not be retrieved"
    });
  }
});

server.get('/api/users/:id', (req, res) => {
  try {
    const requestedUser = users.find(user => {
      return (user.id === parseInt(req.params.id));
    });

    // Is there a way to move the rest of this out of this code block?
    // The way this is implemented, if I bring this out of the try/catch
    // then I get an error because `requestedUser` is not defined.
    // The reason I would want to do that this is catching errors in the
    // whole handler rather than just in the "DB" request.
    // How could I isolate the try/catch to just the DB interaction...
    if (requestedUser) {
      res.status(200).json(requestedUser);
    } else {
      res.status(404).json({
        errorMessage: "The user with the specified ID does not exist."
      });
    }
  } catch(err) {
    console.log("get user err", err);
    res.status(500).json({
      errorMessage: "The users information could not be retrieved"
    });
  }
});

server.delete('/api/users/:id', (req, res) => {
  console.log('delete id: ', req.params.id);
  try {
    if (users.some(user => user.id === parseInt(req.params.id))) {
      users = users.filter(user => user.id !== parseInt(req.params.id));
      res.status(200).json(users);
    } else {
      res.status(404).json({
        errorMessage: "The user with the specified ID does not exist."
      });
    }
  } catch(err) {
    res.status(500).json({
      errorMessage: "The user could not be removed."
    });
  }
});

server.put('/api/users/:id', (req, res) => {
  //console.log('put request params and body: ', req.params, req.body);
  try {
    const updatedUserInfo = req.body;
    const requestedUser = users.find(user => {
      return (user.id === parseInt(req.params.id));
    });

    if (!requestedUser) {
      res.status(404).json({
        errorMessage: "The user with the specified ID does not exist."
      });
    } else if(!updatedUserInfo.name || !updatedUserInfo.bio) {
      res.status(400).json({
        errorMessage: "Please provide name and bio for the user."
      });
    } else {
      requestedUser.name = updatedUserInfo.name;
      requestedUser.bio = updatedUserInfo.bio;
      res.status(200).json(requestedUser);
    }
  } catch(err) {
    res.status(500).json({
      errorMessage: "The user information could not be modified."
    });
  }

});

server.listen(5000, () => 
  console.log('Server running on http://localhost:5000')
);
