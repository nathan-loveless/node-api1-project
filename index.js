// implement your API here
const express = require('express');
const db = require('./data/db.js');

const server = express();

server.listen(4000, () => {
    console.log('*** Running on port 4000 ***')
});

// global middleware section
server.use(express.json());

//---------------------------------------------------------
// GET Requests (retrieve) from the server
//---------------------------------------------------------
server.get('/api/users', (req, res) => {
    db.find()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({success:false, errorMessage: 'The user information could not be retrieved'});
        })
});

server.get('/api/users/:id', (req, res) => {
    const {id} = req.params;
    db.findById(id)
        .then(data => {
            if(data)
                res.status(200).json(data)
                
            else {
                res.status(404).json({success: false, message: 'The user with the specified ID does not exist'})
            }
                
        })
        .catch(err =>{
            res.status(500).json({success:false, errorMessage: 'The user information could not be retrieved'});
        })
});

//---------------------------------------------------------
// POST Requests (create) from the server
//---------------------------------------------------------
server.post('/api/users', (req, res) => {
    const dataInfo = req.body;

    let hasName = false;
    let hasBio = false;
        "name" in dataInfo ? hasName = true : hasName = false;
        "bio" in dataInfo ? hasBio = true : hasBio = false;
        

        if(hasName && hasBio) {
        
                db.insert(dataInfo)
                .then(data => {
                        db.findById(data.id)
                            .then(user => {
                                res.status(201).json({success: true, user})
                            })

                            .catch(err => {
                                res.status(500).json({success: false, err})
                            })
                })
                .catch(err => {
                    
                    res.status(500).json({success:false, errorMessage: 'There was an error while saving the user to the database'});
                });
            }

        else
            res.status(400).json({success:false, errorMessage: 'Please provide name and/or bio for the user'});    
});

//---------------------------------------------------------
// PUT Requests (update) from the server
//---------------------------------------------------------
server.put('/api/users/:id', (req, res) => {
    const {id} = req.params;
    const changes = req.body;

    if("name" in changes && "bio" in changes) {
        db.update(id, changes)
        .then(updated => {
            if(updated) {
                db.findById(id)
                            .then(user => {
                                console.log("User Data: ", user);
                                res.status(200).json({success: true, user})
                            })

                            .catch(err => {
                                res.status(500).json({success: false, err})
                            })
            }
            else {
                res.status(404).json({success:false, message: 'The user with the specified ID does not exist'});
            }
        })

        .catch(err =>{
            res.status(500).json({success:false, errorMessage: 'The user information could not be modified'});
        })
    }

    else
        res.status(400).json({success:false, errorMessage: 'Please provide name and/or bio for the user'});   


})

//---------------------------------------------------------
// DELETE Requests (delete) from the server
//---------------------------------------------------------
server.delete('/api/users/:id', (req, res) => {
    const {id} = req.params;

    db.remove(id)
        .then(deleted => {
            if(deleted) {
                res.status(204).end();
            }
            else {
                res.status(404).json({success: false, message:'The user with the specified ID does not exist'});
            }
        })
        .catch(err => {
            res.status(500).json({success:false, errorMessage: 'The user could not be removed'});
        });
});