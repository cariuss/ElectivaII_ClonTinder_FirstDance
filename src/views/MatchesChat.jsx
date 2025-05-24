import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const MatchesChat = () => {
    const [matches, setMatches] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [messageInput, setMessageInput] = useState("");
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        // Fetch matches
        const fetchMatches = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/matches/history", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (data.success) setMatches(data.data.matches);
            } catch (error) {
                console.error("Error fetching matches:", error);
            }
        };

        fetchMatches();

        // Connect to WebSocket
        const newSocket = io("http://localhost:4000", {
            extraHeaders: { Authorization: `Bearer ${token}` },
        });

        setSocket(newSocket);

        return () => newSocket.disconnect();
    }, []);

    const joinChat = async (matchId) => {
        setSelectedMatch(matchId);
        setMessages([]);
        if (socket) {
            socket.emit("joinChat", { otherUserId: matchId });
            socket.on("receiveMessage", (data) => {
                setMessages((prev) => [...prev, { sender: data.senderId, content: data.content }]);
            });
        }
    };

    const sendMessage = () => {
        if (!socket || !selectedMatch || messageInput.trim() === "") return;

        const messageData = {
            chatId: selectedMatch,
            content: messageInput
        };

        socket.emit("sendMessage", messageData);
        setMessages((prev) => [...prev, { sender: "You", content: messageInput }]);
        setMessageInput("");
    };

    return (
        <div className="p-6 bg-gray-900 text-white rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Matches Chat</h2>
            <div className="flex gap-6">
                {/* Matches List */}
                <div className="w-1/3 bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-lg font-bold">Your Matches</h3>
                    <ul className="space-y-2">
                        {matches.length === 0 ? (
                            <p>No matches available.</p>
                        ) : (
                            matches.map((match) => (
                                <li key={match.targetUserId} className="p-2 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600"
                                    onClick={() => joinChat(match.targetUserId)}>
                                    {match.targetUserId}
                                </li>
                            ))
                        )}
                    </ul>
                </div>

                {/* Chat Area */}
                <div className="w-2/3 bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-lg font-bold">Chat with {selectedMatch || "Select a match"}</h3>
                    <div className="h-60 overflow-y-auto bg-gray-700 p-4 rounded-lg">
                        {messages.map((msg, index) => (
                            <div key={index} className={`p-2 rounded-lg ${msg.sender === "You" ? "bg-red-500" : "bg-gray-600"}`}>
                                <strong>{msg.sender}:</strong> {msg.content}
                            </div>
                        ))}
                    </div>
                    {selectedMatch && (
                        <div className="flex mt-4">
                            <input type="text" className="flex-1 p-2 bg-gray-700 text-white rounded-lg" placeholder="Type a message..."
                                value={messageInput} onChange={(e) => setMessageInput(e.target.value)} />
                            <button className="ml-2 bg-red-500 hover:bg-red-600 p-2 rounded-lg" onClick={sendMessage}>
                                Send
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MatchesChat;
