var Wallet = require('ethereumjs-wallet');
var EthUtil = require('ethereumjs-util');
const fs = require('fs');
const crypto = require('crypto');
const path = require("path");


var id = crypto.randomBytes(32).toString('hex');
var privateKeyRandom = "0x"+id;



function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}



const args = process.argv;
//console.log(args[2]);

const passwordArg = args[2];
const privateKeyArg = args[3];

if(privateKeyArg?.length == 66){
	privateKey = privateKeyArg;
}else{
	privateKey = privateKeyRandom;
}


if(passwordArg?.length >= 8){
	password = passwordArg;
}else{
	password = makeid(24);
}


async function start(privateKeyString, password){

	const privateKeyBuffer = EthUtil.toBuffer(privateKeyString);
	const wallet = Wallet['default'].fromPrivateKey(privateKeyBuffer);

	const publicKey = wallet.getPublicKeyString();
	//console.log(publicKey);

	const address = wallet.getAddressString();
	// console.log(address);

	const keystoreFilename = wallet.getV3Filename();
	console.log('Generating: '+ keystoreFilename);

	const keystore = await wallet.toV3(password);
	//console.log(keystore);

	const maindirectory = "generate";	

	if (!fs.existsSync(maindirectory)){
    	fs.mkdirSync(maindirectory);
	}

	const directory = "generate/keystore";	

	if (!fs.existsSync(directory)){
    	fs.mkdirSync(directory);
	}


	/*
	fs.readdir(directory, (err, files) => {
  	if (err) throw err;

  	for (const file of files) {  		
    	await fs.unlink(path.join(directory, file));
    	console.log('file: ----> ' + file)
  	}
	});
	*/


	fs.writeFileSync(directory + '/' + keystoreFilename, JSON.stringify(keystore));
	fs.writeFileSync(directory + '/pass.pwd', password);
	fs.writeFileSync(maindirectory + '/.env', 'ACCOUNT='+address);	


	console.log('#############################################################################################')
	console.log('### SAVE this private key and password in a secure location');
	console.log('### as without it you will not be able to access or move the funds!!!!!!')
	console.log('#############################################################################################')
	console.log('');
	console.log('');
	console.log('================================ YOUR ADDRESS ===================================')
	console.log(address)
	console.log('================================ YOUR ADDRESS ===================================')
	console.log('');
	console.log('');
	console.log('================================ PRIVATE KEY ====================================')
	console.log(privateKey)
	console.log('================================ PRIVATE KEY ====================================')
	console.log('');
	console.log('');
	console.log('================================ PASSWORD ====================================')
	console.log(password)
	console.log('================================ PASSWORD ====================================')	

}

start(privateKey, password);
