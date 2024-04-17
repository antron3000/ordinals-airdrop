# ordinals-airdrop
Ordinals Airdrop scripts and testing

## Step 1

inscribe wizard.jpg 

## Step 2

Create a pre-signed inscription for pizza.jpg 

```
sudo ord --regtest --cookie-file ~/.bitcoin/regtest/.cookie --index ~/.local/share/ord/regtest/index.redb wallet inscribe --file pizza.jpeg --fee-rate 2 --utxo {one of your utxo} --no-broadcast >> rawtx.json
```

The UTXO used for this inscription must not be spent by any other transactions. 


## Step 3

inscribe working.js with the inscription id of wizard.jpg as the first image and inscription id of pizza.jpeg for the 2nd image 

## Step 4

paste inscriptionID of working.js into index.html. Inscribe index.html

## Step 5

take raw transaction hex of the pizza.jepg inscription and send it manually via bitcoin-cli

```bitcoin-cli -regtest -rpcwallet=ord signrawtransactionwithwallet {transactionhex}```

```bitcoin-cli -regtest sendrawtransaction {signedtransactionhex}```


## Step 6

inscribe index.html including inscription ID of javascript file

## Step 7 

Create pre-reveal inscription
