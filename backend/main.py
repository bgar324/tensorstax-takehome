from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
import random
from datetime import datetime
import pytz
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PORT = int(os.environ["PORT"])

pst = pytz.timezone("America/Los_Angeles")

status_options = ["Deep focus mode", "At the gym", "Refactoring"]
notifications = ["New Slack message from Vincent Todd", "CS Club meeting right now!", "Mom texted: How are you?"]
activities = ["Walking King", "Playing Elden Ring", "Looking at UCI Apartments"]

#rregisters the function below as a handler for websocket connections to the '/ws' path
@app.websocket("/ws")
#async function that runs when client connects via websock
async def websocket_endpoint(websocket: WebSocket): #injects socket for two way connection
    await websocket.accept() #handshake & formally accepts the websocket connection w/o this communcation cannot begin
    try:
        while True:
            data = {
                "timestamp": datetime.now(pst).isoformat(),
                "type": random.choice(["status", "notification", "activity"]),
            }
            if data["type"] == "status":
                data["content"] = random.choice(status_options)
            elif data["type"] == "notification":
                data["content"] = random.choice(notifications)
            elif data["type"] == "activity":
                data["content"] = random.choice(activities)

            print("Sending:", data)

            # concerned JSON
            #DICTIONARY -> JSON FORMATTED STRING
            try:
                await websocket.send_text(json.dumps(data))
                #error handling
            except Exception as send_error:
                print("Send failed:", send_error)
                break
            #sleep, 3 seconds
            await asyncio.sleep(3)
    except WebSocketDisconnect:
        print("Client disconnected.")
    except Exception as e:
        print("Unhandled server error:", e)