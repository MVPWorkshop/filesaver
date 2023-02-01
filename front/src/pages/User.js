import DragAndDrop from "../components/DragAndDrop";
import FileList from "../components/FileList";

const User = ({ stateManager }) => {
    return (
        <div className="User">
            <h2>UserPage</h2>
            <DragAndDrop></DragAndDrop>
            <FileList></FileList>
        </div>
    );
};

export default User;
