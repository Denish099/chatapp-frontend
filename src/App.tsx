import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessage] = useState<string[]>(["hi there", "hello"]);
  const wsRef = useRef<WebSocket | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000");

    socket.onmessage = (event) => {
      setMessage((m) => [...m, event.data]);
    };

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "join", payload: { roomid: "red" } }));
    };
    wsRef.current = socket;

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="h-screen bg-black flex flex-col justify-between">
      <div className="h-[80vh] w-full  p-4 flex flex-col gap-10">
        {messages.map((message, index) => (
          <div key={index}>
            <span className="bg-white text-black rounded m-8 p-4">
              {message}
            </span>
          </div>
        ))}
      </div>
      <div className="bg-white w-full flex p-2">
        <input
          type="text"
          ref={inputRef}
          placeholder="Enter text here"
          className="p-4 flex border border-gray-400 rounded"
        />
        <button
          className="bg-purple-600 text-white p-4 ml-2 rounded"
          onClick={() => {
            const message = inputRef.current?.value;
            wsRef.current?.send(
              JSON.stringify({
                type: "chat",
                payload: {
                  message,
                },
              })
            );
          }}
        >
          Send Message
        </button>
      </div>
    </div>
  );
}
export default App;
