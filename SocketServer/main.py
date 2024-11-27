import asyncio
import websockets
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
import io
import json


class_names = ['battery', 'biological', 'brown-glass', 'cardboard', 'clothes',
               'green-glass', 'metal', 'paper', 'plastic', 'shoes', 'trash', 'white-glass']

# Load model
model = load_model("model/fine_tunning_model.keras")


async def video_handler(websocket):
    print("WebSocket connection established")
    try:
        while True:
            # Terima data dari client
            data = await websocket.recv()

            # Preprocess gambar
            image_array = preprocess_image(data)

            # Prediksi dengan model
            class_id, confidence = classify_image(model, image_array)

            # Kirim hasil kembali ke client
            result = {
                "class_name": class_names[class_id],  # Nama kelas yang sesuai
                "confidence": float(confidence),
            }
            await websocket.send(json.dumps(result))
    except websockets.exceptions.ConnectionClosed:
        print("Connection closed")


# Fungsi preprocess_image
def preprocess_image(image_data: bytes):
    image = Image.open(io.BytesIO(image_data))
    image = image.resize((224, 224))
    image_array = np.array(image)
    image_array = image_array / 255.0
    image_array = np.expand_dims(image_array, axis=0)
    return image_array


# Fungsi classify_image
def classify_image(model, image_array):
    predictions = model.predict(image_array)
    class_id = np.argmax(predictions)
    confidence = predictions[0][class_id]
    return class_id, confidence


# Jalankan server WebSocket
async def main():
    server = await websockets.serve(video_handler, "localhost", 8765)
    print("WebSocket server started")
    await server.wait_closed()


if __name__ == "__main__":
    asyncio.run(main())
