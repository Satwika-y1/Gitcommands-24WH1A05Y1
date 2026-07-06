const http = require('http');
const PORT = 3000;
const participants = [];

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.url === '/register' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const { name, email } = JSON.parse(body);
            participants.push({ name, email });
            console.log(`[Registered Successfully]: ${name} (${email})`);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Registration successful!" }));
        });
    }
});

server.listen(PORT, () => {
    console.log(`Registration server running on port ${PORT}`);
});