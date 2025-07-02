const express = require("express");
const cors = require('cors');
const errorHandler = require("./app/middleware/errorHandler");
const connectDb = require("./app/config/dbConnection");
require("dotenv").config();

connectDb();
const app = express();

const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());


app.use("/api/users", require("./app/gateway/routes/userRoutes"));
app.use("/api/user_detail", require("./feature/user/userDetailRoutes"));
app.use("/api/group_member", require("./feature/group/groupMemberRoutes"));
app.use("/api/number_detail", require("./feature/number/numberDetailsRoutes"));
app.use("/api/result_number_detail", require("./feature/number/resultNumberDetailsRoutes"));
app.use("/api/post_category_detail", require("./feature/post/postCategoryRoutes"));
app.use("/api/post_sub_category_detail", require("./feature/post/postSubCategoryRoutes"));
app.use("/api/permission", require("./feature/permission/permissionRoutes"));
app.use("/api/shortcut", require("./feature/shortcut/shortcutRoutes"));
app.use("/api/report", require("./feature/report/reportRoutes"));
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});