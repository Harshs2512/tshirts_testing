const mongoose = require('mongoose');

mongoose
.connect('mongodb+srv://harshsoni123:ucM3p2K7NiugYNoW@tshirthub.hha3dev.mongodb.net/?retryWrites=true&w=majority
')
.then(() => {
console.log('db is connected!')
})
.catch((ex) => {
console.log('db connection failed: ', ex)
})
