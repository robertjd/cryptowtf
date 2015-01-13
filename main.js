var crypto = require('crypto');
var pbkdf2 = require('pbkdf2-sha256');
var forge = require('node-forge');
var sjcl = require('sjcl');

// This key has un-printable characters
var signingKey = 'YMxmmLo5itOXWWo45Ra4J5x6Oy8twJME7K4QY9Zysdo=';
var signingKeyBufferBase64 = new Buffer(signingKey,'base64');

var salt = 'zSF21yV2IwImc6T4dwBTZQ==';
var saltBufferBase64 = new Buffer(salt,'base64');

var expectedOutput = 'ivZummb+YKIskfdOU1G2bw==';

var iterations = 1;
var keyLengthBits = 128;
var keyLengthBytes = 16;

// SHA1
var nodeResult = crypto.pbkdf2Sync(signingKeyBufferBase64,saltBufferBase64,iterations, keyLengthBytes);

// SHA256
var forged = forge.pkcs5.pbkdf2(
  signingKeyBufferBase64.toString('binary'),
  saltBufferBase64.toString('binary'),
  iterations,
  keyLengthBytes,forge.md.sha256.create()
);

// SHA256
var coinLibResponse = pbkdf2(signingKeyBufferBase64,saltBufferBase64,iterations, keyLengthBytes);

// SHA256
var sjclResult = sjcl.misc.pbkdf2(
  sjcl.codec.base64.toBits(signingKey),
  sjcl.codec.base64.toBits(salt),
  iterations,
  keyLengthBits
);

console.log(expectedOutput, 'expected');

console.log('-------------------------------');

console.log(nodeResult.toString('base64'),'node version (SHA1)');

console.log(forge.util.encode64(forged),'forge version  (SHA256)');

console.log(coinLibResponse.toString('base64'),'coinbase lib (SHA256)');

console.log(sjcl.codec.base64.fromBits(sjclResult),'sjcl (SHA256)');

