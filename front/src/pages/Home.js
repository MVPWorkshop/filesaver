import FeedList from "../components/FeedList";

import LoginButton from "../components/LoginButton";

const Home = ({ stateManager }) => {
    return (
        <div className="Home">
            <h2>HomePage</h2>
            <LoginButton stateManager={stateManager}></LoginButton>

            <FeedList></FeedList>
        </div>
    );
};

export default Home;
