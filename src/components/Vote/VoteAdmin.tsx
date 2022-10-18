import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { WS_BACKEND_URL } from "../../api";
import { WSMessage, WS_MESSAGE_TYPE } from "../../types";
import CreateQuestions from "./CreateQuestions"
import ListOfClients from "./ListOfClients";

type VoteAdminProps = {
    onBackClick: () => void;
}
const VoteAdmin = () => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [connectedTo, setConnectedTo] = useState<string | null>(null);
    const [roomId, setRoomId] = useState<string | null>(null);
    const [clients, setClients] = useState<string[]>([]);
    const [votes, setVotes] = useState<string[][]>([]);
    const [broadcastResults, setBroadcastResults] = useState(false);

    const [newQuestion, setNewQuestion] = useState(true);

    const onSocketOpen = (e: Event) => {
    }

    useEffect(() => {
        return () => {
            socket?.close();
        }
    }, [])

    const onSocketMessageReceived = (e: MessageEvent) => {
        console.log('Message from server ', e.data);
        const q = JSON.parse(e.data);
        switch (q.type as WS_MESSAGE_TYPE) {
            case WS_MESSAGE_TYPE.MESSAGE:
                console.log(`${q.type} not implemented`);
                break;
            case WS_MESSAGE_TYPE.CLIENTS:
                setClients(q.params.clients);
                break;
            case WS_MESSAGE_TYPE.NEW_VOTE:
                const voteMapping = q.params.votes.map((x: any) => x.votes);
                setVotes(voteMapping);
                break;
            case WS_MESSAGE_TYPE.SET_NEW_QUESTION:
                // setVotes([]);
                // setBroadcastResults(false);
                break;
            default:
                console.log(`${q.type} not known`)
                break;
        }
    }

    const onSocketClose = () => {
        setClients([]);
        setConnectedTo(null);
        setSocket(null);
        setBroadcastResults(true);
    }

    const addSocketListeners = async (s: WebSocket) => {
        if (s) {
            s.addEventListener('open', onSocketOpen);
            s.addEventListener('message', onSocketMessageReceived);
            s.addEventListener("close", goBack);
            return "DONE";
        }
    }

    const removeSocketListeners = (s: WebSocket) => {
        if (s) {
            s.removeEventListener("open", onSocketOpen);
            s.removeEventListener('message', onSocketMessageReceived);
            s.removeEventListener("close", goBack);
        }
    }

    const onCreateQuestion = async (question: WSMessage) => {
        if (connectedTo) {
            socket!.send(JSON.stringify(question));
            return;
        }

        if (!connectedTo) {
            const rId = question.params.roomId;
            setRoomId(rId);
            const s = new WebSocket(WS_BACKEND_URL)
            setSocket(s);

            await addSocketListeners(s);
            setTimeout(() => {
                if (s!.readyState === 1) {
                    setConnectedTo(rId)
                    s!.send(JSON.stringify(question));
                }
                if (s!.readyState > 1) {
                    setConnectedTo(null)
                }
            }, 2000)
        }
    }

    const goBack = () => {
        if (socket) {
            socket.close();
        }

        navigate(`/vote${search}`);
    }

    const showResults = () => {
        const showResultsToClients = {
            type: WS_MESSAGE_TYPE.SHOW_RESULTS,
            params: {}
        }
        socket?.send(JSON.stringify(showResultsToClients));
        setBroadcastResults(true);

    }

    const resetQuestion = () => {
        setVotes([]);
        setBroadcastResults(false);
    }

    return (
        <div className="admin">
            <h2>{connectedTo ? <span className="room-id">Room ID: <Link to={`/vote/client${search}`} target="_blank">{connectedTo}</Link></span> : "Vote on something"}</h2>
            <div className="vote">
                <div className="main">
                    <CreateQuestions
                        onCreateQuestions={(q) => onCreateQuestion(q)}
                        connectedToRoom={connectedTo}
                        votes={votes}
                        onAskNewQuestion={() => resetQuestion()}
                    >
                        <>
                            {
                                (connectedTo && votes.length > 0 && !broadcastResults) && (
                                    <button
                                        onClick={() => showResults()}
                                    >
                                        Show results
                                    </button>
                                )
                            }
                            {
                                broadcastResults && <p>Showing results to everyone</p>
                            }
                        </>
                    </CreateQuestions>
                </div>
                {
                    clients.length > 0 && (<div className="clients">
                        <ListOfClients
                            clients={clients}
                            username={"ADMIN"}
                            voters={votes.length > 0 ? votes.flatMap(x => x) : []}
                        />
                    </div>)
                }
            </div>
            <button onClick={() => goBack()}>Back</button>
        </div>
    )
}

export default VoteAdmin;