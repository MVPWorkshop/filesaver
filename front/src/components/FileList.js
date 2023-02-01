const Row = ({ values, bold }) => {
    const embed = (val) => (bold ? <strong>{val}</strong> : <div>{val}</div>);

    return (
        <div className="Row">
            {values.map((el) => {
                return <div className="Entry">{embed(el)}</div>;
            })}
        </div>
    );
};

const FileList = () => {
    return (
        <div className="FileList">
            <h3>FileList</h3>
            <Row
                bold={true}
                values={[
                    "File Name",
                    "Status",
                    "Replicas",
                    "Duration",
                    "Download",
                ]}
            ></Row>

            <Row
                values={["File01.sol", "Active", "0/9", "131 days", "link"]}
            ></Row>
        </div>
    );
};

export default FileList;
