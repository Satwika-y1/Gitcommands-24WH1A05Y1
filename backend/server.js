const http = require('http');

const PORT = 3000;
const participants = [];

const server = http.createServer((req, res) => {
    // Set CORS headers so the frontend microservice can talk to this backend microservice
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Handle POST registration endpoint
    if (req.url === '/register' && req.method === 'POST') {
        let body = '';

        // Read incoming data stream
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const { name, email } = JSON.parse(body);

                if (!name || !email) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: "Name and email are required" }));
                }

                // Save to temporary in-memory array
                participants.push({ name, email, date: new Date() });
                console.log(`[Microservice Success] Registered: ${name} (${email})`);

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Registration successful!" }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Invalid JSON data" }));
            }
        });
    } else {
        // Fallback for unknown routes
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
});

server.listen(PORT, () => {
    console.log(`Backend microservice running natively on port ${PORT}`);
});