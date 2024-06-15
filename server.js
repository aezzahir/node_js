const fsPromises = require('fs').promises;
const fs = require('fs');
const logEvents = require('./logEvents');
const path = require('path');
const EventEmitter = require('events');
const http = require('http');

class Emitter extends EventEmitter {};

const myEmitter = new Emitter();


const PORT = process.env.PORT || 3500;

const serveFile = async (filePath, contentType, response) => {
    try {
        const data = await fsPromises.readFile(filePath, !contentType.includes('image') ? 'utf-8': '');
        response.writeHead(200, {'Content-Type': contentType});
        response.end(data);
    } catch (err)
    {
        console.log(err);
        response.statusCode = 500;
        response.end();
    }
}


const server = http.createServer((req, res) => {
    console.log(req.url, req.method);

    const extention = path.extname(req.url);
    let contentType;


    switch (extention) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        case '.pdf':
            contentType = 'text/pdf';
            break;
        default:
            contentType = 'text/html';
    };

    let filePath = 
    contentType === 'text/html' && req.url === '/'
        ? path.join(__dirname, 'views', 'index.html')
        : contentType === 'text/html' && req.url.slice(-1) === '/'
            ? path.join(__dirname, 'views', req.url, 'index.html')
            : contentType === 'text/html'
                ? path.join(__dirname, 'views', req.url,)
                : path.join(__dirname, req.url);
    // makes .html extention not required in the browser
    if (!extention && req.url.slice(-1) !== '/') filePath += '.html'

    const fileExists = fs.existsSync(filePath);
    if (fileExists) {
        serveFile(filePath, contentType, res);
    } else {
        switch(path.parse(filePath).base){
            case 'old-page.html':
                res.writeHead(301, {'Location': '/new-page.html'});
                res.end();
                break;
            case 'www-page.html':
                res.write(301, {'Location': '/'});
                res.end();
                break;
            default:
               serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res);
        }
    }


});













server.listen(PORT, () => console.log(`server running on Port: ${PORT} ...`))

// // addlistner for the log event 
// myEmitter.on('log', (msg)=> logEvents(msg));
// var i = 0;
// var time = 1000;
// while (i <= 100) {
//     setTimeout(() => {
//         // Emit the log event
//         myEmitter.emit('log', 'Log event emitted!');
//     }, time);
//     i++;
//     console.log(i, time);
//     time = i * 1000;
// }