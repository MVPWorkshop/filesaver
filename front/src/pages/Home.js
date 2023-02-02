import FeedList from "../components/FeedList";

import LoginButton from "../components/LoginButton";

const Home = ({ stateManager }) => {
    return (
        <div className="Page Home">
            <div className="Moto">
                <h1 className="Title">FileSaver</h1>
                <h3 className="SubTitle">
                    Save files endlessly in a decentralized manner.
                </h3>
            </div>

            <LoginButton stateManager={stateManager}></LoginButton>

            <div className="FeedListContainer">
                <h2 className="PromoText">Check out Data Feed</h2>
                <FeedList></FeedList>
            </div>
        </div>
    );
};

export default Home;
