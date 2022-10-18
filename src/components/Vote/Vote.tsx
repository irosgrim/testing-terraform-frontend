import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import VoteAdmin from "./VoteAdmin";

type Vote = {
    type: "vote";
    params: {
        choice: number;
    }
}


const Vote = () => {
    const { search } = useLocation();
    return (
        <div>
            <div className="vote-buttons">
                <Link to={`/vote/client${search}`}>
                    Join room
                </Link>
                <Link to={`/vote/admin${search}`}>
                    Create room
                </Link>
            </div>
        </div >
    )
}

export default Vote;