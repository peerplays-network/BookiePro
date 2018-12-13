class StringHelper {

    static hex2a(hex) {
        let str = '';
        for (let i = 0; i < hex.length; i += 2) {
            let v = parseInt(hex.substr(i, 2), 16);
            if (v) str += String.fromCharCode(v);
        }
        return str;
    }

}

export default StringHelper;