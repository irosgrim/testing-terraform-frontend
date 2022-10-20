import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BACKEND_BASE_URL } from "../../api";
import { Hero, ShoppingListItem } from "../../types";

const HALL_OF_FAME = ["billy", "poäng", "malm bed", "expedit", "rens", "stockholm", "lack", "ecktorp", "docksta", "klippan", "ribba", "frakta"];

const Home = () => {
    const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
    const [backendError, setBackendError] = useState<string | null>(null);
    const { search } = useLocation();

    useEffect(() => {
        fetch(BACKEND_BASE_URL + "/list" + search)
            .then(r => r.json())
            .then(r => {
                setShoppingList(r);
            })
            .catch(err => setBackendError("If you see me, then i can't reach the backend"));
    }, [])

    return (
        <>
            <h2 className="mb-3">Latest</h2>
            <ul className="list static">
                {
                    HALL_OF_FAME.map((x, i) => (
                        <li key={i}>
                            {x[0].toUpperCase() + x.substring(1)}
                        </li>
                    ))
                }
            </ul>

            {
                backendError && <h2>🔥 {backendError} 🔥</h2>
            }

            {
                !backendError && (
                    <>
                        <h2>This comes from the backend and it's a shopping list!</h2>
                        <ul className="list server">
                            {
                                shoppingList.map((x, i) => (
                                    <li key={i}>
                                        {x.title}
                                        {x.done && <span>DONE</span>}
                                    </li>
                                ))
                            }
                        </ul>
                        <button onClick={() => {
                            fetch(BACKEND_BASE_URL + "/throw-error" + search)
                        }}>
                            Trigger error
                        </button>
                    </>
                )
            }

        </>
    )
}

export default Home;