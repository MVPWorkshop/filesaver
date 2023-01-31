import * as metamask from "../interactions/metamask";

const login = async ({ stateManager }) => {
    const { err, account } = await metamask.connect();

    if (err == "") {
        stateManager.updateState({ userAccount: account });
    }
};

const Home = ({ stateManager }) => {
    console.log({ stateManager });
    return (
        <div className="Home">
            <h2>HomePage</h2>
            <button onClick={async () => login({ stateManager })}>
                Connect Wallet
            </button>
        </div>
    );
};

export default Home;
