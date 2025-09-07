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
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(upload());
app.use(cors({ credentials: true, origin: ["http://localhost:5173"] }));

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