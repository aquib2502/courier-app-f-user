'use client';
import { useEffect } from "react";
import { io } from "socket.io-client";

// Connect to your backend
const socket = io("http://localhost:5000");

const SocketTest = () => {
  useEffect(() => {
    // When connected
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server:", socket.id);

      // Retrieve the token from localStorage
      const token = localStorage.getItem("userToken");

      if (!token) {
        console.error("No userToken found in localStorage");
        return;
      }

      try {
        // Decode JWT manually to extract userId
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const decodedData = JSON.parse(window.atob(base64));

        const userId = decodedData?.userId;

        if (!userId) {
          console.error("No userId found in token payload");
          return;
        }

        console.log("Sending userId to socket:", userId);

        // Emit the register event with the actual userId
        socket.emit("register", userId);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    });

    // Listen for real-time notifications
    socket.on("new-notification", (data) => {
      console.log("📩 New notification received:", data);
      alert(`Notification: ${data.title} - ${data.message}`);
    });

    // Clean up when component unmounts
    return () => {
      socket.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

  return <h1>Socket.IO Test</h1>;
};

export default SocketTest;
