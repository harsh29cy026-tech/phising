const startButton =
    document.getElementById("startSimulation");

const loginSection =
    document.getElementById("loginSection");

const loginForm =
    document.getElementById("loginForm");

const resultSection =
    document.getElementById("resultSection");

const viewAnalysisButton =
    document.getElementById("viewAnalysis");

let simulationId = null;


// -----------------------------------------
// Start simulation
// -----------------------------------------

startButton.addEventListener("click", async () => {

    try {

        const response = await fetch(
            "/api/simulation/start",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({})
            }
        );

        const data = await response.json();

        if (!data.success) {
            throw new Error("Could not start simulation.");
        }

        simulationId = data.simulationId;

        loginSection.classList.remove("hidden");

        startButton.scrollIntoView({
            behavior: "smooth"
        });

    } catch (error) {

        alert(
            "Unable to start the simulation. " +
            "Make sure the Node.js server is running."
        );

        console.error(error);
    }
});


// -----------------------------------------
// Safe simulated login
// -----------------------------------------

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    if (!simulationId) {
        alert("Please start the simulation first.");
        return;
    }

    /*
        IMPORTANT SECURITY RULE

        We deliberately do NOT access:

        document.getElementById("password").value

        The password field is never read,
        transmitted, logged, or stored.
    */

    try {

        await fetch(
            "/api/simulation/event",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    simulationId: simulationId,
                    eventType: "demo_login_attempt"
                })
            }
        );

        loginSection.classList.add("hidden");

        resultSection.classList.remove("hidden");

        resultSection.scrollIntoView({
            behavior: "smooth"
        });

        loginForm.reset();

    } catch (error) {

        console.error(error);

        alert(
            "The local simulation server could not process the event."
        );
    }
});


// -----------------------------------------
// Open analysis
// -----------------------------------------

viewAnalysisButton.addEventListener(
    "click",
    () => {

        if (!simulationId) {
            return;
        }

        sessionStorage.setItem(
            "simulationId",
            simulationId
        );

        window.location.href = "analysis.html";
    }
);