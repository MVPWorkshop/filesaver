// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import './IsFIL.sol';

contract FileSaver {

    /*
        The TERM corresponds to the time period for one individual storage deal
        Note: perpetual deals are sequences of individual storage deals
    */


    //TODO: calculate minimal duration for a storage deal
    uint constant TERM_DURATION = 10; //in block numbers

    address payable sFIL_Address;
        
    struct PerpetualDeal {
        uint replicas;
        uint activeReplicas;
        uint createdAt;
        uint duration;  //in block numbers
        uint amount;    
    }

    mapping (bytes32 => PerpetualDeal) CID_to_PerpertualDeal;

    mapping (bytes32 => mapping(address => bool)) CID_to_Provider_to_HasReserved;

    mapping (bytes32 => mapping(address => uint)) CID_to_Provider_to_NumberOfClaims;

    mapping (uint => bool) DealId_to_HasBeenUsed;

    constructor (address payable _sFIL_Address) {

        sFIL_Address = _sFIL_Address;
    }

    function proposePerpetualDeal (bytes32 _cid, PerpetualDeal memory _pd) public payable {
        //user wants to store his file so he proposes the terms

        CID_to_PerpertualDeal[_cid] = _pd;
        CID_to_PerpertualDeal[_cid].activeReplicas = 0;
        CID_to_PerpertualDeal[_cid].createdAt = block.number;
        CID_to_PerpertualDeal[_cid].amount = msg.value;

        IsFIL(sFIL_Address).wrapForSomeone{value: msg.value}(payable(address(this)));
    }

    function reserve (bytes32 _cid) public payable {
        //provider reserves a place in the total number of replicas that the user selected

        require (CID_to_PerpertualDeal[_cid].activeReplicas < CID_to_PerpertualDeal[_cid].replicas, "ERR: All places are reserved!");

        //TODO: MarketAPI interaction - possibly AddBalance function call

        CID_to_Provider_to_HasReserved[_cid][msg.sender] = true;
        CID_to_PerpertualDeal[_cid].activeReplicas += 1;
    }


    function claim (bytes32 _cid, uint _dealId) public {
        //provider claim his payout by providing the storage deal ID for the file that has the right CID

        require(CID_to_Provider_to_HasReserved[_cid][msg.sender] == true, "ERR: You have not made a reservation to store this File!");
        require(DealId_to_HasBeenUsed[_dealId] == false, "ERR: This dealId has already been claimed!");
        require(_activeTermNumber(_cid) > CID_to_Provider_to_NumberOfClaims[_cid][msg.sender], "ERR: You already made enough claims - wait for the next Term");

        //TODO: make a MarketAPI call check the if the deal with `_dealId` is active - if so, retrieve provider's address
        address provider = msg.sender;

        //TODO: calculate payout amount for a term
        uint payoutAmount = 1301;
        IsFIL(sFIL_Address).transfer(provider, payoutAmount);

        CID_to_Provider_to_NumberOfClaims[_cid][provider] += 1;
        DealId_to_HasBeenUsed[_dealId] = true;
    }

    function _totalNumberOfTerms (bytes32 _cid) internal returns (uint) {
        //calculates the total number of Terms for a given file

        return CID_to_PerpertualDeal[_cid].duration / TERM_DURATION;
    }

    function _remainingNumberOfTerms (bytes32 _cid) internal returns (uint) {
        //calculates the number of remaining Terms for a given file

        uint perpetualDealExpirationPoint = CID_to_PerpertualDeal[_cid].createdAt + CID_to_PerpertualDeal[_cid].duration;

        //check if the perpetual deal has expired
        if(perpetualDealExpirationPoint < block.number){
            return 0;
        }

        return (perpetualDealExpirationPoint - block.number) / TERM_DURATION;
    }

    function _activeTermNumber (bytes32 _cid) internal returns (uint) {
        //calculates the current Term ID

        return _totalNumberOfTerms(_cid) - _remainingNumberOfTerms(_cid);
    }

}