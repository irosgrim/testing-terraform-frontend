import React from 'react';
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Home from './components/Home';
import Vote from './components/Vote';
import JoinRoom from './components/Vote/JoinRoom';
import VoteAdmin from './components/Vote/VoteAdmin';

const App = () => {
  const { search } = useLocation();

  return (
    <div className="p-3">
      <h1>NCB4</h1>
      <ul className="main-nav">
        <li>
          <Link to={`/${search}`}>
            home
          </Link>
        </li>
        <li>
          <Link to={`/vote${search}`}>
            vote
          </Link>
        </li>
      </ul>
      <div className="mt-3">
        <Routes>
          <Route path={`/`} element={<Home />} />
          <Route path={`/vote`} element={<Vote />} />
          <Route path={`/vote/admin`} element={<VoteAdmin />} />
          <Route path={`/vote/client`} element={<JoinRoom />} />
        </Routes>
      </div>
    </div>
  )
}

export default App;
