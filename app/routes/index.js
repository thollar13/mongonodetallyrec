// routes/index.js
const userRoutes = require('./user_routes');
const teamRoutes = require('./team_routes');
const gameRoutes = require('./game_routes');

module.exports = function(app, db) {
    userRoutes(app, db);
    teamRoutes(app, db);
    gameRoutes(app, db);
};