const container =
    document.getElementById("analysisContainer");

const simulationId =
    sessionStorage.getItem("simulationId");


// -----------------------------------------
// Create indicator card
// -----------------------------------------

function createIndicator(indicator) {

    return `
        <div class="indicator-card">

            <div class="indicator-header">

                <h3>
                    ${indicator.title}
                </h3>

                <span class="risk-badge">
                    ${indicator.severity.toUpperCase()}
                </span>

            </div>

            <p>
                ${indicator.description}
            </p>

        </div>
    `;
}


// -----------------------------------------
// Load analysis
// -----------------------------------------

async function loadAnalysis() {

    if (!simulationId) {

        container.innerHTML = `
            <div class="result-card">

                <h2>
                    No Simulation Found
                </h2>

                <p>
                    Start the educational simulation first.
                </p>

                <a
                    href="index.html"
                    class="primary-button">
                    Start Simulation
                </a>

            </div>
        `;

        return;
    }

    try {

        const response = await fetch(
            `/api/analysis/${simulationId}`
        );

        const data = await response.json();

        if (!data.success) {
            throw new Error("Analysis unavailable.");
        }

        const analysis = data.analysis;

        const indicatorsHTML =
            analysis.indicators
                .map(createIndicator)
                .join("");

        const defensesHTML =
            analysis.defenses
                .map(defense => `
                    <li>${defense}</li>
                `)
                .join("");

        container.innerHTML = `

            <div class="score-card">

                <span class="badge">
                    EDUCATIONAL RISK SCORE
                </span>

                <div class="score">
                    ${analysis.riskScore}
                    <small>/100</small>
                </div>

                <div class="risk-level">
                    ${analysis.riskLevel}
                </div>

                <p>
                    This score is a demonstration-only
                    educational assessment.
                </p>

            </div>


            <h2 class="section-title">
                Key Indicators
            </h2>

            <div class="indicator-grid">

                ${indicatorsHTML}

            </div>


            <h2 class="section-title">
                Defensive Controls
            </h2>

            <div class="defense-card">

                <ul>
                    ${defensesHTML}
                </ul>

            </div>


            <h2 class="section-title">
                Legitimate vs Potentially Phishing
            </h2>

            <div class="table-wrapper">

                <table>

                    <thead>

                        <tr>
                            <th>Indicator</th>
                            <th>Legitimate</th>
                            <th>Potentially Suspicious</th>
                        </tr>

                    </thead>

                    <tbody>

                        <tr>
                            <td>Domain</td>
                            <td>Expected official domain</td>
                            <td>Unrelated or deceptive domain</td>
                        </tr>

                        <tr>
                            <td>Branding</td>
                            <td>Consistent</td>
                            <td>Can be copied</td>
                        </tr>

                        <tr>
                            <td>URL</td>
                            <td>Expected structure</td>
                            <td>Unusual or deceptive</td>
                        </tr>

                        <tr>
                            <td>Login Request</td>
                            <td>Expected context</td>
                            <td>Unexpected request</td>
                        </tr>

                        <tr>
                            <td>Messages</td>
                            <td>Normal</td>
                            <td>Urgent/threatening</td>
                        </tr>

                    </tbody>

                </table>

            </div>


            <div class="defense-card">

                <h2>
                    🛡️ Important Defense Principle
                </h2>

                <p>
                    HTTPS alone does not prove that a website
                    is legitimate. Always verify the actual
                    domain and the context of the login request.
                </p>

            </div>


            <div class="center">

                <a
                    href="quiz.html"
                    class="primary-button">

                    Take Awareness Quiz

                </a>

            </div>
        `;

        await fetch(
            "/api/simulation/event",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    simulationId,
                    eventType: "analysis_viewed"
                })
            }
        );

    } catch (error) {

        container.innerHTML = `
            <div class="result-card">

                <h2>
                    Error
                </h2>

                <p>
                    Could not load the analysis.
                </p>

            </div>
        `;

        console.error(error);
    }
}

loadAnalysis();