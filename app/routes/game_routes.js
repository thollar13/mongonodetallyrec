module.exports = function (app, db) {

    var ObjectID = require('mongodb').ObjectID;
    var gamesCollection = db.collection('games');

    /// ALL GAMES
    app.get('/games', (req, res) => {
        gamesCollection.find({}).toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    });

    /// GET GAME
    app.get('/GAME/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };

        gamesCollection.findOne(details, (err, item) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(item);
            }
        });
    });

    /// CREATE GAME
    app.post('/games', (req, res) => {

        const game = {
            team_id: req.body.team_id,
            team_name: req.body.team_name,
            team_score: req.body.team_score,
            opponent_name: req.body.opponent_name,
            opponent_score: req.body.opponent_score,
            home_away: req.body.home_away,
            location_field: req.body.location_field,
            location_address: req.body.location_address,
            gametime: req.body.gametime,
            gamedate: req.body.gamedate,
        };

        if (!game.opponent_name || !game.gametime || !game.gamedate) {
            res.send({ 'error': 'Error, all fields are required' });
            return;
        }

        /// Check if game already exists in the database
        gamesCollection.find({
            team_id: game.team_id,
            gamedate: game.gamedate,
            gametime: game.gametime
        }, { $exists: true }).toArray(function (err, doc) {

            if (doc.length) {
                res.send({ 'error': 'Game already exists.' });
            } else {
                /// Game doesn't exist, continue with insert.
                gamesCollection.insert(game, (err, result) => {
                    if (err) {
                        res.send({ 'error': 'An error has occurred. Please try again.' });
                    } else {
                        res.send(result.ops[0]);
                    }
                });
            }

        });

    });

    /// UPDATE GAME
    app.put('/games/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };

        const game = {
            team_id: req.body.team_id,
            team_score: req.body.team_score,
            opponent_name: req.body.opponent_name,
            opponent_score: req.body.opponent_score,
            home_away: req.body.home_away,
            location_field: req.body.location_field,
            location_address: req.body.location_address,
            gametime: req.body.gametime,
            gamedate: req.body.gamedate,
        };

        if (!game.opponent_name || !game.gametime || !game.gamedate) {
            res.send({ 'error': 'Error, all fields are required' });
            return;
        }

        gamesCollection.update(details, game, (err, result) => {
            if (err) {
                gamesCollection
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(game);
            }
        });
    });

    /// DELETE GAME
    app.delete('/game/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };

        gamesCollection.remove(details, (err, item) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send('Game ' + id + ' deleted!');
            }
        });
    });

    /// GET TEAM GAMES
    app.get('/games/team/:id', (req, res) => {
        console.log('bam')
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };

        var query = { team_id: id };
        gamesCollection.find(query).toArray(function (err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(result);
            }
        });

    });

};