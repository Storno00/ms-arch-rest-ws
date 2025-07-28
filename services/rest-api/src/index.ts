import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`🚀 REST API server running on port ${PORT}`);
});
