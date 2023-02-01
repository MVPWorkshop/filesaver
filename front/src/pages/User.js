import DragAndDrop from "../components/DragAndDrop";
import FileList from "../components/FileList";

const User = ({ stateManager }) => {
    return (
        <div className="User">
            <h2>UserPage</h2>
            <div className="Container">
                <DragAndDrop></DragAndDrop>
                <FileList stateManager={stateManager}></FileList>
            </div>
        </div>
    );
};

export default User;
