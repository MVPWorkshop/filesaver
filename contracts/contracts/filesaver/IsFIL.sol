import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IsFIL is IERC20 {

    event Wrap (address receiver, uint amount);
    event UnWrap (address receiver, uint amount);

    function wrap() external payable;

    function wrapForSomeone(address payable _someone) external payable;

    function unwrap(uint _amount) external;
}