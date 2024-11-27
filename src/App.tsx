import { useRef, useEffect, useState } from "react";

const App: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null); // Ref untuk elemen <video>
  const [classification, setClassification] = useState<{
    class_name: string;
    confidence: number;
  } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // Ref untuk elemen <canvas>
  const ws = useRef<WebSocket | null>(null); // Ref untuk WebSocket

  useEffect(() => {
    // Setup WebSocket connection
    ws.current = new WebSocket("ws://localhost:8765");

    ws.current.onopen = () => console.log("WebSocket connected");
    ws.current.onmessage = (event) => {
      console.log(event);
      const result = JSON.parse(event.data);
      setClassification(result); // Set the received classification data
      console.log(result);
    };
    ws.current.onclose = () => console.log("WebSocket disconnected");

    // Start video streaming
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        // Start sending video frames
        const sendFrames = () => {
          if (canvasRef.current && videoRef.current && ws.current) {
            const ctx = canvasRef.current.getContext("2d");
            if (ctx) {
              ctx.drawImage(
                videoRef.current,
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height
              );

              // Convert canvas to Blob and send to WebSocket
              canvasRef.current.toBlob(
                (blob) => {
                  if (
                    blob &&
                    ws.current &&
                    ws.current.readyState === WebSocket.OPEN
                  ) {
                    ws.current.send(blob); // Send frame to WebSocket server
                  }
                },
                "image/jpeg",
                0.8 // Set quality (optional)
              );
            }
          }

          // Request the next animation frame
          requestAnimationFrame(sendFrames);
        };

        sendFrames();
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    startVideo();

    return () => {
      // Cleanup: Close WebSocket connection and stop video stream
      if (ws.current) ws.current.close();
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="h-screen w-screen grid grid-cols-2 gap-8">
      <div className="flex justify-center items-center">
        <video ref={videoRef} className="hidden" />
        <canvas ref={canvasRef} className="w-full h-3/4" />
      </div>

      {classification && (
        <div className="flex flex-col justify-center items-center">
          <h3 className="text-2xl mb-5 font-medium">Classification Result</h3>
          <p className="text-lg">Class Name: {classification.class_name}</p>
          <p className="font-light">Confidence: {(classification.confidence * 100).toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
};

export default App;
