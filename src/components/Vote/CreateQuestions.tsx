import React, { ReactElement, useEffect, useState } from "react";
import { WSMessage, WS_MESSAGE_TYPE } from "../../types";
import { v4 as uuidv4 } from 'uuid';
import voteTemplates from "./voteTemplates.json";


type CreateQuestionsProps = {
    onCreateQuestions: (questions: WSMessage) => void;
    onAskNewQuestion: () => void;
    connectedToRoom: string | null;
    votes: string[][];
    children: ReactElement | ReactElement[];
}

const CreateQuestions = ({ onCreateQuestions, onAskNewQuestion, connectedToRoom, votes, children }: CreateQuestionsProps) => {
    const [questionsDescription, setQuestionsDescription] = useState("");
    const [questions, setQuestions] = useState<(string | number)[]>([""]);
    const [newRoomId, setNewRoomId] = useState<string | null>(uuidv4());
    const [newQ, setNewQ] = useState(false);
    const templates: { title: string; question: string; choices: string[] }[] = voteTemplates;

    const addNewQuestion = (i: number) => {
        setQuestions((opts) => {
            if (questions[i] !== "") {
                const n = [...opts];
                n.splice(i + 1, 0, "");
                return n;
            }
            return opts;
        })
    }

    const deleteQuestion = (i: number) => {
        setQuestions((opts) => {
            const o = [...opts];
            o.splice(i, 1);
            return o;
        })
    }

    const createQuestions = async () => {
        const newQuestion: WSMessage = {
            type: !newQ ? WS_MESSAGE_TYPE.CREATE : WS_MESSAGE_TYPE.NEW_QUESTION,
            params: {
                roomId: newRoomId!,
                username: null,
                message: null,
                data: {
                    description: questionsDescription,
                    options: questions.map(x => {
                        return {
                            text: x,
                            votes: 0,
                        }
                    })
                }
            }
        }
        onCreateQuestions(newQuestion);
        setNewQ(false);
    }

    const askNewQuestion = () => {
        onAskNewQuestion();
        setQuestionsDescription("");
        setQuestions([""]);
        setNewQ(true);
    }

    return (
        <div>
            {
                (!connectedToRoom || newQ) && (
                    <div className="template-buttons">
                        <button onClick={() => {
                            setQuestionsDescription("");
                            setQuestions([""]);
                        }}>
                            Empty
                        </button>
                        {
                            templates.map((t, i) => (
                                <button key={i} onClick={() => {
                                    setQuestionsDescription(t.question);
                                    setQuestions(t.choices);
                                }}>
                                    {t.title}
                                </button>
                            ))
                        }
                    </div>
                )
            }
            <div className="questions-container">
                <textarea
                    className="mb-3 mt-3 description"
                    placeholder="Question"
                    value={questionsDescription}
                    onChange={(e) => setQuestionsDescription(e.target.value)}
                    disabled={connectedToRoom !== null && !newQ}
                />
                <ul className="questions-list">
                    {
                        questions.map((v, i) => (
                            <li key={i} >
                                <textarea
                                    placeholder="option" value={v} onChange={(e) => {
                                        setQuestions((opts) => {
                                            const k = [...opts]
                                            k.splice(i, 1, e.target.value);
                                            return k;
                                        })
                                    }}
                                    disabled={connectedToRoom !== null && !newQ}
                                />
                                {(votes.length > 0) && <span>{votes[i].length} votes</span>}
                                {
                                    (!connectedToRoom || newQ) && (
                                        <div className="q-buttons-container">
                                            <button
                                                onClick={() => addNewQuestion(i)}
                                                disabled={connectedToRoom !== null && !newQ}
                                            >
                                                new
                                            </button>
                                            <button
                                                className="ml-3"
                                                disabled={questions.length === 1 || (connectedToRoom !== null && !newQ)}
                                                onClick={() => deleteQuestion(i)}
                                            >
                                                delete
                                            </button>
                                        </div>
                                    )
                                }

                            </li>
                        ))
                    }
                </ul>
                <div className="q-buttons">
                    {
                        (!connectedToRoom || newQ) && (
                            <button
                                className="b"
                                onClick={() => createQuestions()}
                                disabled={questions.length < 2 || questionsDescription === "" || questions.filter(x => x === "").length > 0}
                            >
                                Create
                            </button>
                        )
                    }
                    {
                        children
                    }
                    {
                        (connectedToRoom && !newQ) && <button className="b" onClick={() => askNewQuestion()}>Ask a new question</button>
                    }
                </div>
            </div>
        </div>
    )
}

export default CreateQuestions;