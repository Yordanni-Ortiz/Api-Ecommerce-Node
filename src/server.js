const app = require('./app');
const sequelize = require('./utils/connection');
require('./models');

const PORT = process.env.PORT || 8080;

const main = async () => {
    try {
        console.log("Applying migrations...");
        await sequelize.authenticate();
        console.log("DB connected");
        app.listen(PORT);
        console.log(`Server running on port ${PORT}`);
    } catch (error) {
        console.log(error)
    }
}

main();
