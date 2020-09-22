
const path = require('path');
const express = require('express');
const authRoute = require('./routes/auth');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const profileRoute = require('./routes/profile');
const mainRoute = require('./routes/main');
const logoutRoute = require('./routes/logout');
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');


const app = express();

dotenv.config();

// Connect to DB

mongoose.connect( process.env.DB_CONNECT ,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('connected to DB')
);

//configure template engine Handlebars

app.engine('handlebars', handlebars());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// use cookie parser to get JWT token
app.use(cookieParser());

// get main page
app.use('/', mainRoute);

//warn logged user if he tries to visit login or register

app.use('/login', (req, res, next) => { req.cookies.JWT ? res.send('Your are already loged in') : next()});
app.use('/register', (req, res, next) => { req.cookies.JWT ? res.send('Your are already registered') : next()});

//get static content

app.use(express.static(path.join(__dirname, 'public'), {extensions: ['html', 'js','css', 'JPG']}));

// parse all incoming json files
app.use(express.json());

app.use('/', logoutRoute);
app.use('/', authRoute);
app.use('/', profileRoute);

const PORT = process.env.PORT || 3000;

let server = app.listen(PORT, () => console.log(`Server is started on port: ${PORT}`));

module.exports = server;



// const hostname = '127.0.0.1';
// const port = 3000;

// const server = http.createServer((req, res) =>{
//     let ext = path.extname(req.url.toLocaleLowerCase());
//     if (req.url === '/favicon.ico') {
//         res.writeHead(200, {'Content-Type': 'image/x-icon'} );
//         res.end();
//         return;
//     };
//     let contentType = 'text/html';
//     let filename = req.url === '/' ? 'index.html' : req.url.substr(1);
//     switch (ext) {
//         case '.css':
//             contentType = 'text/css';
//             break;
//         case '.js':
//             contentType = 'text/javascript';
//             break;
//         case '.jpg':
//             contentType = 'image/jpeg';
//             break;
//         default:
//             break;
//     }
//     res.setHeader('Content-Type', `${contentType}; charset=utf-8;`);
//     fs.readFile(path.join(__dirname, 'public', filename), (err, data) => {
//         if (err) {
//             throw err
//         }
//         res.writeHead(200);
//         console.log(data instanceof Buffer);
//         res.write(data);
//         res.end();
//     });
// })

// server.listen(port, hostname, () => {
//     console.log('server is working');
// })