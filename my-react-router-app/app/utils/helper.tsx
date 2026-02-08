// create a function to encrypt and dcrypt data:-->will be used to encrypt localstorage
// const CryptoJS = require("crypto-js");
import CryptoJS from "crypto-js";
const secret="chedy"


export function encrypt<T>(data:string|null):T|null{
	if (data != null) {
		return CryptoJS.AES.encrypt(
			JSON.stringify(data),
			secret
		).toString();
	}
	return null;
};

// decrypt encrypted data
export function decrypt<T>(ciphertext:string|null):T|null{
	try {
		if (
			ciphertext != null &&
			ciphertext !== "null"
		) {
			let bytes = CryptoJS.AES.decrypt(ciphertext.toString(), secret);
			let decrypted = bytes.toString(CryptoJS.enc.Utf8);
			return JSON.parse(decrypted);
		}
		return null;
	} catch (e) {
		return null;
	}
};