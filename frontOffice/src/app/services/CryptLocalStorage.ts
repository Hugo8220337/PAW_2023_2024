import * as CryptoJS from 'crypto-js';

export class CryptLocalStorage {
    private static SECRET_KEY: string = 'never gonna give you up';


    //encriptar e guardar item no localStorage
    static setItem(key: string, value: string): void {
        localStorage.setItem(key, this.encrypt(value));

    }

    // Retornar o hash armazenado no localStorage
    static getItem(key: string): string | null {
        let data = localStorage.getItem(key) || "";
        return this.decrypt(data);
    }

    private static encrypt(txt: string): string {
        return CryptoJS.AES.encrypt(txt, this.SECRET_KEY).toString();
    }

    private static decrypt(txtToDecrypt: string) {
        return CryptoJS.AES.decrypt(txtToDecrypt, this.SECRET_KEY).toString(CryptoJS.enc.Utf8);
    }
}