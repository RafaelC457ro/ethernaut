import { ethers } from "hardhat";

/**
 *  require openssl and sha3sum
 *  generating privatekey with openssl (https://kobl.one/blog/create-full-ethereum-keypair-and-address/)
 *  https://ethereum.stackexchange.com/questions/18656/is-it-possible-to-generate-a-priv-key-from-scratch
 *  openssl ecparam -name secp256k1 -genkey --noout | openssl ec -text -noout > keypair.prv
 *  get the private key
 *  cat keypair.prv | grep priv -A 3 | tail -n +2 | tr -d ":\n[:space:]" > privatekey.prv
 *  get the public key
 *  cat keypair.prv | grep pub -A 5 | tail -n +2 | tr -d ":\n[:space:]" | sed "s/^04//g" > publickey.pub
 *  get the address
 *  cat publickey.pub | keccak-256sum -x -l | tr -d ' -' | tail -c 41
 */
async function main() {
  const account = new ethers.Wallet(process.env.PRIVATE_KEY_3!);

  console.log(account.address);
  console.log(account.publicKey);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
