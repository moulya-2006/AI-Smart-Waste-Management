function analyzeWaste() {

    // Get the user's input
    let waste = document.getElementById("wasteInput").value;

    // Get the result area
    let result = document.getElementById("result");

    // Remove extra spaces
    waste = waste.trim().toLowerCase();

    // Check if input is empty
    if (waste === "") {
        result.innerHTML = `
            <h3>⚠️ Please enter a waste item</h3>
            <p>Example: plastic bottle, newspaper, old phone, food waste</p>
        `;
        return;
    }

    // Plastic waste
    if (
        waste.includes("plastic") ||
        waste.includes("bottle") ||
        waste.includes("polythene")
    ) {
        result.innerHTML = `
            <h3>♻️ Plastic Waste</h3>
            <p><b>Category:</b> Recyclable Waste</p>
            <p><b>Disposal:</b> Put it in the appropriate recyclable waste stream.</p>
            <p><b>Reuse:</b> Reuse the container whenever possible.</p>
            <p><b>Sustainability Tip:</b> Avoid single-use plastic whenever possible.</p>
        `;
    }

    // Paper waste
    else if (
        waste.includes("paper") ||
        waste.includes("newspaper") ||
        waste.includes("cardboard")
    ) {
        result.innerHTML = `
            <h3>📄 Paper Waste</h3>
            <p><b>Category:</b> Recyclable Waste</p>
            <p><b>Disposal:</b> Place clean paper in the appropriate recycling stream.</p>
            <p><b>Reuse:</b> Reuse paper for notes or other purposes when possible.</p>
            <p><b>Sustainability Tip:</b> Reduce unnecessary paper consumption.</p>
        `;
    }

    // Organic waste
    else if (
        waste.includes("food") ||
        waste.includes("fruit") ||
        waste.includes("vegetable")
    ) {
        result.innerHTML = `
            <h3>🍎 Organic Waste</h3>
            <p><b>Category:</b> Organic Waste</p>
            <p><b>Disposal:</b> Use the appropriate organic/composting waste stream.</p>
            <p><b>Reuse:</b> Compost suitable organic waste.</p>
            <p><b>Sustainability Tip:</b> Reduce food waste whenever possible.</p>
        `;
    }

    // E-waste
    else if (
        waste.includes("phone") ||
        waste.includes("mobile") ||
        waste.includes("battery") ||
        waste.includes("charger") ||
        waste.includes("laptop") ||
        waste.includes("electronic")
    ) {
        result.innerHTML = `
            <h3>🔋 E-Waste</h3>
            <p><b>Category:</b> Electronic Waste</p>
            <p><b>Disposal:</b> Take electronic items to an appropriate e-waste collection facility.</p>
            <p><b>Reuse:</b> Repair or donate working electronics when possible.</p>
            <p><b>Sustainability Tip:</b> Do not mix electronic waste with ordinary household waste.</p>
        `;
    }

    // Unknown waste
    else {
        result.innerHTML = `
            <h3>🔍 Waste Type: Needs Further Identification</h3>
            <p><b>Recommendation:</b> Check the appropriate local waste-management guidance.</p>
            <p><b>Sustainability Tip:</b> Separate recyclable, organic and other waste streams whenever possible.</p>
        `;
    }
}
function useExample(item) {
    document.getElementById("wasteInput").value = item;
}


function clearResult() {
    document.getElementById("wasteInput").value = "";

    document.getElementById("result").innerHTML = `
        <p>Enter a waste item to get guidance.</p>
    `;
}