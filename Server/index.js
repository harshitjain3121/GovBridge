const express =require("express");
const {connect} =require("mongoose");
require("dotenv").config();
const cors=require("cors");
const upload=require("express-fileupload");
const routes=require("./routes/routes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");



const http = require("http");
const app=express();
const server = http.createServer(app);

// Ensure temp and uploads directories exist
const fs = require("fs");
const path = require("path");
const tmpDir = path.join(__dirname, "tmp");
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(upload({
  useTempFiles: true,
  tempFileDir: "tmp/",
  createParentPath: true,
  limits: { fileSize: 5 * 1024 * 1024 },
  abortOnLimit: true,
}));
app.use(cors({ credentials: true, origin: ["http://localhost:5173", "https://gov-bridge.vercel.app"] }));

app.get('/', (req, res) => {
  res.send('API is running!');
});


app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

connect(process.env.MONGO_URL)
    .then(
        server.listen(process.env.PORT,()=>
            console.log(`Server started on port ${process.env.PORT}`)
        )
    )
    .catch((err)=> console.log(err));