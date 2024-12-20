import { useEffect, useRef, useState } from "react";
import ReactMarkdown from 'react-markdown';

function Photo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ws = useRef<WebSocket | null>(null);

  const [classification, setClassification] = useState<{
    class_name: string;
    confidence: number;
    advice: string;
  } | null>(null);

  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    // Setup WebSocket connection
    ws.current = new WebSocket("ws://localhost:8765");
    ws.current.onopen = () => console.log("WebSocket connected");
    ws.current.onclose = () => console.log("WebSocket disconnected");
    ws.current.onmessage = (event) => {
      const result = JSON.parse(event.data);
      setClassification(result); // Assuming server sends classification result
    };

    // Access camera stream
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    startVideo();

    return () => {
      ws.current?.close();
    };
  }, []);

  // Function to capture photo from the video stream
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      }

      // Convert canvas to Blob
      canvas.toBlob((blob) => {
        if (blob && ws.current && ws.current.readyState === WebSocket.OPEN) {
          ws.current.send(blob); // Send the captured image to WebSocket server
        }

        // Convert blob to base64 and update the capturedImage state to show the image
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setCapturedImage(reader.result as string);
          }
        };
        if (blob) {
          reader.readAsDataURL(blob); // Convert image to base64
        }
      }, "image/jpeg");
    }
  };

  return (
    <div className="h-screen w-screen grid grid-cols-2 gap-8">
      <div className="flex flex-col items-center justify-center">
        <video ref={videoRef} className="mb-8 w-[80%]" />
        <canvas ref={canvasRef} className="hidden" />
        <div className="flex justify-center items-center">
          <button
            onClick={capturePhoto}
            className="px-8 py-2 bg-orange-600 text-white hover:bg-orange-400 active:scale-95 rounded-lg"
          >
            Capture Photo
          </button>
        </div>
      </div>

      {capturedImage && (
        <div className="flex flex-col items-center justify-center mb-20">
          <img src={capturedImage} alt="Captured" className="mb-8 w-[80%]" />

          {classification && (
            <div className="flex flex-col justify-center items-center">
              <h3 className="text-2xl mb-5 font-medium">
                Classification Result
              </h3>
              <p className="text-lg">Class Name: {classification.class_name}</p>
              <p className="font-light">
                Confidence: {(classification.confidence * 100).toFixed(2)}%
              </p>

              <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }} className="w-full h-80 border rounded p-2 overflow-auto">
                <ReactMarkdown>{classification.advice}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Photo;
