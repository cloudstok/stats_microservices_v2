import CryptoJS from "crypto-js"


export const encryption = async (plainText: string, secret: string) => {
    try {
        let _key = CryptoJS.enc.Utf8.parse(secret);
        let _iv = CryptoJS.enc.Utf8.parse(secret);
        let encrypted = CryptoJS.AES.encrypt(JSON.stringify(plainText), _key, {
            keySize: 16,
            iv: _iv,
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7,
        });
        return encrypted.toString();
    } catch (er) {
        console.error(er);
    }

};


export const decryption = async (app: string, strToDecrypt: string, secret: string) => {
    try {
        let _key = CryptoJS.enc.Utf8.parse(secret);
        let _iv = CryptoJS.enc.Utf8.parse(secret);

        let decrypted = CryptoJS.AES.decrypt(strToDecrypt, _key, {
            keySize: 16,
            iv: _iv,
            mode: CryptoJS.mode.ECB, // Consider using CBC for better security
            padding: CryptoJS.pad.Pkcs7,
        });

        const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
        if (!decryptedString) {
            console.log(strToDecrypt);
            console.error("Decryption failed: resulting string is empty or invalid for", app);
            return null;
        }

        return JSON.parse(decryptedString);

    } catch (er: any) {
        console.error("error occured for:", app, er.message);
        return null;
    }
};

