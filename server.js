const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const app = express();
const PORT = 3000;

const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "simulations.json");

// Create data directory if it doesn't exist
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Create JSON storage if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]", "utf8");
}

app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, "public")));

// --------------------------------------------------
// Helper: Read anonymous simulation events
// --------------------------------------------------
function readEvents() {
    try {
        const data = fs.readFileSync(DATA_FILE, "utf8");
        return JSON.parse(data);
    } catch {
        return [];
    }
}

// --------------------------------------------------
// Helper: Save anonymous simulation event
// --------------------------------------------------
function saveEvent(event) {
    const events = readEvents();

    events.push(event);

    // Keep only the latest 500 events
    const limitedEvents = events.slice(-500);

    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(limitedEvents, null, 2),
        "utf8"
    );
}

// --------------------------------------------------
// Start simulation
// --------------------------------------------------
app.post("/api/simulation/start", (req, res) => {
    const simulationId =
        "SIM-" +
        crypto.randomBytes(4).toString("hex").toUpperCase();

    const event = {
        simulationId,
        event: "simulation_started",
        timestamp: new Date().toISOString()
    };

    saveEvent(event);

    res.json({
        success: true,
        simulationId
    });
});

// --------------------------------------------------
// Record safe simulation event
// --------------------------------------------------
app.post("/api/simulation/event", (req, res) => {
    const { simulationId, eventType } = req.body;

    if (
        typeof simulationId !== "string" ||
        !/^SIM-[A-F0-9]{8}$/.test(simulationId)
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid simulation ID."
        });
    }

    const allowedEvents = [
        "demo_login_attempt",
        "analysis_viewed",
        "quiz_started",
        "quiz_completed"
    ];

    if (!allowedEvents.includes(eventType)) {
        return res.status(400).json({
            success: false,
            message: "Invalid simulation event."
        });
    }

    saveEvent({
        simulationId,
        event: eventType,
        timestamp: new Date().toISOString()
    });

    res.json({
        success: true,
        message: "Anonymous simulation event recorded."
    });
});

// --------------------------------------------------
// Risk analysis
// --------------------------------------------------
app.get("/api/analysis/:simulationId", (req, res) => {
    const { simulationId } = req.params;

    if (!/^SIM-[A-F0-9]{8}$/.test(simulationId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid simulation ID."
        });
    }

    const analysis = {
        riskScore: 82,
        riskLevel: "HIGH",

        indicators: [
            {
                title: "Visual imitation",
                description:
                    "A familiar brand interface can be visually reproduced by an attacker.",
                severity: "medium"
            },
            {
                title: "Domain verification",
                description:
                    "Users should verify the actual website domain before entering credentials.",
                severity: "high"
            },
            {
                title: "Unexpected login request",
                description:
                    "Unexpected login links received through messages can be suspicious.",
                severity: "high"
            },
            {
                title: "Social engineering",
                description:
                    "Urgency, fear, curiosity, or authority can manipulate users into acting quickly.",
                severity: "high"
            }
        ],

        defenses: [
            "Verify the website domain before logging in.",
            "Navigate directly to trusted services instead of following suspicious links.",
            "Enable Multi-Factor Authentication.",
            "Use a password manager or passkeys where appropriate.",
            "Be cautious of urgent security messages.",
            "Report suspicious messages and websites."
        ]
    };

    res.json({
        success: true,
        simulationId,
        analysis
    });
});

// --------------------------------------------------
// Anonymous statistics
// --------------------------------------------------
app.get("/api/stats", (req, res) => {
    const events = readEvents();

    const simulationsStarted = events.filter(
        e => e.event === "simulation_started"
    ).length;

    const loginAttempts = events.filter(
        e => e.event === "demo_login_attempt"
    ).length;

    const quizzesCompleted = events.filter(
        e => e.event === "quiz_completed"
    ).length;

    res.json({
        success: true,
        statistics: {
            simulationsStarted,
            loginAttempts,
            quizzesCompleted
        }
    });
});

// --------------------------------------------------
// Fallback
// --------------------------------------------------
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// --------------------------------------------------
// Start server
// --------------------------------------------------
app.listen(PORT, () => {
    console.log("");
    console.log("==========================================");
    console.log(" Instagram Phishing Awareness Lab");
    console.log("==========================================");
    console.log(`Running at: http://localhost:${PORT}`);
    console.log("");
});