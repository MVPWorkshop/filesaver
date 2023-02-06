// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import { MarketAPI, MarketAPIOld } from "../lib/filecoin-solidity/contracts/v0.8/MarketAPI.sol";
import { MarketTypes } from "../lib/filecoin-solidity/contracts/v0.8/types/MarketTypes.sol";

import './IsFIL.sol';

contract FileSaver {

    /*
        The TERM corresponds to the time period for one individual storage deal
        Note: perpetual deals are sequences of individual storage deals
    */

    uint64 constant public AUTHORIZE_MESSAGE_METHOD_NUM = 2643134072; 
    uint64 constant public DATACAP_RECEIVER_HOOK_METHOD_NUM = 3726118371;

    uint constant TERM_DURATION = 518400; //~ 6 months in block numbers

    address payable sFIL_Address;
        
    struct PerpetualDeal {
        string name;
        uint replicas;
        uint activeReplicas;
        uint createdAt;
        uint duration;  //in block numbers
        uint amount;    
    }

    mapping (address => uint) public user_to_CID_Counter;
    mapping (address => bytes[]) public user_to_CID;

    mapping (bytes => PerpetualDeal) public CID_to_PerpertualDeal;

    mapping (bytes => mapping(address => bool)) public CID_to_Provider_to_HasReserved;

    mapping (bytes => mapping(address => uint)) public CID_to_Provider_to_NumberOfClaims;

    mapping (uint => bool) public DealId_to_HasBeenUsed;

    constructor (address payable _sFIL_Address) {

        sFIL_Address = _sFIL_Address;
    }

    function proposePerpetualDeal (bytes memory _cid, PerpetualDeal memory _pd) public payable {
        //user wants to store his file so he proposes the terms

        CID_to_PerpertualDeal[_cid] = _pd;
        CID_to_PerpertualDeal[_cid].activeReplicas = 0;
        CID_to_PerpertualDeal[_cid].createdAt = block.number;
        CID_to_PerpertualDeal[_cid].amount = msg.value;

        user_to_CID[msg.sender].push(_cid);
        user_to_CID_Counter[msg.sender] += 1;

        IsFIL(sFIL_Address).wrapForSomeone{value: msg.value}(payable(address(this)));
    }

    function donate (bytes memory _cid) public payable {
        //user donates to an existing perpetual deal

        require(CID_to_PerpertualDeal[_cid].createdAt != 0, "ERR: File for the provided `_cid` has not yet been stored!");

        CID_to_PerpertualDeal[_cid].amount += msg.value;
        user_to_CID[msg.sender].push(_cid);
        user_to_CID_Counter[msg.sender] += 1;

        IsFIL(sFIL_Address).wrapForSomeone{value: msg.value}(payable(address(this)));
    }

    function reserve (bytes memory _cid) public payable {
        //provider reserves a place in the total number of replicas that the user selected

        require (CID_to_PerpertualDeal[_cid].activeReplicas < CID_to_PerpertualDeal[_cid].replicas, "ERR: All places are reserved!");

        //adds the funds to escrow
        MarketAPIOld.addBalance(abi.encodePacked(address(this)));

        CID_to_Provider_to_HasReserved[_cid][msg.sender] = true;
        CID_to_PerpertualDeal[_cid].activeReplicas += 1;
    }

    function claim (bytes memory _cid, uint _dealId) public {
        //provider claim his payout by providing the storage deal ID for the file that has the right CID

        require(CID_to_Provider_to_HasReserved[_cid][msg.sender] == true, "ERR: You have not made a reservation to store this File!");
        require(DealId_to_HasBeenUsed[_dealId] == false, "ERR: This dealId has already been claimed!");
        require(_activeTermNumber(_cid) > CID_to_Provider_to_NumberOfClaims[_cid][msg.sender], "ERR: You already made enough claims - wait for the next Term");

        MarketTypes.GetDealDataCommitmentReturn memory commitmentRet = MarketAPI.getDealDataCommitment(MarketTypes.GetDealDataCommitmentParams({id: uint64(_dealId)}));
        MarketTypes.GetDealProviderReturn memory providerRet = MarketAPI.getDealProvider(MarketTypes.GetDealProviderParams({id: uint64(_dealId)}));

        require(keccak256(commitmentRet.data) == keccak256(_cid), "ERR: The provided Deal's CID doesn't equal the passed CID!");
        require(address(uint160(providerRet.provider)) == msg.sender, "ERR: only the provider can call the `claim` method!");
        address provider = msg.sender;

        uint payoutAmount = _calculateTermPayout(_cid);
        CID_to_PerpertualDeal[_cid].amount -= payoutAmount;
        require(IsFIL(sFIL_Address).transfer(provider, payoutAmount), "ERR: unsuccessful sFIL transfer");

        CID_to_Provider_to_NumberOfClaims[_cid][provider] += 1;
        DealId_to_HasBeenUsed[_dealId] = true;
    }

    function handle_filecoin_method(uint64 method, uint64, bytes calldata params) public {
        //this method requires the implementation of FIP44

        if (method == AUTHORIZE_MESSAGE_METHOD_NUM) {
            //Based on contract's state and policy it authenticates the Deal Proposal
        }
    }

    function _totalNumberOfTerms (bytes memory _cid) internal returns (uint) {
        //calculates the total number of Terms for a given file

        return CID_to_PerpertualDeal[_cid].duration / TERM_DURATION;
    }

    function _remainingNumberOfTerms (bytes memory _cid) internal returns (uint) {
        //calculates the number of remaining Terms for a given file

        uint perpetualDealExpirationPoint = CID_to_PerpertualDeal[_cid].createdAt + CID_to_PerpertualDeal[_cid].duration;

        //check if the perpetual deal has expired
        if(perpetualDealExpirationPoint < block.number){
            return 0;
        }

        return (perpetualDealExpirationPoint - block.number) / TERM_DURATION;
    }

    function _activeTermNumber (bytes memory _cid) internal returns (uint) {
        //calculates the current Term ID

        return _totalNumberOfTerms(_cid) - _remainingNumberOfTerms(_cid);
    }

    function _calculateTermPayout (bytes memory _cid) internal returns (uint) {
        //calculates the payout amount for a specific term

        return CID_to_PerpertualDeal[_cid].amount / _remainingNumberOfTerms(_cid);
    }


}