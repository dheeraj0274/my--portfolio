

import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__filename, __dirname);

const PORT = 8000;
const publicDir = path.join(process.cwd(),  'public');
const imageDir = path.join(process.cwd() , 'public' , 'images');

const server = http.createServer(async (req, res) => {
    try {
        const undermaintain = process.env.UNDER_MAINTAIN = false;
        let filepath;

        if (undermaintain) {
            filepath = path.join(publicDir , 'maintain.html');
            res.setHeader('Content-Type', 'text/html');
        
        } else if (req.url === '/') {
            filepath = path.join(publicDir, 'index.html');
            res.setHeader('Content-Type', 'text/html');
        } else if (req.url === '/style.css') {
            filepath = path.join(publicDir, 'style.css');
            res.setHeader('Content-Type', 'text/css');
        }


        else if( req.url.endsWith('.jpeg')){
            filepath = path.join(imageDir , req.url);
            res.setHeader('Content-Type' , 'image/jpeg')
        }
        else if(req.url.endsWith('.png')){
            filepath = path.join(imageDir , req.url);
            res.setHeader('Content-Type' , 'image/png')
        }
        else if (req.url === '/port.js') {
            filepath = path.join(publicDir, 'port.js');
            res.setHeader('Content-Type', 'text/javascript'); 
        }
            else {
            // res.writeHead(404, { 'Content-Type': 'text/html' });
            // res.end('<h1>Not Found</h1>')
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            res.end('<h1>Not Found</h1>');
            return;
        }

        const data = await fs.readFile(filepath);
        res.write(data);
        res.end();
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('Server Error');
    }
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
