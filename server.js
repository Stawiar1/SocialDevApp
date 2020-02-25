const express = require('express');

const connectDb = require('./config/db')

//Połączenie z bazą
connectDb();

const app = express();

app.get('/' , (req , res) => res.send('API Running'));

//Define Routes
app.use('/api/users' , require('./routes/API/users'))
app.use('/api/auth' , require('./routes/API/auth'))
app.use('/api/profile' , require('./routes/API/profile'))
app.use('/api/posts' , require('./routes/API/posts'))

const PORT = process.env.PORT || 5000; 

app.listen(PORT , () => console.log(`Server odpalony PORT: ${PORT}`));