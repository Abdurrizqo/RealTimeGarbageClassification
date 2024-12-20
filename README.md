
# Waste Classification with WebSocket and ReactJS

This project is a real-time waste classification application where a WebSocket server processes images sent from a ReactJS web application using a camera and classifies them using a pre-trained machine learning model. The classification results are sent back to the frontend for display.


## Requirements
Before you begin, make sure you have the following installed:

1. **Python 3.x**
2. **Node.js and npm**
3. **TensorFlow** (for the server-side ML model)
4. **React** (for the frontend)
5. **WebSocket library** for both client and server
6. **OpenCV** or other libraries for image processing (optional, depending on your setup)
## Depedency

Install Depedency Python Websocket Server

```bash
pip install tensorflow websockets
```

Install Depedency React
```bash
npm install
```
## Running the Server and Client
Running the server
```bash
python main.py
```

running the Client
```bash
npm run dev
```
