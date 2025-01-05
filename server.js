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
app.use("/api/number_detail", require("./routes/numberDetailsRoutes"));
app.use("/api/result_number_detail", require("./routes/resultNumberDetailsRoutes"));
app.use("/api/post_category_detail", require("./routes/postCategoryRoutes"));
app.use("/api/post_sub_category_detail", require("./routes/postSubCategoryRoutes"));
app.use("/api/permission", require("./routes/permissionRoutes"));
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});