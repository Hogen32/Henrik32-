# Enable debug JSON RPC API


## Check if the module has been enabled:

```bash
curl --request POST \
  --url http://127.0.0.1:8545/ \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/2023.5.8' \
  --data '{
    "jsonrpc": "2.0",
    "method": "rpc_modules",
    "params": [],
    "id": 1
}
'
```

Response should be

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "debug": "1.0",
    "eth": "1.0",
    "net": "1.0",
    "rpc": "1.0",
    "txpool": "1.0",
    "web3": "1.0"
  }
}

``` 

## Get transaction detail by block number

Run an async decryption call test:

```bash
npx hardhat test --grep 'test async decrypt ebytes256 non-trivial'


  TestAsyncDecrypt
4:42:50 PM - Fulfilled decrypt on block 336 (requestID 3)
    ✔ test async decrypt ebytes256 non-trivial (25659ms)
    ✔ test async decrypt ebytes256 non-trivial with snapshot [skip-on-coverage]


  2 passing (50s)

```

Convert the block to hexa, 336 is 0x150, call this debug method:

```bash
curl --request POST \
  --url http://127.0.0.1:8545/ \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/2023.5.8' \
  --data '{
"jsonrpc":"2.0",
"method":"debug_traceBlockByNumber",
"params":["0x150", {}],
"id":1}'
```

Response: 

```json
{
	"jsonrpc": "2.0",
	"id": 1,
	"result": [
		{
			"result": {
				"failed": false,
				"gas": 2500000,
				"returnValue": "",
				"structLogs": [
					{
						"depth": 1,
						"gas": 4994037,
						"gasCost": 3,
						"op": "PUSH1",
						"pc": 0,
						"stack": []
					},
					{
						"depth": 1,
						"gas": 4994034,
						"gasCost": 3,
						"op": "PUSH1",
						"pc": 2,
						"stack": [
```
