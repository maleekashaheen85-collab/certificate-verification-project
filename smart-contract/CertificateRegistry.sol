\
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CertificateRegistry
 * @notice Minimal on-chain registry for issuing and verifying academic/official certificates.
 *         Designed for educational/demo use (Phase IX - Remix).
 *         - Owner can authorize/deauthorize issuers and set a service fee.
 *         - Authorized issuers can issue or revoke certificates.
 *         - Anyone can verify certificate status by ID or by content hash.
 */
contract CertificateRegistry {
    address public owner;
    uint256 public feeWei;

    struct Cert {
        string id;            // external, human-readable ID (e.g., CERT-2025-00001)
        bytes32 contentHash;  // hash of the off-chain electronic copy
        address issuer;       // who issued it
        uint64 issuedAt;      // timestamp (block time)
        bool revoked;         // revocation flag
        string meta;          // short metadata (program, grade...)
    }

    mapping(string => Cert) private certs;        // id -> Cert
    mapping(bytes32 => string) private idByHash;  // contentHash -> id
    mapping(address => bool) public isAuthorizedIssuer;

    event IssuerAuthorized(address indexed issuer, bool enabled);
    event CertificateIssued(string indexed id, bytes32 indexed contentHash, address indexed issuer);
    event CertificateRevoked(string indexed id, address indexed issuer);
    event FeeUpdated(uint256 feeWei);
    event Withdraw(address indexed to, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    modifier onlyIssuer() {
        require(isAuthorizedIssuer[msg.sender], "not authorized issuer");
        _;
    }

    constructor() {
        owner = msg.sender;
        isAuthorizedIssuer[msg.sender] = true;
        emit IssuerAuthorized(msg.sender, true);
    }

    // --- Admin ---
    function authorizeIssuer(address issuer, bool enabled) external onlyOwner {
        isAuthorizedIssuer[issuer] = enabled;
        emit IssuerAuthorized(issuer, enabled);
    }

    function setFeeWei(uint256 newFee) external onlyOwner {
        feeWei = newFee;
        emit FeeUpdated(newFee);
    }

    function withdraw(address payable to, uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "insufficient");
        to.transfer(amount);
        emit Withdraw(to, amount);
    }

    // --- Issuing ---
    function issueCertificate(
        string calldata certId,
        bytes32 contentHash,
        string calldata meta
    ) external payable onlyIssuer {
        require(bytes(certId).length > 0, "empty id");
        require(certs[certId].issuer == address(0), "id exists");
        require(bytes(idByHash[contentHash]).length == 0, "hash exists");
        if (feeWei > 0) {
            require(msg.value == feeWei, "bad fee");
        }

        certs[certId] = Cert({
            id: certId,
            contentHash: contentHash,
            issuer: msg.sender,
            issuedAt: uint64(block.timestamp),
            revoked: false,
            meta: meta
        });
        idByHash[contentHash] = certId;

        emit CertificateIssued(certId, contentHash, msg.sender);
    }

    function revokeCertificate(string calldata certId) external onlyIssuer {
        Cert storage c = certs[certId];
        require(c.issuer != address(0), "not found");
        require(!c.revoked, "already revoked");
        c.revoked = true;
        emit CertificateRevoked(certId, msg.sender);
    }

    // --- View/Verify ---
    function getCertificate(string calldata certId)
        external
        view
        returns (string memory id, bytes32 hash_, address issuer_, uint64 issuedAt_, bool revoked_, string memory meta_)
    {
        Cert storage c = certs[certId];
        require(c.issuer != address(0), "not found");
        return (c.id, c.contentHash, c.issuer, c.issuedAt, c.revoked, c.meta);
    }

    function verifyById(string calldata certId)
        external
        view
        returns (bool valid, bool exists, bool revoked)
    {
        Cert storage c = certs[certId];
        exists = (c.issuer != address(0));
        revoked = exists && c.revoked;
        valid = exists && !revoked;
    }

    function verifyByHash(bytes32 contentHash)
        external
        view
        returns (bool valid, bool exists, bool revoked, string memory id)
    {
        id = idByHash[contentHash];
        exists = bytes(id).length != 0;
        if (!exists) return (false, false, false, "");
        Cert storage c = certs[id];
        revoked = c.revoked;
        valid = !revoked;
    }

    // allow contract to receive ETH (fees)
    receive() external payable {}
}
