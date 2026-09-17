from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import sqlite3
import re

app = Flask(__name__)
CORS(app)

DB_NAME = "ecovision.db"


# =========================================================
# DATABASE
# =========================================================

def init_db():
    conn = sqlite3.connect(DB_NAME)

    conn.execute("""
        CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            waste TEXT NOT NULL,
            category TEXT NOT NULL,
            dispose TEXT,
            reuse TEXT,
            tip TEXT,
            confidence TEXT,
            created_at TEXT NOT NULL
        )
    """)

    conn.execute("""
        CREATE TABLE IF NOT EXISTS pickup_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            waste TEXT,
            location TEXT,
            status TEXT,
            created_at TEXT
        )
    """)

    conn.execute("""
        CREATE TABLE IF NOT EXISTS donations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            item TEXT,
            organization TEXT,
            status TEXT,
            created_at TEXT
        )
    """)

    conn.commit()
    conn.close()


init_db()


# =========================================================
# HOME
# =========================================================

@app.route("/")
def home():
    return jsonify({
        "status": "online",
        "message": "EcoVision AI Backend is running!",
        "version": "2.0"
    })


# =========================================================
# WASTE CLASSIFICATION
# =========================================================

def classify_waste(waste):

    text = waste.lower().strip()

    # ---------- HAZARDOUS / E-WASTE ----------

    hazardous_words = [
        "battery",
        "lithium",
        "power bank",
        "paint",
        "chemical",
        "pesticide",
        "medicine",
        "thermometer"
    ]

    if any(word in text for word in hazardous_words):
        return {
            "category": "Hazardous / E-Waste",
            "dispose": "Keep it separate from ordinary household waste and use an appropriate authorized collection facility.",
            "reuse": "Use an approved recycling or collection program where available.",
            "tip": "Do not place batteries, chemicals or hazardous materials in regular household waste.",
            "confidence": "AI Classification"
        }

    electronic_words = [
        "phone", "mobile", "smartphone",
        "laptop", "computer", "pc",
        "tablet", "ipad",
        "keyboard", "mouse",
        "charger", "adapter",
        "earphone", "earbud", "earbuds",
        "airpod", "airpods",
        "headphone", "headphones",
        "speaker", "television", "tv",
        "monitor", "printer",
        "camera", "watch", "smartwatch",
        "router", "modem",
        "cable", "wire",
        "remote", "console",
        "electronic", "electronics"
    ]

    if any(word in text for word in electronic_words):
        return {
            "category": "E-Waste",
            "dispose": "Take the electronic item to an appropriate authorized e-waste collection or recycling facility.",
            "reuse": "Repair, reuse, donate or refurbish the device if it is still functional.",
            "tip": "Never mix electronic devices with ordinary household waste.",
            "confidence": "AI Classification"
        }

    # ---------- ORGANIC ----------

    organic_words = [
        "food", "food waste",
        "vegetable", "vegetables",
        "fruit", "fruits",
        "peel", "banana",
        "apple", "orange",
        "potato", "onion",
        "rice", "bread",
        "leftover", "leaves",
        "flower", "flowers",
        "garden waste",
        "plant waste",
        "grass"
    ]

    if any(word in text for word in organic_words):
        return {
            "category": "Organic Waste",
            "dispose": "Place suitable organic waste in the designated wet/organic waste collection.",
            "reuse": "Compost suitable food and garden waste.",
            "tip": "Composting can turn organic waste into a useful resource.",
            "confidence": "AI Classification"
        }

    # ---------- PAPER ----------

    paper_words = [
        "paper", "newspaper",
        "magazine", "book",
        "notebook", "cardboard",
        "carton", "box",
        "paper bag", "envelope",
        "receipt"
    ]

    if any(word in text for word in paper_words):
        return {
            "category": "Paper / Cardboard",
            "dispose": "Keep paper clean and dry and place it in the appropriate recyclable collection.",
            "reuse": "Reuse paper, boxes and cardboard before recycling.",
            "tip": "Reduce unnecessary printing and reuse paper whenever possible.",
            "confidence": "AI Classification"
        }

    # ---------- GLASS ----------

    glass_words = [
        "glass", "jar",
        "glass bottle",
        "glass cup",
        "glass container"
    ]

    if any(word in text for word in glass_words):
        return {
            "category": "Glass Waste",
            "dispose": "Separate glass and follow the appropriate local glass-recycling collection system.",
            "reuse": "Reuse suitable glass containers or send them for recycling.",
            "tip": "Handle broken glass carefully and keep it separate from other waste.",
            "confidence": "AI Classification"
        }

    # ---------- METAL ----------

    metal_words = [
        "metal", "aluminium",
        "aluminum", "steel",
        "iron", "tin",
        "can", "cans",
        "metal bottle",
        "metal container"
    ]

    if any(word in text for word in metal_words):
        return {
            "category": "Metal Waste",
            "dispose": "Place recyclable metal in the appropriate recycling collection.",
            "reuse": "Reuse suitable metal containers or send them for recycling.",
            "tip": "Recycling metals can reduce the need for extracting new raw materials.",
            "confidence": "AI Classification"
        }

    # ---------- PLASTIC ----------

    plastic_words = [
        "plastic",
        "plastic bottle",
        "plastic bag",
        "wrapper",
        "packet",
        "packaging",
        "container",
        "polythene",
        "polybag",
        "pet bottle",
        "water bottle",
        "milk packet"
    ]

    if any(word in text for word in plastic_words):
        return {
            "category": "Plastic Waste",
            "dispose": "Clean the plastic where appropriate and place it in the correct recyclable-waste collection.",
            "reuse": "Reuse suitable containers or send them for recycling.",
            "tip": "Reduce single-use plastic and choose reusable alternatives.",
            "confidence": "AI Classification"
        }

    # ---------- CLOTH / TEXTILE ----------

    textile_words = [
        "cloth", "clothes",
        "shirt", "tshirt",
        "t-shirt", "pants",
        "jeans", "dress",
        "saree", "shoe",
        "shoes", "sock",
        "bag", "textile",
        "fabric"
    ]

    if any(word in text for word in textile_words):
        return {
            "category": "Textile Waste",
            "dispose": "Donate usable textiles or use an appropriate textile collection/recycling service.",
            "reuse": "Repair, reuse or donate usable clothing and fabric.",
            "tip": "Extending the life of clothing reduces material waste.",
            "confidence": "AI Classification"
        }

    # ---------- WOOD ----------

    wood_words = [
        "wood", "wooden",
        "furniture", "chair",
        "table", "wood box",
        "timber"
    ]

    if any(word in text for word in wood_words):
        return {
            "category": "Wood Waste",
            "dispose": "Use an appropriate collection service for large wooden items.",
            "reuse": "Repair, repurpose or donate usable wooden items.",
            "tip": "Reuse wooden products before sending them for disposal.",
            "confidence": "AI Classification"
        }

    # ---------- DEFAULT ----------

    return {
        "category": "Other / General Waste",
        "dispose": "Check your local waste-management guidance before disposal.",
        "reuse": "Consider whether the item can be repaired, reused, donated or recycled.",
        "tip": "When uncertain, avoid mixing potentially recyclable or hazardous materials with general waste.",
        "confidence": "Needs Review"
    }


# =========================================================
# ANALYZE WASTE
# =========================================================

@app.route("/analyze", methods=["POST"])
def analyze():

    data = request.get_json(silent=True) or {}

    waste = data.get("waste", "").strip()

    if not waste:
        return jsonify({
            "error": "Please provide a waste item."
        }), 400

    result = classify_waste(waste)

    # Save history
    conn = sqlite3.connect(DB_NAME)

    conn.execute("""
        INSERT INTO history
        (waste, category, dispose, reuse, tip, confidence, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        waste,
        result["category"],
        result["dispose"],
        result["reuse"],
        result["tip"],
        result["confidence"],
        datetime.now().isoformat()
    ))

    conn.commit()
    conn.close()

    return jsonify(result)


# =========================================================
# HISTORY
# =========================================================

@app.route("/history", methods=["GET"])
def history():

    conn = sqlite3.connect(DB_NAME)

    rows = conn.execute("""
        SELECT id, waste, category, dispose, reuse, tip,
               confidence, created_at
        FROM history
        ORDER BY id DESC
        LIMIT 100
    """).fetchall()

    conn.close()

    history_data = []

    for row in rows:
        history_data.append({
            "id": row[0],
            "waste": row[1],
            "category": row[2],
            "dispose": row[3],
            "reuse": row[4],
            "tip": row[5],
            "confidence": row[6],
            "created_at": row[7]
        })

    return jsonify(history_data)


# =========================================================
# DELETE HISTORY
# =========================================================

@app.route("/history", methods=["DELETE"])
def delete_history():

    conn = sqlite3.connect(DB_NAME)

    conn.execute("DELETE FROM history")

    conn.commit()
    conn.close()

    return jsonify({
        "message": "History cleared successfully."
    })


# =========================================================
# ANALYTICS
# =========================================================

@app.route("/analytics", methods=["GET"])
def analytics():

    conn = sqlite3.connect(DB_NAME)

    total = conn.execute(
        "SELECT COUNT(*) FROM history"
    ).fetchone()[0]

    categories = conn.execute("""
        SELECT category, COUNT(*)
        FROM history
        GROUP BY category
        ORDER BY COUNT(*) DESC
    """).fetchall()

    conn.close()

    category_data = []

    for category, count in categories:
        category_data.append({
            "category": category,
            "count": count
        })

    return jsonify({
        "total_analyzed": total,
        "categories": category_data
    })


# =========================================================
# WASTE PREDICTION
# =========================================================

@app.route("/prediction", methods=["GET"])
def prediction():

    conn = sqlite3.connect(DB_NAME)

    rows = conn.execute("""
        SELECT category, COUNT(*)
        FROM history
        GROUP BY category
        ORDER BY COUNT(*) DESC
    """).fetchall()

    conn.close()

    if not rows:
        return jsonify({
            "prediction": "Not enough history to generate a prediction."
        })

    highest = rows[0]

    return jsonify({
        "prediction":
            f"{highest[0]} is currently the most frequently analyzed waste category.",
        "category": highest[0],
        "count": highest[1]
    })


# =========================================================
# DONATION SUGGESTIONS
# =========================================================

@app.route("/donation", methods=["POST"])
def donation():

    data = request.get_json(silent=True) or {}

    item = data.get("item", "").strip()

    if not item:
        return jsonify({
            "error": "Please provide an item."
        }), 400

    suggestions = [
        "Consider donating usable items to a local NGO or community organization.",
        "If the item is electronic and functional, consider repair, reuse or responsible donation.",
        "Clothing in usable condition can be donated instead of discarded.",
        "Functional books, furniture and household items may be suitable for donation."
    ]

    return jsonify({
        "item": item,
        "suggestions": suggestions
    })


# =========================================================
# WASTE PICKUP
# =========================================================

@app.route("/pickup", methods=["POST"])
def pickup():

    data = request.get_json(silent=True) or {}

    waste = data.get("waste", "").strip()
    location = data.get("location", "").strip()

    if not waste or not location:
        return jsonify({
            "error": "Waste item and location are required."
        }), 400

    conn = sqlite3.connect(DB_NAME)

    cursor = conn.execute("""
        INSERT INTO pickup_requests
        (waste, location, status, created_at)
        VALUES (?, ?, ?, ?)
    """, (
        waste,
        location,
        "Requested",
        datetime.now().isoformat()
    ))

    request_id = cursor.lastrowid

    conn.commit()
    conn.close()

    return jsonify({
        "request_id": request_id,
        "status": "Pickup request created successfully."
    })


# =========================================================
# CAMPUS MODE
# =========================================================

@app.route("/campus", methods=["GET"])
def campus():

    conn = sqlite3.connect(DB_NAME)

    total = conn.execute(
        "SELECT COUNT(*) FROM history"
    ).fetchone()[0]

    conn.close()

    return jsonify({
        "mode": "College / Campus",
        "items_analyzed": total,
        "message":
            "Campus waste analytics can be used to monitor common waste categories."
    })


# =========================================================
# ADMIN DASHBOARD
# =========================================================

@app.route("/admin", methods=["GET"])
def admin():

    conn = sqlite3.connect(DB_NAME)

    total_waste = conn.execute(
        "SELECT COUNT(*) FROM history"
    ).fetchone()[0]

    total_pickups = conn.execute(
        "SELECT COUNT(*) FROM pickup_requests"
    ).fetchone()[0]

    total_donations = conn.execute(
        "SELECT COUNT(*) FROM donations"
    ).fetchone()[0]

    conn.close()

    return jsonify({
        "total_analyzed": total_waste,
        "pickup_requests": total_pickups,
        "donation_records": total_donations,
        "system_status": "Online"
    })


# =========================================================
# IOT SMART BIN SIMULATION
# =========================================================

@app.route("/iot-bin", methods=["POST"])
def iot_bin():

    data = request.get_json(silent=True) or {}

    bin_name = data.get("bin", "Smart Bin")
    fill_level = data.get("fill_level", 0)

    try:
        fill_level = float(fill_level)
    except:
        fill_level = 0

    if fill_level >= 90:
        status = "Pickup Required"
    elif fill_level >= 70:
        status = "Nearly Full"
    else:
        status = "Normal"

    return jsonify({
        "bin": bin_name,
        "fill_level": fill_level,
        "status": status
    })


# =========================================================
# RUN
# =========================================================

if __name__ == "__main__":
    app.run(debug=True)