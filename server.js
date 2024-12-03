const express = require("express");
const cors = require('cors');
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();

connectDb();
const app = express();

const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());
app.use("/api/users", require("./routes/system/userRoutes"));
app.use("/api/user_detail", require("./routes/userDetailRoutes"));
app.use("/api/group_member", require("./routes/groupMemberRoutes"));
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});