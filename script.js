/* =====================================
   WASTE DATABASE
===================================== */

const wasteData = {

    plastic: {
        category: "Recyclable Plastic",
        icon: "🧴",
        confidence: "96%",
        dispose:
            "Place clean and dry plastic in the appropriate recyclable waste collection stream.",
        reuse:
            "Reuse the container when safe, or send it for plastic recycling.",
        tip:
            "Reduce single-use plastics and choose reusable alternatives."
    },

    bottle: {
        category: "Recyclable Plastic",
        icon: "🧴",
        confidence: "96%",
        dispose:
            "Empty and clean the bottle before placing it in the appropriate recycling stream.",
        reuse:
            "Consider reusing the bottle when appropriate or recycle it.",
        tip:
            "Carry a reusable bottle to reduce single-use plastic consumption."
    },

    newspaper: {
        category: "Paper / Recyclable",
        icon: "📄",
        confidence: "98%",
        dispose:
            "Keep paper dry and place it with recyclable paper waste.",
        reuse:
            "Reuse paper for crafts, packing or other purposes before recycling.",
        tip:
            "Use both sides of paper before sending it for recycling."
    },

    paper: {
        category: "Paper / Recyclable",
        icon: "📄",
        confidence: "97%",
        dispose:
            "Keep clean paper separate from food and wet waste.",
        reuse:
            "Reuse it for notes, crafts or packaging before recycling.",
        tip:
            "Reducing unnecessary printing can help save resources."
    },

    food: {
        category: "Organic Waste",
        icon: "🍎",
        confidence: "97%",
        dispose:
            "Place food waste in the designated organic or wet-waste collection stream.",
        reuse:
            "Suitable organic waste can be composted to produce useful soil material.",
        tip:
            "Plan meals carefully to reduce avoidable food waste."
    },

    vegetable: {
        category: "Organic Waste",
        icon: "🥕",
        confidence: "96%",
        dispose:
            "Place vegetable scraps in the appropriate wet-waste or composting stream.",
        reuse:
            "Compost suitable vegetable scraps instead of sending them to landfill.",
        tip:
            "Composting turns organic waste into a useful resource."
    },

    phone: {
        category: "Electronic Waste",
        icon: "📱",
        confidence: "99%",
        dispose:
            "Take electronic devices to an authorized e-waste collection or recycling facility.",
        reuse:
            "If the device still works, consider repair, reuse or donation.",
        tip:
            "Never mix electronic waste with ordinary household waste."
    },

    mobile: {
        category: "Electronic Waste",
        icon: "📱",
        confidence: "99%",
        dispose:
            "Take the mobile phone to an authorized e-waste collection facility.",
        reuse:
            "Repair, donate or reuse the device if it is still functional.",
        tip:
            "Electronic devices contain materials that require responsible handling."
    },

    battery: {
        category: "Hazardous / E-Waste",
        icon: "🔋",
        confidence: "99%",
        dispose:
            "Do not place batteries in ordinary household waste. Use an appropriate battery collection point.",
        reuse:
            "Use designated recycling programs for batteries and electronic components.",
        tip:
            "Damaged batteries can present safety and environmental risks."
    },

    glass: {
        category: "Recyclable Glass",
        icon: "🍾",
        confidence: "96%",
        dispose:
            "Separate clean glass from general waste and follow your local glass collection system.",
        reuse:
            "Glass containers can sometimes be reused or sent for recycling.",
        tip:
            "Handle broken glass carefully and keep it separated from other waste."
    },

    cardboard: {
        category: "Paper / Cardboard",
        icon: "📦",
        confidence: "97%",
        dispose:
            "Flatten clean cardboard and place it with recyclable paper waste.",
        reuse:
            "Reuse boxes for storage, packing or other purposes before recycling.",
        tip:
            "Reusing packaging can reduce the need for new materials."
    },

    metal: {
        category: "Recyclable Metal",
        icon: "🥫",
        confidence: "95%",
        dispose:
            "Keep recyclable metal separate and use the appropriate recycling collection system.",
        reuse:
            "Metal containers can sometimes be reused or recycled into new products.",
        tip:
            "Recycling metals can reduce the need for extracting new raw materials."
    }

};


/* =====================================
   ANALYZE WASTE
   CONNECTS WEBSITE TO FLASK BACKEND
===================================== */

function analyzeWaste() {

    const input = document
        .getElementById("wasteInput")
        .value
        .trim()
        .toLowerCase();

    if (input === "") {

        showMessage(
            "Please enter a waste item first.",
            "Try something like plastic bottle or old mobile phone."
        );

        return;
    }


    showScanning();


    setTimeout(async () => {

        try {

            const response = await fetch(
                "http://127.0.0.1:5000/analyze",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        waste: input
                    })
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Backend request failed"
                );

            }


            const result =
                await response.json();


            /*
                The Flask backend returns:
                category
                dispose
                reuse
                tip

                The frontend adds the icon.
            */

            result.icon =
                getCategoryIcon(
                    result.category
                );


            /*
                This is a backend analysis result,
                not a numerical confidence score.
            */

            result.confidence =
                "Backend Analysis";


            displayResult(
                result,
                input
            );

        }

        catch (error) {

            console.error(
                "Backend error:",
                error
            );


            /*
                If Flask is not available,
                fall back to the local database.
            */

            const localResult =
                findWaste(input);


            localResult.confidence =
                "Local Guidance";


            displayResult(
                localResult,
                input
            );


            alert(
                "The EcoVision AI backend could not be reached.\n\n" +
                "Showing local waste guidance instead.\n\n" +
                "Make sure Flask is running on:\n" +
                "http://127.0.0.1:5000"
            );

        }

    }, 1200);

}


/* =====================================
   GET CATEGORY ICON
===================================== */

function getCategoryIcon(category) {

    const text =
        category
            .toLowerCase();


    if (
        text.includes("electronic") ||
        text.includes("e-waste")
    ) {

        return "📱";

    }


    if (
        text.includes("plastic")
    ) {

        return "🧴";

    }


    if (
        text.includes("paper") ||
        text.includes("cardboard")
    ) {

        return "📄";

    }


    if (
        text.includes("organic") ||
        text.includes("food")
    ) {

        return "🍎";

    }


    if (
        text.includes("glass")
    ) {

        return "🍾";

    }


    if (
        text.includes("metal")
    ) {

        return "🥫";

    }


    if (
        text.includes("hazardous")
    ) {

        return "⚠️";

    }


    return "🔎";

}


/* =====================================
   FIND WASTE
   LOCAL FALLBACK
===================================== */

function findWaste(input) {

    for (
        const keyword in wasteData
    ) {

        if (
            input.includes(keyword)
        ) {

            return wasteData[keyword];

        }

    }


    return {

        category:
            "Waste Item Not Clearly Identified",

        icon:
            "🔎",

        confidence:
            "Needs Review",

        dispose:
            "Check your local waste-management guidance before disposing of this item.",

        reuse:
            "Consider whether the item can be repaired, reused or sent to an appropriate recycling facility.",

        tip:
            "When unsure, avoid mixing potentially recyclable or hazardous waste with general waste."

    };

}


/* =====================================
   SHOW SCANNING
===================================== */

function showScanning() {

    const scannerArea =
        document.getElementById(
            "scannerArea"
        );

    const title =
        document.getElementById(
            "scannerTitle"
        );

    const text =
        document.getElementById(
            "scannerText"
        );


    title.innerHTML =
        "AI is analyzing your waste...";


    text.innerHTML =
        "Identifying category and sustainable action";


    scannerArea.classList.add(
        "analyzing"
    );

}


/* =====================================
   DISPLAY RESULT
===================================== */

function displayResult(
    result,
    originalInput
) {

    document
        .getElementById(
            "scannerArea"
        )
        .classList.remove(
            "analyzing"
        );


    document
        .getElementById(
            "scannerTitle"
        )
        .innerHTML =
        "Analysis ready";


    document
        .getElementById(
            "scannerText"
        )
        .innerHTML =
        "Your waste guidance is below";


    document
        .getElementById(
            "resultSection"
        )
        .style.display =
        "block";


    document
        .getElementById(
            "categoryIcon"
        )
        .innerHTML =
        result.icon;


    document
        .getElementById(
            "category"
        )
        .innerHTML =
        result.category;


    document
        .getElementById(
            "confidence"
        )
        .innerHTML =
        result.confidence ===
        "Needs Review"

            ? "⚠️ Needs Review"

            : result.confidence;


    document
        .getElementById(
            "disposeText"
        )
        .innerHTML =
        result.dispose;


    document
        .getElementById(
            "reuseText"
        )
        .innerHTML =
        result.reuse;


    document
        .getElementById(
            "tipText"
        )
        .innerHTML =
        result.tip;


    document
        .getElementById(
            "resultTitle"
        )
        .innerHTML =
        "♻️ " +
        capitalize(
            originalInput
        );


    document
        .getElementById(
            "resultSection"
        )
        .scrollIntoView({
            behavior: "smooth"
        });


    updateImpact();

}


/* =====================================
   EXAMPLES
===================================== */

function useExample(
    example
) {

    document
        .getElementById(
            "wasteInput"
        )
        .value =
        example;


    document
        .getElementById(
            "wasteInput"
        )
        .focus();

}


/* =====================================
   CLEAR RESULT
===================================== */

function clearResult() {

    document
        .getElementById(
            "resultSection"
        )
        .style.display =
        "none";


    document
        .getElementById(
            "wasteInput"
        )
        .value =
        "";


    document
        .getElementById(
            "scannerTitle"
        )
        .innerHTML =
        "What do you want to analyze?";


    document
        .getElementById(
            "scannerText"
        )
        .innerHTML =
        "Scan, upload, speak or type your waste item";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =====================================
   VOICE INPUT
===================================== */

function startVoiceInput() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

        alert(
            "Voice input is not supported in this browser. Please use Chrome or type the waste item."
        );

        return;

    }


    const recognition =
        new SpeechRecognition();


    recognition.lang =
        "en-IN";


    recognition.interimResults =
        false;


    recognition.continuous =
        false;


    recognition.onstart =
        function () {

            document
                .getElementById(
                    "scannerTitle"
                )
                .innerHTML =
                "🎤 Listening...";


            document
                .getElementById(
                    "scannerText"
                )
                .innerHTML =
                "Tell me the name of the waste item";

        };


    recognition.onresult =
        function (event) {

            const spokenText =
                event
                    .results[0][0]
                    .transcript;


            document
                .getElementById(
                    "wasteInput"
                )
                .value =
                spokenText;


            document
                .getElementById(
                    "scannerTitle"
                )
                .innerHTML =
                "Voice captured";


            document
                .getElementById(
                    "scannerText"
                )
                .innerHTML =
                "Press Analyze with AI to continue";

        };


    recognition.onerror =
        function () {

            alert(
                "Voice input could not be completed. Please try again."
            );

        };


    recognition.start();

}


/* =====================================
   CAMERA
===================================== */

let cameraStream =
    null;


async function openCamera() {

    const cameraArea =
        document.getElementById(
            "cameraArea"
        );


    try {

        cameraStream =
            await navigator
                .mediaDevices
                .getUserMedia({

                    video: {
                        facingMode: {
                            ideal: "environment"
                        }
                    },

                    audio: false

                });


        document
            .getElementById(
                "camera"
            )
            .srcObject =
            cameraStream;


        cameraArea.style.display =
            "flex";

    }

    catch (error) {

        alert(
            "Camera access was not available. Please allow camera permission and try again."
        );


        console.error(error);

    }

}


/* =====================================
   CAPTURE IMAGE
===================================== */

function captureWasteImage() {

    const video =
        document.getElementById(
            "camera"
        );


    const canvas =
        document.getElementById(
            "cameraCanvas"
        );


    if (!video.videoWidth) {

        alert(
            "Camera is not ready yet. Please wait a moment and try again."
        );

        return;

    }


    canvas.width =
        video.videoWidth;


    canvas.height =
        video.videoHeight;


    const context =
        canvas.getContext(
            "2d"
        );


    context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );


    const imageData =
        canvas.toDataURL(
            "image/jpeg"
        );


    console.log(
        "Captured image:",
        imageData
    );


    /*
        CURRENT STATUS:

        The photo has been successfully
        captured and converted to Base64.

        The actual AI vision model is NOT
        connected yet.

        We will connect the image to the
        backend/vision model in the next stage.
    */


    closeCamera();


    document
        .getElementById(
            "scannerTitle"
        )
        .innerHTML =
        "📸 Image captured";


    document
        .getElementById(
            "scannerText"
        )
        .innerHTML =
        "Ready for AI waste identification";


    document
        .getElementById(
            "wasteInput"
        )
        .value =
        "Captured waste image";


    alert(
        "Image captured successfully!\n\n" +
        "The image is ready to be connected to the AI vision model."
    );

}


/* =====================================
   CLOSE CAMERA
===================================== */

function closeCamera() {

    const cameraArea =
        document.getElementById(
            "cameraArea"
        );


    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(
                track =>
                    track.stop()
            );


        cameraStream =
            null;

    }


    document
        .getElementById(
            "camera"
        )
        .srcObject =
        null;


    cameraArea.style.display =
        "none";

}


/* =====================================
   IMPACT COUNTER
===================================== */

function updateImpact() {

    let analyzed =
        Number(
            localStorage.getItem(
                "ecoAnalyzed"
            )
        ) || 128;


    let actions =
        Number(
            localStorage.getItem(
                "ecoActions"
            )
        ) || 94;


    analyzed++;

    actions++;


    localStorage.setItem(
        "ecoAnalyzed",
        analyzed
    );


    localStorage.setItem(
        "ecoActions",
        actions
    );


    document
        .getElementById(
            "analyzedCount"
        )
        .innerHTML =
        analyzed;


    document
        .getElementById(
            "actionCount"
        )
        .innerHTML =
        actions;

}


/* =====================================
   INITIAL IMPACT NUMBERS
===================================== */

function loadImpactNumbers() {

    const analyzed =
        localStorage.getItem(
            "ecoAnalyzed"
        ) || 128;


    const actions =
        localStorage.getItem(
            "ecoActions"
        ) || 94;


    document
        .getElementById(
            "analyzedCount"
        )
        .innerHTML =
        analyzed;


    document
        .getElementById(
            "actionCount"
        )
        .innerHTML =
        actions;

}


/* =====================================
   CAPITALIZE
===================================== */

function capitalize(text) {

    return text.replace(
        /\b\w/g,
        letter =>
            letter.toUpperCase()
    );

}


/* =====================================
   MESSAGE
===================================== */

function showMessage(
    title,
    message
) {

    alert(
        title +
        "\n\n" +
        message
    );

}


/* =====================================
   START
===================================== */

loadImpactNumbers();
/* =====================================================
   ECOVISION AI - ADVANCED FEATURES
===================================================== */

const ECO_BACKEND = "http://127.0.0.1:5000";


/* =====================================================
   HISTORY
===================================================== */

async function loadHistory() {

    try {

        const response = await fetch(
            `${ECO_BACKEND}/history`
        );

        const history = await response.json();

        console.log("EcoVision History:", history);

        localStorage.setItem(
            "ecoHistory",
            JSON.stringify(history)
        );

        return history;

    } catch (error) {

        console.error(
            "History error:",
            error
        );

        return [];
    }
}


/* =====================================================
   SHOW HISTORY
===================================================== */

async function showHistory() {

    const history =
        await loadHistory();

    if (!history.length) {

        alert(
            "No waste analysis history yet."
        );

        return;
    }

    let message =
        "♻️ ECOVISION AI HISTORY\n\n";

    history.forEach(
        (item, index) => {

            message +=
                `${index + 1}. ${item.waste}\n`;

            message +=
                `Category: ${item.category}\n`;

            message +=
                `Date: ${new Date(
                    item.created_at
                ).toLocaleString()}\n\n`;
        }
    );

    alert(message);
}


/* =====================================================
   CLEAR HISTORY
===================================================== */

async function clearHistory() {

    const confirmDelete =
        confirm(
            "Clear all waste analysis history?"
        );

    if (!confirmDelete) {
        return;
    }

    try {

        await fetch(
            `${ECO_BACKEND}/history`,
            {
                method: "DELETE"
            }
        );

        alert(
            "History cleared successfully."
        );

    } catch (error) {

        console.error(error);

        alert(
            "Could not clear history."
        );
    }
}


/* =====================================================
   ANALYTICS
===================================================== */

async function loadAnalytics() {

    try {

        const response =
            await fetch(
                `${ECO_BACKEND}/analytics`
            );

        const data =
            await response.json();

        console.log(
            "AI Waste Analytics:",
            data
        );

        return data;

    } catch (error) {

        console.error(
            "Analytics error:",
            error
        );

        return null;
    }
}


/* =====================================================
   WASTE PREDICTION
===================================================== */

async function getWastePrediction() {

    try {

        const response =
            await fetch(
                `${ECO_BACKEND}/prediction`
            );

        const data =
            await response.json();

        alert(
            "🔮 WASTE PREDICTION\n\n" +
            data.prediction
        );

    } catch (error) {

        alert(
            "Prediction service unavailable."
        );
    }
}


/* =====================================================
   DONATION SUGGESTION
===================================================== */

async function suggestDonation(item) {

    if (!item) {

        item =
            document
                .getElementById("wasteInput")
                .value
                .trim();
    }

    if (!item) {

        alert(
            "Enter an item first."
        );

        return;
    }

    try {

        const response =
            await fetch(
                `${ECO_BACKEND}/donation`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        item: item
                    })
                }
            );

        const data =
            await response.json();

        alert(
            "❤️ DONATION SUGGESTIONS\n\n" +
            data.suggestions.join("\n\n")
        );

    } catch (error) {

        alert(
            "Donation service unavailable."
        );
    }
}


/* =====================================================
   WASTE PICKUP
===================================================== */

async function requestWastePickup() {

    const waste =
        document
            .getElementById("wasteInput")
            .value
            .trim();

    if (!waste) {

        alert(
            "Enter the waste item first."
        );

        return;
    }

    const location =
        prompt(
            "Enter pickup location:"
        );

    if (!location) {
        return;
    }

    try {

        const response =
            await fetch(
                `${ECO_BACKEND}/pickup`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        waste: waste,
                        location: location
                    })
                }
            );

        const data =
            await response.json();

        alert(
            "🚚 Pickup Request\n\n" +
            data.status +
            "\nRequest ID: " +
            data.request_id
        );

    } catch (error) {

        alert(
            "Pickup service unavailable."
        );
    }
}


/* =====================================================
   CAMPUS MODE
===================================================== */

async function activateCampusMode() {

    try {

        const response =
            await fetch(
                `${ECO_BACKEND}/campus`
            );

        const data =
            await response.json();

        alert(
            "🏫 COLLEGE / CAMPUS MODE\n\n" +
            "Items analyzed: " +
            data.items_analyzed +
            "\n\n" +
            data.message
        );

    } catch (error) {

        alert(
            "Campus mode unavailable."
        );
    }
}


/* =====================================================
   ADMIN DASHBOARD
===================================================== */

async function openAdminDashboard() {

    try {

        const response =
            await fetch(
                `${ECO_BACKEND}/admin`
            );

        const data =
            await response.json();

        alert(
            "👨‍💼 ADMIN DASHBOARD\n\n" +

            "System: " +
            data.system_status +

            "\n\nItems analyzed: " +
            data.total_analyzed +

            "\nPickup requests: " +
            data.pickup_requests +

            "\nDonation records: " +
            data.donation_records
        );

    } catch (error) {

        alert(
            "Admin dashboard unavailable."
        );
    }
}


/* =====================================================
   IOT SMART BIN
===================================================== */

async function checkSmartBin() {

    const fillLevel =
        prompt(
            "Enter smart-bin fill level (%)",
            "75"
        );

    if (fillLevel === null) {
        return;
    }

    try {

        const response =
            await fetch(
                `${ECO_BACKEND}/iot-bin`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        bin: "EcoVision Smart Bin",
                        fill_level:
                            Number(fillLevel)
                    })
                }
            );

        const data =
            await response.json();

        alert(
            "🤖 IoT SMART BIN\n\n" +
            "Fill level: " +
            data.fill_level +
            "%\n\n" +
            "Status: " +
            data.status
        );

    } catch (error) {

        alert(
            "Smart bin service unavailable."
        );
    }
}


/* =====================================================
   GAMIFICATION
===================================================== */

function updateBadges() {

    const count =
        Number(
            localStorage.getItem(
                "ecoAnalyzed"
            )
        ) || 0;

    let badges = [];

    if (count >= 1) {
        badges.push("🌱 First Step");
    }

    if (count >= 5) {
        badges.push("♻️ Recycling Explorer");
    }

    if (count >= 10) {
        badges.push("🌍 Eco Champion");
    }

    if (count >= 25) {
        badges.push("🏆 Sustainability Hero");
    }

    localStorage.setItem(
        "ecoBadges",
        JSON.stringify(badges)
    );

    console.log(
        "EcoVision Badges:",
        badges
    );

    return badges;
}


/* =====================================================
   MULTILINGUAL SUPPORT
===================================================== */

const ecoTranslations = {

    en: {
        analyzing:
            "AI is analyzing your waste..."
    },

    hi: {
        analyzing:
            "AI आपके कचरे का विश्लेषण कर रहा है..."
    },

    kn: {
        analyzing:
            "AI ನಿಮ್ಮ ತ್ಯಾಜ್ಯವನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ..."
    }
};


function changeLanguage(language) {

    const translation =
        ecoTranslations[language];

    if (!translation) {
        return;
    }

    const title =
        document.getElementById(
            "scannerTitle"
        );

    if (title) {

        title.innerHTML =
            translation.analyzing;
    }

    localStorage.setItem(
        "ecoLanguage",
        language
    );
}


/* =====================================================
   VOICE ASSISTANT
===================================================== */

function speakResult(text) {

    if (!("speechSynthesis" in window)) {

        alert(
            "Voice assistant is not supported."
        );

        return;
    }

    const speech =
        new SpeechSynthesisUtterance(
            text
        );

    speech.lang =
        localStorage.getItem(
            "ecoLanguage"
        ) === "kn"
            ? "kn-IN"
            : "en-IN";

    speech.rate = 0.9;

    window.speechSynthesis.speak(
        speech
    );
}


/* =====================================================
   AI FEATURE MENU
===================================================== */

function showEcoVisionFeatures() {

    alert(
        "🌱 ECOVISION AI FEATURES\n\n" +

        "🌍 Multilingual Support\n" +
        "🎤 Voice Assistant\n" +
        "🏆 Gamification & Badges\n" +
        "📈 AI Waste Analytics\n" +
        "🔮 Waste Prediction\n" +
        "❤️ Donation Suggestions\n" +
        "🚚 Waste Pickup Requests\n" +
        "🏫 College/Campus Mode\n" +
        "👨‍💼 Admin Dashboard\n" +
        "🤖 IoT Smart Bin Integration"
    );
}


/* =====================================================
   INITIALIZE ADVANCED FEATURES
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {
        loadAnalytics();

        updateBadges();

        loadHistory();

        console.log(
            "🌱 EcoVision AI Advanced Features Ready"
        );

    }
);  

// =====================================================
// ECOVISION AI - HISTORY
// =====================================================

const HISTORY_API = "http://127.0.0.1:5000";

async function loadHistory() {

    const container = document.getElementById("historyContainer");

    if (!container) return;

    container.innerHTML = "<p>Loading history...</p>";

    try {

        const response = await fetch(`${HISTORY_API}/history`);

        if (!response.ok) {
            throw new Error("Unable to load history");
        }

        const history = await response.json();

        if (!history || history.length === 0) {

            container.innerHTML = `
                <div class="history-card">
                    <h3>📭 No History Yet</h3>
                    <p>Analyze some waste items to see them here.</p>
                </div>
            `;

            return;
        }

        container.innerHTML = history.map(item => `

            <div class="history-card">

                <h3>♻️ ${escapeHistoryText(item.waste)}</h3>

                <div class="history-category">
                    📂 ${escapeHistoryText(item.category)}
                </div>

                <p>
                    🗑️ <strong>Dispose:</strong><br>
                    ${escapeHistoryText(item.dispose)}
                </p>

                <p>
                    🔄 <strong>Reuse / Recycle:</strong><br>
                    ${escapeHistoryText(item.reuse)}
                </p>

                <p>
                    🌱 <strong>Eco Tip:</strong><br>
                    ${escapeHistoryText(item.tip)}
                </p>

                <div class="history-date">
                    🕒 ${formatHistoryDate(item.created_at)}
                </div>

            </div>

        `).join("");

    } catch (error) {

        console.error("History error:", error);

        container.innerHTML = `
            <div class="history-card">
                <h3>⚠️ History Unavailable</h3>
                <p>
                    Please make sure the EcoVision AI backend
                    is running on port 5000.
                </p>
            </div>
        `;
    }
}


// Safely display database text
function escapeHistoryText(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// Format date
function formatHistoryDate(dateString) {

    if (!dateString) return "Unknown date";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        return dateString;
    }

    return date.toLocaleString("en-IN");
}


// Clear database history
async function clearHistory() {

    const confirmDelete = confirm(
        "Are you sure you want to delete all waste analysis history?"
    );

    if (!confirmDelete) return;

    try {

        const response = await fetch(
            `${HISTORY_API}/history`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            throw new Error("Unable to clear history");
        }

        alert("History cleared successfully.");

        loadHistory();

    } catch (error) {

        console.error("Clear history error:", error);

        alert(
            "Could not clear history. Make sure the backend is running."
        );
    }
}


// Automatically load history when page opens
document.addEventListener("DOMContentLoaded", function () {

    loadHistory();

});

// =====================================================
// ECOVISION AI - ANALYTICS
// =====================================================

async function loadAnalytics() {

    try {

        const response = await fetch(`${HISTORY_API}/analytics`);

        if (!response.ok) {
            throw new Error("Analytics unavailable");
        }

        const data = await response.json();

        console.log("Analytics:", data);

        const total = document.getElementById("analyticsTotal");
        const top = document.getElementById("analyticsTop");
        const categories = document.getElementById("analyticsCategories");
        const breakdown = document.getElementById("analyticsBreakdown");

        if (!total) return;

        /*
         * The backend may return different field names.
         * We handle the common formats.
         */

        const totalItems =
            data.total ||
            data.total_items ||
            data.count ||
            0;

        total.textContent = totalItems;

        let categoryData =
            data.categories ||
            data.breakdown ||
            data.category_counts ||
            {};

        if (Array.isArray(categoryData)) {

            const converted = {};

            categoryData.forEach(item => {

                const name =
                    item.category ||
                    item.name ||
                    "Other";

                const count =
                    item.count ||
                    item.total ||
                    0;

                converted[name] = count;
            });

            categoryData = converted;
        }

        const entries = Object.entries(categoryData);

        categories.textContent = entries.length;

        if (entries.length > 0) {

            entries.sort((a, b) => b[1] - a[1]);

            top.textContent = entries[0][0];

            breakdown.innerHTML = entries.map(([category, count]) => `

                <div class="analytics-row">

                    <span>♻️ ${escapeHistoryText(category)}</span>

                    <strong>${count}</strong>

                </div>

            `).join("");

        } else {

            top.textContent = "-";

            breakdown.innerHTML =
                "<p>No analytics data available yet.</p>";
        }

    } catch (error) {

        console.error("Analytics error:", error);

        const breakdown =
            document.getElementById("analyticsBreakdown");

        if (breakdown) {

            breakdown.innerHTML = `
                <p>
                    ⚠️ Analytics unavailable.
                    Make sure the Flask backend is running.
                </p>
            `;
        }
    }
}   