import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { WS_BACKEND_URL } from "../../api";
import { Result, WSMessage, WS_MESSAGE_TYPE } from "../../types";
import ListOfClients from "./ListOfClients";
import RenderQuestions from "./RenderQuestions";

type JoinRoomProps = {
    // onJoinRoom: () => void;
}
const JoinRoom = () => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const joinRoomWithIdRef = useRef<HTMLInputElement>(null);
    const nicknameRef = useRef<HTMLInputElement>(null);
    const [username, setUsername] = useState("");
    const [roomId, setRoomId] = useState("");
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [connectedTo, setConnectedTo] = useState<string | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [results, setResults] = useState<Result[]>([]);
    const [voters, setVoters] = useState<string[]>([]);
    const [newQuestion, setNewQuestion] = useState(false);

    const [questions, setQuestions] = useState<WSMessage | null>(null);
    const [clients, setClients] = useState<string[]>([]);

    const onSocketOpen = (e: Event) => console.log("Connected");

    useEffect(() => {
        const uName = searchParams.get("username");
        const rId = searchParams.get("room_id");
        console.log({ first: true, uName, rId })

        if ((uName && rId) && (uName.length > 0 && uName.length < 30 && rId.length > 0 && rId.length < 50)) {
            setUsername(uName);
            setRoomId(rId);
            console.log({ uName, rId })
            joinRoom(rId, uName)
        }
        return () => {
            setSocket(null);
        }
    }, [])

    // useEffect(() => {
    //     setSearchParams({ room_id: roomId, username: username })
    // }, [roomId, username])

    const onSocketMessageReceived = (e: MessageEvent) => {
        console.log('Message from server ', e.data);
        const q = JSON.parse(e.data);
        switch (q.type as WS_MESSAGE_TYPE) {
            case WS_MESSAGE_TYPE.MESSAGE:
                setQuestions(q);
                console.log({
                    firstQuestion: q
                })
                break;
            case WS_MESSAGE_TYPE.CLIENTS:
                setClients(q.params.clients);
                break;
            case WS_MESSAGE_TYPE.RESULTS:
                const votes = q.params.data as Result[];
                setResults(votes);
                break;
            case WS_MESSAGE_TYPE.SERVER_CLOSED:
                onSocketClose();
                break;
            case WS_MESSAGE_TYPE.NEW_VOTE:
                const votingUsers = q.params.users as string[];
                setVoters(votingUsers);
                break;
            case WS_MESSAGE_TYPE.SET_NEW_QUESTION:
                setResults([]);
                setVoters([]);
                setQuestions(q);
                console.log({
                    newQuestion: q
                })
                setNewQuestion(true);
                break;
            default:
                break;
        }
    }

    const onSocketClose = () => {
        setClients([]);
        setSocket(null);
        setConnectedTo(null);
    }

    const addSocketListeners = async (s: WebSocket) => {
        if (s) {
            s.addEventListener('open', onSocketOpen);
            s.addEventListener('message', onSocketMessageReceived);
            s.addEventListener("close", onSocketClose);
            return "DONE";
        }
    }

    const removeSocketListeners = (s: WebSocket) => {
        if (s) {
            s.removeEventListener("open", onSocketOpen);
            s.removeEventListener('message', onSocketMessageReceived);
            s.removeEventListener("close", onSocketClose);
        }
    }

    const joinRoom = async (rId: string, uName: string) => {
        if (rId.length > 0 && rId.length < 50 && uName.length > 0 && uName.length < 30) {
            const s = new WebSocket(WS_BACKEND_URL);
            setSocket(s);
            await addSocketListeners(s);

            const join: WSMessage = {
                type: WS_MESSAGE_TYPE.JOIN,
                params: {
                    roomId: rId,
                    username: uName,
                    message: "Hello",

                }
            }

            setTimeout(() => {
                if (s.readyState === 1) {
                    setConnectedTo(roomId);
                    s.send(JSON.stringify(join));
                }
                if (s.readyState > 1) {
                    setConnectedTo(null)
                }
            }, 2000)
        }
    }

    useEffect(() => {

        return () => {
            removeSocketListeners(socket!);
        }
    }, []);

    const vote = (choice: number) => {
        socket?.send(JSON.stringify({
            type: "vote",
            params: {
                choice: choice,
            }
        }));
        setNewQuestion(false);
    }

    return (
        <>
            {
                !connectedTo && (
                    <div className="row">
                        <input
                            type="text"
                            placeholder="room id"
                            ref={joinRoomWithIdRef}
                            onChange={(e) => setRoomId(e.target.value!)}
                        />
                        <input
                            type="text"
                            placeholder="username"
                            ref={nicknameRef}
                            onChange={(e) => setUsername(e.target.value!)}
                        />
                        <button
                            onClick={(e: any) => {
                                e.target.disabled = true;
                                joinRoom(roomId, username);
                            }}
                        >
                            Join existing room
                        </button>
                    </div>
                )
            }

            {
                connectedTo && questions && (
                    <div>
                        <div>
                            <div className="room-header">
                                <h4>{connectedTo ? `Connected to: ${connectedTo}` : "Vote"}</h4>
                                <button
                                    className="disconnect"
                                    onClick={() => {
                                        socket?.send(JSON.stringify({ type: "leave", params: {} }));
                                        socket?.close();
                                        navigate(`/vote${search}`);
                                    }
                                    }
                                >
                                    Leave
                                </button>
                            </div>
                            <div className="vote mt-3 mb-3">
                                <div className="main questions-container">
                                    <RenderQuestions
                                        question={questions}
                                        results={results}
                                        onChoice={(choiceIndex) => vote(choiceIndex!)}
                                        newQuestion={newQuestion}
                                    />
                                </div>
                                <div className="clients">
                                    <ListOfClients
                                        clients={clients}
                                        username={username}
                                        voters={voters}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                )
            }
        </>
    )
}

export default JoinRoom;