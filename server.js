require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const nodemailer = require('nodemailer');

const PORT = 3000;

function parseBody(req, callback) {
    const chunks = [];
    req.on('data', chunk => {
        chunks.push(chunk);
    });
    req.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const body = buffer.toString('utf-8');
        const contentType = req.headers['content-type'] || '';
        let data = {};
        if (contentType.includes('multipart/form-data')) {
            const boundaryMatch = contentType.match(/boundary=(.+)/);
            if (boundaryMatch) {
                const boundary = '--' + boundaryMatch[1];
                const parts = body.split(boundary);
                for (const part of parts) {
                    const nameMatch = part.match(/name="([^"]+)"/);
                    if (nameMatch) {
                        const name = nameMatch[1];
                        const headerEndIndex = part.indexOf('\r\n\r\n');
                        if (headerEndIndex !== -1) {
                            const value = part.slice(headerEndIndex + 4, part.length - 2).trim();
                            if (value && !value.startsWith('------')) {
                                if (data[name]) {
                                    if (Array.isArray(data[name])) {
                                        data[name].push(value);
                                    } else {
                                        data[name] = [data[name], value];
                                    }
                                } else {
                                    data[name] = value;
                                }
                            }
                        }
                    }
                }
            }
        } else if (contentType.includes('application/x-www-form-urlencoded')) {
            const params = new URLSearchParams(body);
            for (const [key, value] of params.entries()) {
                if (data[key]) {
                    if (Array.isArray(data[key])) {
                        data[key].push(value);
                    } else {
                        data[key] = [data[key], value];
                    }
                } else {
                    data[key] = value;
                }
            }
        } else if (contentType.includes('application/json')) {
            try {
                data = JSON.parse(body);
            } catch (e) {}
        }
        callback(data);
    });
}
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.mjs': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.framercms': 'application/octet-stream'
};

const server = http.createServer((req, res) => {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);

    if (req.method === 'POST' && parsedUrl.pathname === '/api/contact') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', '*');
        
        parseBody(req, (data) => {
            console.log("Received contact form submission:", data);

            const name = data.Name || data.name || '';
            let email = data.Email || data.email || '';
            let actualName = name;
            
            if (Array.isArray(name)) {
                actualName = name[0];
                email = name[1];
            } else if (typeof name === 'string' && name.includes('@')) {
                email = name;
                actualName = '';
            }
            
            const message = data['Leave a message'] || data.message || data.Message || '';
            const phone = data.Phone || data.phone || '';

            if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.CONTACT_RECEIVER_EMAIL) {
                console.warn("SMTP environment variables not configured. Logging form data instead:", {
                    Name: actualName,
                    Email: email,
                    Phone: phone,
                    Message: message
                });
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'ok', warning: 'SMTP not configured' }));
                return;
            }

            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: parseInt(process.env.SMTP_PORT || '587', 10),
                secure: process.env.SMTP_PORT === '465',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            const mailOptions = {
                from: `"${actualName || 'Website Contact'}" <${process.env.SMTP_USER}>`,
                to: process.env.CONTACT_RECEIVER_EMAIL,
                replyTo: email || undefined,
                subject: 'New Contact Form Submission - huaR',
                text: `You have received a new contact form submission:\n\nName: ${actualName}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
                html: `<p>You have received a new contact form submission:</p>
                       <p><strong>Name:</strong> ${actualName}</p>
                       <p><strong>Email:</strong> ${email}</p>
                       <p><strong>Phone:</strong> ${phone}</p>
                       <p><strong>Message:</strong> ${message}</p>`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Error sending SMTP email:", error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Failed to send email: ' + error.message }));
                    return;
                }
                console.log("Email sent successfully:", info.messageId);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'ok' }));
            });
        });
        return;
    }
    let decodedPathname = '';
    try {
        decodedPathname = decodeURIComponent(parsedUrl.pathname);
    } catch (e) {
        decodedPathname = parsedUrl.pathname;
    }

    let filePath = path.join(PUBLIC_DIR, decodedPathname === '/' ? 'index.html' : decodedPathname);

    // If it's a directory, look for index.html inside it (handles folder routing)
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
    }

    if (!fs.existsSync(filePath)) {
        {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Read the file
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500 Internal Server Error');
            return;
        }

        // Handle Framer CMS range slicing (query parameters)
        if (ext === '.framercms' && parsedUrl.query.range) {
            const rangeStr = parsedUrl.query.range; // e.g., "0-168"
            const parts = rangeStr.split('-');
            if (parts.length === 2) {
                const start = parseInt(parts[0], 10);
                const end = parseInt(parts[1], 10);
                if (!isNaN(start) && !isNaN(end)) {
                    const slicedData = data.slice(start, end + 1);
                    res.writeHead(200, {
                        'Content-Type': contentType,
                        'Content-Length': slicedData.length
                    });
                    res.end(slicedData);
                    return;
                }
            }
        }

        // Regular response
        res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Length': data.length
        });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`Custom Framer server running at http://localhost:${PORT}/`);
});
