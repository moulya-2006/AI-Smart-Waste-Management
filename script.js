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


    setTimeout(() => {

        let result = findWaste(input);

        displayResult(result, input);

    }, 1200);
}


/* =====================================
   FIND WASTE
===================================== */

function findWaste(input) {

    for (const keyword in wasteData) {

        if (input.includes(keyword)) {

            return wasteData[keyword];

        }

    }


    return {

        category: "Waste Item Not Clearly Identified",
        icon: "🔎",
        confidence: "Needs Review",

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
        document.getElementById("scannerArea");

    const title =
        document.getElementById("scannerTitle");

    const text =
        document.getElementById("scannerText");


    title.innerHTML =
        "AI is analyzing your waste...";

    text.innerHTML =
        "Identifying category and sustainable action";

    scannerArea.classList.add("analyzing");

}


/* =====================================
   DISPLAY RESULT
===================================== */

function displayResult(result, originalInput) {

    document
        .getElementById("scannerArea")
        .classList.remove("analyzing");


    document
        .getElementById("scannerTitle")
        .innerHTML =
        "Analysis ready";

    document
        .getElementById("scannerText")
        .innerHTML =
        "Your waste guidance is below";


    document
        .getElementById("resultSection")
        .style.display = "block";


    document
        .getElementById("categoryIcon")
        .innerHTML = result.icon;


    document
        .getElementById("category")
        .innerHTML = result.category;


    document
        .getElementById("confidence")
        .innerHTML =
        result.confidence === "Needs Review"
            ? "⚠️ Needs Review"
            : result.confidence + " Confidence";


    document
        .getElementById("disposeText")
        .innerHTML = result.dispose;


    document
        .getElementById("reuseText")
        .innerHTML = result.reuse;


    document
        .getElementById("tipText")
        .innerHTML = result.tip;


    document
        .getElementById("resultTitle")
        .innerHTML =
        "♻️ " + capitalize(originalInput);


    document
        .getElementById("resultSection")
        .scrollIntoView({
            behavior: "smooth"
        });


    updateImpact();
}


/* =====================================
   EXAMPLES
===================================== */

function useExample(example) {

    document
        .getElementById("wasteInput")
        .value = example;

    document
        .getElementById("wasteInput")
        .focus();

}


/* =====================================
   CLEAR RESULT
===================================== */

function clearResult() {

    document
        .getElementById("resultSection")
        .style.display = "none";


    document
        .getElementById("wasteInput")
        .value = "";


    document
        .getElementById("scannerTitle")
        .innerHTML =
        "What do you want to analyze?";


    document
        .getElementById("scannerText")
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


    recognition.lang = "en-IN";

    recognition.interimResults = false;

    recognition.continuous = false;


    recognition.onstart = function () {

        document
            .getElementById("scannerTitle")
            .innerHTML =
            "🎤 Listening...";

        document
            .getElementById("scannerText")
            .innerHTML =
            "Tell me the name of the waste item";

    };


    recognition.onresult = function (event) {

        const spokenText =
            event.results[0][0].transcript;


        document
            .getElementById("wasteInput")
            .value = spokenText;


        document
            .getElementById("scannerTitle")
            .innerHTML =
            "Voice captured";


        document
            .getElementById("scannerText")
            .innerHTML =
            "Press Analyze with AI to continue";

    };


    recognition.onerror = function () {

        alert(
            "Voice input could not be completed. Please try again."
        );

    };


    recognition.start();

}


/* =====================================
   CAMERA
===================================== */

let cameraStream = null;


async function openCamera() {

    const cameraArea =
        document.getElementById("cameraArea");


    try {

        cameraStream =
            await navigator.mediaDevices.getUserMedia({

                video: {
                    facingMode: {
                        ideal: "environment"
                    }
                },

                audio: false

            });


        document
            .getElementById("camera")
            .srcObject = cameraStream;


        cameraArea.style.display = "flex";

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
        document.getElementById("camera");

    const canvas =
        document.getElementById("cameraCanvas");


    if (!video.videoWidth) {

        alert(
            "Camera is not ready yet. Please wait a moment and try again."
        );

        return;
    }


    canvas.width = video.videoWidth;

    canvas.height = video.videoHeight;


    const context =
        canvas.getContext("2d");


    context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );


    const imageData =
        canvas.toDataURL("image/jpeg");


    console.log(
        "Captured image:",
        imageData
    );


    /*
       IMPORTANT:

       The image is successfully captured here.

       A real AI vision model still needs to be
       connected to this image before claiming that
       the image itself has been AI classified.
    */


    closeCamera();


    document
        .getElementById("scannerTitle")
        .innerHTML =
        "📸 Image captured";


    document
        .getElementById("scannerText")
        .innerHTML =
        "Ready for AI waste identification";


    document
        .getElementById("wasteInput")
        .value =
        "Captured waste image";


    alert(
        "Image captured successfully! AI image analysis will be connected next."
    );

}


/* =====================================
   CLOSE CAMERA
===================================== */

function closeCamera() {

    const cameraArea =
        document.getElementById("cameraArea");


    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(track => track.stop());

        cameraStream = null;

    }


    document
        .getElementById("camera")
        .srcObject = null;


    cameraArea.style.display = "none";

}


/* =====================================
   IMPACT COUNTER
===================================== */

function updateImpact() {

    let analyzed =
        Number(
            localStorage.getItem("ecoAnalyzed")
        ) || 128;


    let actions =
        Number(
            localStorage.getItem("ecoActions")
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
        .getElementById("analyzedCount")
        .innerHTML = analyzed;


    document
        .getElementById("actionCount")
        .innerHTML = actions;

}


/* =====================================
   INITIAL IMPACT NUMBERS
===================================== */

function loadImpactNumbers() {

    const analyzed =
        localStorage.getItem("ecoAnalyzed") || 128;

    const actions =
        localStorage.getItem("ecoActions") || 94;


    document
        .getElementById("analyzedCount")
        .innerHTML = analyzed;


    document
        .getElementById("actionCount")
        .innerHTML = actions;

}


/* =====================================
   CAPITALIZE
===================================== */

function capitalize(text) {

    return text
        .replace(/\b\w/g, letter =>
            letter.toUpperCase()
        );

}


/* =====================================
   MESSAGE
===================================== */

function showMessage(title, message) {

    alert(title + "\n\n" + message);

}


/* =====================================
   START
===================================== */

loadImpactNumbers();