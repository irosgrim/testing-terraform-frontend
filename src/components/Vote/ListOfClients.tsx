import { useEffect, useState } from "react";

type ListOfClientsProps = {
    clients: string[];
    username: string;
    voters?: string[];
}

const ListOfClients = ({ clients, username, voters }: ListOfClientsProps) => {
    // const [voters, setVoters] = useState<string[]>([]);
    // useEffect(() => {
    //     if (votes && votes.length > 0) {
    //         setVoters(votes.flatMap(x => x));
    //     }
    // }, [votes]);

    return (
        <ul>
            {
                clients.map((x, i) => (
                    <li key={i} className={(username && x === username) ? "username" : ""}>{x}{voters && voters.indexOf(x) > -1 && " - ✓"}</li>
                ))
            }
        </ul>
    )
}

export default ListOfClients;