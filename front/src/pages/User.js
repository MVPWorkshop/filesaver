import DragAndDrop from "../components/DragAndDrop";
import FileList from "../components/FileList";

const User = ({ stateManager }) => {
    return (
        <div className="Page User">
            <div className="Container">
                <DragAndDrop></DragAndDrop>
                <div className="FileListContainer">
                    <h2>Your Files:</h2>
                    <FileList stateManager={stateManager}></FileList>
                </div>
            </div>
        </div>
    );
};

export default User;
