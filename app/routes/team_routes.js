module.exports = function(app, db) {

    var ObjectID = require('mongodb').ObjectID;
    var teamsCollection = db.collection('teams');

    /// ALL TEAMS
    app.get('/teams', (req, res) => {
        teamsCollection.find({}).toArray(function(err, result) {
            if (err) throw err;
            res.send(result);
        });
    });

    /// GET TEAM
    app.get('/teams/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };

        teamsCollection.findOne(details, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send(item);
            } 
        });
    });

    /// CREATE TEAM
    app.post('/teams', (req, res) => {

        const team = { 
          team_name: req.body.team_name, 
          season: req.body.season,
          year: req.body.year,
          sport: req.body.sport,
          city: req.body.city,
          state: req.body.state,
          manager_id: req.body.manager_id
        };
      
        /// Check that all fields are filled out
        if(!team.team_name || !team.season || !team.year || !team.sport || !team.city || !team.state) {
            res.send({ 'error': 'Error, all fields are required'});
            return;
        }

        /// Check if team already exists in the database
        teamsCollection.find({
            team_name: team.team_name,
            season: team.season,
            year: team.year,
            sport: team.sport,
            city: team.city,
            state: team.state,
        }, {$exists: true}).toArray(function(err, doc) {

            if (doc.length) {
                res.send({ 'error': 'Team already exists.' });
            } else {
                /// Team doesn't exist, continue with insert.
                teamsCollection.insert(team, (err, result) => {
                    if (err) { 
                        res.send({ 'error': 'An error has occurred. Please try again.' }); 
                    } else {
                        res.send(result.ops[0]);
                    }
                });
            }

        });

    });

    /// UPDATE TEAM
    app.put('/teams/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        
        const team = { 
            team_name: req.body.team_name, 
            season: req.body.season,
            year: req.body.year,
            sport: req.body.sport,
            city: req.body.city,
            state: req.body.state,
            manager_id: req.body.manager_id
        };

        if(!team.team_name || !team.season || !team.year || !team.sport || !team.city || !team.state) {
            res.send({ 'error': 'Error, all fields are required'});
            return;
        }
        
        teamsCollection.find({
            team_name: team.team_name,
            season: team.season,
            year: team.year,
            sport: team.sport,
            city: team.city,
            state: team.state,
        }, {$exists: true}).toArray(function(err, doc) {

            if(doc.length) {
                res.send({'error':'Cannot update. Team already exists in the system.'})
            } else {
                teamsCollection.update(details, team, (err, result) => {
                    if (err) {
                        res.send({'error':'An error has occurred'});
                    } else {
                        res.send(team);
                    } 
                });
            }
        });
    });

    /// DELETE TEAM
    app.delete('/teams/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };

        teamsCollection.remove(details, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send('Team ' + id + ' deleted!');
            } 
        });
    });

};