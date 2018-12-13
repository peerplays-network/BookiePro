import _ from "lodash";

/**
 * Notification Message Entity
 */
class NotificationMessage {

    /**
     *
     * @param {string} id
     * @param {string} message
     * @param {NotificationMessage.TYPES} type
     */
    constructor(id, message, type, isRead = false) {
        this.id = id;
        this.message = message;
        this.type = type;
        this.isRead = isRead;
    }

    setIsRead() {
        this.isRead = true;
    }

    /**
     *
     * @param {string} language | ISO 639-1: two-letter codes, one per language
     * @returns {string} Processed message
     */
    getText(language) {

        if (_.isObject(this.message)) {

            if (this.message[language]) {
                return this.message[language];
            }

            return this.message.en;

        }

        return this.message;

    }

}
/**
 * Types of messages
 * @type {{SOFTWARE_UPDATE: string}}
 */
NotificationMessage.TYPES = {
    SOFTWARE_UPDATE: 'SOFTWARE_UPDATE'
};

export default NotificationMessage;