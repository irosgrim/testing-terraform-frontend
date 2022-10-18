import { useEffect, useState } from "react";
import { Result, WSMessage } from "../../types"

type RenderQuestionsProps = {
    question: WSMessage;
    results: Result[];
    onChoice: (answerIndex: number | null) => void;
    newQuestion: boolean;
}
const RenderQuestions = ({ question, results, onChoice, newQuestion }: RenderQuestionsProps) => {
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

    useEffect(() => {
        console.log("changed");
        setSelectedAnswer(null);
    }, [...Object.values(question.params.data!)])

    const setAnswer = (choice: number) => {
        onChoice(choice);
        setSelectedAnswer(choice);
    }

    return (
        <div>
            <h3 className="mt-3 mb3">{question.params.data?.description}</h3>
            <ul className={results.length > 0 ? "client-questions show-results" : "client-questions"}>
                {
                    question.params.data?.options.map((x, i) => (
                        <li key={i}>
                            <label
                                htmlFor={x.text.toString()}
                                className={selectedAnswer === i ? "question-label selected" : "question-label"}
                            >
                                <input
                                    type="radio"
                                    id={x.text.toString()}
                                    name="answer"
                                    value={x.text}
                                    onChange={() => setAnswer(i)}
                                    checked={selectedAnswer === i}
                                    disabled={results.length > 0}
                                />
                                <span className="input-text">
                                    <span>{x.text}</span>
                                    {
                                        results.length > 0 && results[i] && <span>{results[i].votes.length} votes</span>
                                    }
                                </span>
                            </label>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default RenderQuestions;