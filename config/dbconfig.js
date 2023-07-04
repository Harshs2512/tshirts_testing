const mongoose = require("mongoose");

// // const connectDatabase = () => {

// //     mongoose.connect("mongodb://localhost:27017/LMS", { useNewUrlParser: true, useUnifiedTopology: true }).then((data) => {
// //         console.log(`Mongodb connected with server: ${data.connection.host}`);
// //     }).catch((err) => {
// //         console.log(err)
// //     })
// // }

// const connectDatabase = () => {
//     mongoose
//         .connect(process.env.DB_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//             directConnection: true,
//         })
//         .then(() => {
//             console.log("database connected");
//         })
//         .catch(err => {
//             console.log("Could not connect", err);
//         });
// }

// module.exports = connectDatabase


// fIGIz1bMvaIjYQCm
// harshsoni1234ji
// mongodb+srv://harshsoni1234ji:<password>@lms.ni6cnap.mongodb.net/?retryWrites=true&w=majority





mongoose.connect(process.env.MONGO_URI);


const connection = mongoose.connection;

connection.on('connected', () => {
    console.log("Mongodb is connected");
});

connection.on('error', (error) => {
    console.log("Mongodb is not connected");
});


module.exports = mongoose;