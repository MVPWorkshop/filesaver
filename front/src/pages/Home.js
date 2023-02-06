import { useNavigate } from "react-router-dom";

import FeedList from "../components/FeedList";

import LoginButton from "../components/LoginButton";

const Home = ({ stateManager }) => {
    const navigate = useNavigate();

    return (
        <div className="HomeContainer">
            <div className="Moto">
                <h1 className="Title">FileSaver</h1>
                <div className="SubTitleContainer">
                    <h3 className="SubTitle">
                        Save files endlessly in a decentralized manner.
                    </h3>
                    <div></div>
                </div>
                <div className="MVPWContainer">
                    <img src="/images/MVPW-logo.png"></img>
                </div>
            </div>
            <div className="Page Home">
                <div className="FixedContainer">
                    {stateManager.state.userAccount == null ? (
                        <LoginButton stateManager={stateManager}></LoginButton>
                    ) : (
                        <h4 className="LoggedInMessage">
                            <div> Go to your:</div>{" "}
                            <div
                                className="Link"
                                onClick={() =>
                                    navigate(
                                        `/user/${stateManager.state.userAccount}`
                                    )
                                }
                            >
                                Profile
                            </div>
                        </h4>
                    )}
                </div>

                <div className="FeedListContainer">
                    <h2 className="PromoText">Check out Data Feed</h2>
                    <FeedList stateManager={stateManager}></FeedList>
                </div>
            </div>
        </div>
    );
};

export default Home;
