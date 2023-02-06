import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IsFIL is IERC20 {

    event Wrap (address receiver, uint amount);
    event UnWrap (address receiver, uint amount);

    /// @notice Wraps FIL to sFIL for msg.sender
    function wrap() external payable;

    /// @notice Wraps FIL to sFIL to someone other than msg.sender
    /// @param _someone beneficiary address
    function wrapForSomeone(address payable _someone) external payable;

    /// @notice burns the corresponding sFIL amount and send the FIL to msg.sender
    /// @param _amount amount of sFIL to unwrap
    function unwrap(uint _amount) external;
}