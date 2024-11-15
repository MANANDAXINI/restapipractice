const fs = require("fs");
const path = require("path");

// Middleware function to log request and response details
function logreqres() {
    return (req, res, next) => {
        const logFilePath = path.join(__dirname, "log.txt");
        const logEntry = `\n${Date.now()}: ${req.method}:${req.path}`;

        // Append log entry to the file
        fs.appendFile(logFilePath, logEntry, (err) => {
            if (err) {
                console.error("Failed to write to log file:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }
            next(); // Continue to the next middleware or route handler
        });
    };
}

module.exports = logreqres;
