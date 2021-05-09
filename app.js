let { createServer } = require('http');
let { readFile, exists } = require('fs');
let { extname, join } = require('path')
let { parse } = require('url');
let queryString = require('query-string')

let MIME_TYPES = {
    　　'html': 'text/html',
    　　'xml': 'text/xml',
    　　'txt': 'text/plain',
    　　'css': 'text/css',
    　　'js': 'text/javascript',
    　　'json': 'application/json',
    　　'pdf': 'application/pdf',
    　　'swf': 'application/x-shockwave-flash',
    　　'svg': 'image/svg+xml',
    　　'tiff': 'image/tiff',
    　　'png': 'image/png',
    　　'gif': 'image/gif',
    　　'ico': 'image/x-icon',
    　　'jpg': 'image/jpeg',
    　　'jpeg': 'image/jpeg',
    　　'wav': 'audio/x-wav',
    　　'wma': 'audio/x-ms-wma',
    　　'wmv': 'video/x-ms-wmv',
    　　'woff2': 'application/font-woff2'
    };

// 已经注册的用户
let userData = [
    {username: "demo", password: "123"},
    {username: "hello", password: "123"}
]

createServer( async (req, res) => {
    let urlPath = join(process.cwd(), req.url);
    let path = parse(req.url);
    if(path.pathname === '/regist') {
        let file = './data/demo.json';
        res.setHeader('Content-Type', MIME_TYPES.json + ';charset=utf-8')
        readFile(join(process.cwd(), file), (err, data) => {
            res.end(data)
        })
        return;
    }

    let isExists = await new Promise((resolve, reject) => {
        exists(urlPath, isExists => {
            resolve(isExists)
        })
    })
    if(isExists) {
        let data = await new Promise((resolve, reject) => {
            readFile(urlPath, (err, data) => {
                resolve(data)
            })
        })
        if(data) {
            res.setHeader('Content-Type', MIME_TYPES[extname(urlPath).slice(1)] + ';charset=utf-8')
            res.end(data)
        } else {
            res.writeHead(404, {
                'Content-Type': MIME_TYPES.txt + ';charset=utf-8'
            })
            res.end(data + 'not found!')
        }
    } else {
        res.writeHead(404, {
            'Content-Type': MIME_TYPES.txt + ';charset=utf-8'
        })
        res.end(urlPath + '  not found!')
    }

}).listen(3000, () => console.log('服务器运行成功'))