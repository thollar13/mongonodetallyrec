module.exports = function (app, db) {

    var ObjectID = require('mongodb').ObjectID;
    var usersCollection = db.collection('users');

    /// ALL users
    app.get('/users', (req, res) => {
        usersCollection.find({}).toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    });

    /// GET user
    app.get('/users/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };

        usersCollection.findOne(details, (err, item) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(item);
            }
        });
    });

    /// CREATE USER
    app.post('/users', (req, res) => {
        console.log('hitting')
        //if (req.headers.apikey != 123456) {
        //    res.send({ 'error': 'Error, something went wrong.'})
        //    return;
        //}

        console.log(req.body);

        const user = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        };

        /// Check that all fields are filled out
        if (!user.username || !user.password || !user.email) {
            res.send({ 'error': 'Error, all fields are required - user' });
            return;
        }
        console.log(user.username)
        console.log(user.email)
        /// Check if user already exists in the database
        usersCollection.find({
            username: user.username,
            email: user.email
        }, { $exists: true }).toArray(function (err, doc) {

            if (doc.length) {
                res.send({ 'error': 'user already exists.' });
            } else {

                user.authcode = Math.random().toString(36).substring(2);

                /// user doesn't exist, continue with insert.
                usersCollection.insert(user, (err, result) => {
                    if (err) {
                        res.send({ 'error': 'An error has occurred. Please try again.' });
                    } else {
                        res.send(result.ops[0]);
                    }
                });
            }

        });

    });

    /// UPDATE user
    app.put('/users/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };

        const user = {
            user_name: req.body.user_name,
            season: req.body.season,
            year: req.body.year,
            sport: req.body.sport,
            city: req.body.city,
            state: req.body.state,
            manager_id: req.body.manager_id
        };

        if (!user.user_name || !user.season || !user.year || !user.sport || !user.city || !user.state) {
            res.send({ 'error': 'Error, all fields are required' });
            return;
        }

        usersCollection.find({
            user_name: user.user_name,
            season: user.season,
            year: user.year,
            sport: user.sport,
            city: user.city,
            state: user.state,
        }, { $exists: true }).toArray(function (err, doc) {

            if (doc.length) {
                res.send({ 'error': 'Cannot update. user already exists in the system.' })
            } else {
                usersCollection.update(details, user, (err, result) => {
                    if (err) {
                        res.send({ 'error': 'An error has occurred' });
                    } else {
                        res.send(user);
                    }
                });
            }
        });
    });

    /// DELETE user
    app.delete('/users/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };

        usersCollection.remove(details, (err, item) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send('user ' + id + ' deleted!');
            }
        });
    });

};