from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
import random
from datetime import datetime
import pytz
import os

# intialize FASTAPI app
app = FastAPI()

# enable CORS so frontend and backend can communicate across origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # allow multiple / all origins (especially for testing/demo)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# new addition for Render environment. just loading the port here
PORT = int(os.environ["PORT"])

# set the timezone to PST
pst = pytz.timezone("America/Los_Angeles")

# predefined content for random generation
status_options = ["Deep focus mode", "At the gym", "Refactoring"]
notifications = ["New Slack message from Vincent Todd", "CS Club meeting right now!", "Mom texted: How are you?"]
activities = ["Walking King", "Playing Elden Ring", "Looking at UCI Apartments"]

# websocket endpoint for real-time streaming to the /ws path
@app.websocket("/ws")
# async function that runs when client connects via websock
async def websocket_endpoint(websocket: WebSocket): # injects socket for two way connection
    await websocket.accept() # handshake & formally accepts the websocket connection. w/o this communcation cannot begin
    try:
        while True:
            # while loop to continuously generate a random message object
            data = {
                "timestamp": datetime.now(pst).isoformat(),
                "type": random.choice(["status", "notification", "activity"]),
            }

            # add message content based on type
            if data["type"] == "status":
                data["content"] = random.choice(status_options)
            elif data["type"] == "notification":
                data["content"] = random.choice(notifications)
            elif data["type"] == "activity":
                data["content"] = random.choice(activities)

            print("Sending:", data) # logging

            # dictionary -> json formatted string
            try:
                await websocket.send_text(json.dumps(data))
                # break if send fails
            except Exception as send_error:
                print("Send failed:", send_error)
                break

            await asyncio.sleep(3) # push message every 3 seconds
    except WebSocketDisconnect:
        print("Client disconnected.")
    except Exception as e:
        print("Unhandled server error:", e)