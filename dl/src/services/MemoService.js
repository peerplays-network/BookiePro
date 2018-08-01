

import { Aes, PublicKey } from "peerplaysjs-lib";

/**
 * Service for work with memos
 */
class MemoService {


    /**
     * decodeMemo()
     *
     * Decodes a memo using the provided keys
     * 
     * @static
     * @param {*} receiverPrivateMemo - The Private Memo Key of the receiver of the memo
     * @param {*} senderPublicMemo - The Public Memo Key of the sender of the memo
     * @param {*} nonce - The generated nonce of the memo
     * @param {*} encryptedMessage - The actual encrypted memo itself. This is the message to be decoded.
     * @returns {String} - The unencrypted memo, or an error message if the memo could not be decoded.
     * @memberof MemoService
     */
    static decodeMemo(privateMemo, publicMemo, nonce, encryptedMessage) {
        // Using the AES library to decrypt the memo message using the private Memo key of the receiver and the public memo key of the sender.
        let decryptedMessage = Aes.decrypt_with_checksum(privateMemo, publicMemo, nonce, encryptedMessage);

        // The message then needs to be decoded using the default browser TextDecoder
        let decoder = new TextDecoder('utf-8');

        // Try to decode the message and throw an error if the decoing is unsuccessful.
        let message;
        try {
            message = decoder.decode(decryptedMessage); // Parse the resulting plain text into a JSON object
        } catch (error) {
            message = "Could not decode memo: " + error;
        }

        return message;
    }

}

export default MemoService;
