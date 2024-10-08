'use client';
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const AdminChatCard = () => {

        const [socket, setSocket] = useState(null);
        const [messages, setMessages] = useState([]);
        const [message, setMessage] = useState("");
        const [socketID, setSocketId] = useState("");
        const [name, setName] = useState(null);
        const [name1, setName1] = useState(undefined);

        const handleSubmit = (e) => {
                e.preventDefault();
                socket.emit("message", { name1, message });
                setMessage("");
        };

        const NameSubmit = (e) => {
                e.preventDefault();
                setName1(name)
        }

        useEffect(() => {
                // const socket = new WebSocket("ws://localhost:8080");
                // const socket = io(process.env.HOST, { withCredentials: true }, []);
                // const ENDPOINT = "http://localhost:4000";
                
                const socket = io(process.env.HOST, {
                        transports: ['websocket']
                });
                setSocket(socket);

                socket.on("connect", () => {
                        setSocketId(socket.id);
                        console.log("connected", socket.id);
                });

                socket.on("receive-message", (data) => {
                        setMessages((messages) => [...messages, data]);
                });

                socket.on("connect_error", async (err) => {
                        console.log(`connect_error due to ${err.message}`);
                        setMessages((messages) => [...messages, { name: err.name, message: err.message }]);
                });

                return () => {
                        socket.disconnect();
                };
        }, []);


        return (
                <div>
                        <div className="h-[80vh] overflow-y-auto">
                                {messages.map((m, i) => (
                                        <div key={i} className="flex gap-3 flex-col border mb-2 rounded-md p-3">
                                                <div className="flex gap-2">
                                                        <p className="w-[30px] h-[30px] rounded-full border flex justify-center items-center">
                                                                <b>{m?.name[0]}</b>
                                                        </p>
                                                        <div>
                                                                <p className="text-xl font-bold">{m?.name}</p>
                                                                <p>{m?.message}</p>
                                                        </div>
                                                </div>
                                        </div>
                                ))}
                        </div>

                        {!name1 && <form onSubmit={NameSubmit} className="flex gap-4">
                                <input
                                        value={name || ''}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your name"
                                        className="p-3 px-4 bg-white rounded-md text-black border w-full"
                                />
                                <button type="submit" className="p-3 px-4 bg-green-400 rounded-md">Submit</button>
                        </form>
                        }

                        {name1 && <p>{name1} -  {socketID}</p>}
                        {name1 && < form onSubmit={handleSubmit} className="flex gap-4">
                                <input
                                        value={message || ''}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="message"
                                        className="p-3 px-4 bg-white rounded-md text-black border w-full"
                                />
                                <button type="submit" className="p-3 px-4 bg-green-400 rounded-md">Send</button>
                        </form>
                        }
                </div >
        );
}

export default AdminChatCard;