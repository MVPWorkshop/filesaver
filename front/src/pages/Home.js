import LoginButton from "../components/LoginButton";

const Home = ({ stateManager }) => {
    return (
        <div className="Home">
            <h2>HomePage</h2>
            <LoginButton stateManager={stateManager}></LoginButton>
        </div>
    );
};

export default Home;
