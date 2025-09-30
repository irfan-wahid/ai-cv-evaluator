import app from "./app.js";        // default export dari app.js
import sequelize from "./config/database.js";  // pastikan file ini juga pakai export default

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected");
    // await sequelize.sync({ alter: true }); // auto sync models
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("Unable to connect to database:", error);
  }
})();