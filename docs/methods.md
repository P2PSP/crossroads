# crossroads *0.1.0*

> P2PSP server implementation


### configs/config.js


#### checkBinaries() 

Method to check if proper P2PSP core binaries are present on supplied path.
Exits with code 1 if checks fail.






##### Returns


- `Void`




### controllers/channelController.js


#### listAllChannels(req, res) 

Main controller method for listing out all channels currently present in
database. Response is sent in JSON encoded array of objects containing
channel information, HTTP 500 for server error.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| req | `Object`  | - Express request object | &nbsp; |
| res | `Object`  | - Express response object | &nbsp; |




##### Returns


- `Void`



#### getChannel(req, res) 

Controller method for getting information about a single channel with given
channel url. Response is sent in JSON JSON encoded object containing channel
information, HTTP 400 for wrong url, HTTP 500 for server error.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| req | `Object`  | - Express request object | &nbsp; |
| res | `Object`  | - Express response object | &nbsp; |




##### Returns


- `Void`



#### addChannel(req, res) 

Controller method for adding a new channel with given channel name. Newly
created channel's password and url are returned along with HTTP 200, on error
HTTP 500 is returned instead. For every server error, logger is fed with err
stack which shall be printed on attached [process.stdout].




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| req | `Object`  | - Express request object | &nbsp; |
| res | `Object`  | - Express response object | &nbsp; |




##### Returns


- `Void`



#### editChannel(req, res) 

Controller method for editing a single channel with given channel url and its
corresponding password. HTTP 200 is returned if successful, otherwise HTTP
500 for error.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| req | `Object`  | - Express request object | &nbsp; |
| res | `Object`  | - Express response object | &nbsp; |




##### Returns


- `Void`



#### removeChannel(req, res) 

Controller method for removing a single channel with given channel url and
its corresponding password. HTTP 200 is returned if successful, otherwise
HTTP 500 for error.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| req | `Object`  | - Express request object | &nbsp; |
| res | `Object`  | - Express response object | &nbsp; |




##### Returns


- `Void`




### controllers/frontendController.js


#### renderAllChannels(req, res) 

Main controller method for rendering all channels currently present in
database.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| req | `Object`  | - Express request object | &nbsp; |
| res | `Object`  | - Express response object | &nbsp; |




##### Returns


- `Void`



#### renderAChannel(req, res) 

Controller method for getting information about a single channel with given
channel url.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| req | `Object`  | - Express request object | &nbsp; |
| res | `Object`  | - Express response object | &nbsp; |




##### Returns


- `Void`



#### renderAddChannelForm(req, res) 

Controller method for rendering form for adding a new channel.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| req | `Object`  | - Express request object | &nbsp; |
| res | `Object`  | - Express response object | &nbsp; |




##### Returns


- `Void`



#### addChannel(req, res) 

Controller method for adding a new channel with given channel name.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| req | `Object`  | - Express request object | &nbsp; |
| res | `Object`  | - Express response object | &nbsp; |




##### Returns


- `Void`



#### renderEditChannelForm(req, res) 

Controller method for rendering form for editing an exisitng channel.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| req | `Object`  | - Express request object | &nbsp; |
| res | `Object`  | - Express response object | &nbsp; |




##### Returns


- `Void`



#### editChannel(req, res) 

Controller method for editing a single channel with given channel url and its
corresponding password.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| req | `Object`  | - Express request object | &nbsp; |
| res | `Object`  | - Express response object | &nbsp; |




##### Returns


- `Void`



#### renderRemoveChannelForm(req, res) 

Controller method for rendering remove channel form.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| req | `Object`  | - Express request object | &nbsp; |
| res | `Object`  | - Express response object | &nbsp; |




##### Returns


- `Void`



#### removeChannel(req, res) 

Controller method for removing a single channel with given channel url and
its corresponding password.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| req | `Object`  | - Express request object | &nbsp; |
| res | `Object`  | - Express response object | &nbsp; |




##### Returns


- `Void`




### controllers/validators/channelValidator.js


#### list(req, res, next) 

Validator for listing all existing channels. Sanitizes limit and offset query
and proceeds to next() middleware. If limit is more than 50 items, it will
default to 50.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| req | `Object`  | - Express request object | &nbsp; |
| req.query.limit | `String`  | - Numerical value for limit on items | &nbsp; |
| req.query.offset | `String`  | - Numerical value for offset of items | &nbsp; |
| res | `Object`  | - Express response object | &nbsp; |
| next | `Function`  | - Express next middleware function | &nbsp; |




##### Returns


-  



#### add(req, res, next) 

Request body validator for adding a new channel route. Validates the type of
data being sent and also performs checks on port numbers. Returns HTTP Status
400 if wrong data is being sent otherwise calls next() middleware. Keep in
mind that this validator is seperate from frontendAdd() since this guards the
api rather than the frontend request.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| req | `Object`  | - Express request object | &nbsp; |
| req.body.channelDescription | `String`  | - Description about the channel | &nbsp; |
| req.body.channelName | `String`  | - Name of the channel | &nbsp; |
| req.body.sourceAddress | `String`  | - Address of the source stream | &nbsp; |
| req.body.sourcePort | `Number`  | - Source port, should be between 0 - 65535 | &nbsp; |
| req.body.headerSize | `Number`  | - Size of headers in bytes | &nbsp; |
| req.body.isSmartSourceClient | `Boolean`  | - Boolean flag to change modes | &nbsp; |
| res | `Object`  | - Express response object | &nbsp; |
| next | `Function`  | - Express next middleware function | &nbsp; |




##### Returns


-  



#### frontendAdd(req, res, next) 

Request body validator for adding a new channel through frontend. Validates
the type of data being sent and also performs checks on port numbers. Returns
HTTP Status 400 if wrong data is being sent otherwise calls next() middleware
The isSmartSourceClient is optional field because of the way HTTP form works
with a checkbox value, nothing is sent if it's not checked.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| req | `Object`  | - Express request object | &nbsp; |
| req.body.channelDescription | `String`  | - Description about the channel | &nbsp; |
| req.body.channelName | `String`  | - Name of the channel | &nbsp; |
| req.body.sourceAddress | `String`  | - Address of the source stream | &nbsp; |
| req.body.sourcePort | `Number`  | - Source port, should be between 0 - 65535 | &nbsp; |
| req.body.headerSize | `Number`  | - Size of headers in bytes | &nbsp; |
| req.body.isSmartSourceClient | `Boolean`  | - Boolean flag to change modes (optional) | &nbsp; |
| res | `Object`  | - Express response object | &nbsp; |
| next | `Function`  | - Express next middleware function | &nbsp; |




##### Returns


-  



#### edit(req, res, next) 

Request body validator for editing channel route. Checks for channelNewName,
channelNewDescription, channelUrl and channelPassword are sent with the
request and calls next(), otherwise denies the request by returning HTTP 400.
Does not performs any kind of authorization, needs another validator for that




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| req | `Object`  | - Express request object | &nbsp; |
| req.body.channelNewDescription | `String`  | - New description about the channel | &nbsp; |
| req.body.channelNewName | `String`  | - New name of the channel | &nbsp; |
| req.body.channelUrl | `String`  | - Url of the channel to be edited | &nbsp; |
| req.body.channelPassword | `String`  | - Password of the channel to be edited | &nbsp; |
| res | `Object`  | - Express response object | &nbsp; |
| next | `Function`  | - Express next middleware function | &nbsp; |




##### Returns


-  



#### remove(req, res, next) 

Request body validator for removing an existing channel route. Checks for
channelUrl and channelPassword are sent with the request and calls next(),
denies the request otherwise by returning HTTP 400. Does not performs any
kind of authorization, needs another validator for that.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| req | `Object`  | - Express request object | &nbsp; |
| req.body.channelUrl | `String`  | - Url of the channel to be removed | &nbsp; |
| req.body.channelPassword | `String`  | - Password of the channel to be removed | &nbsp; |
| res | `Object`  | - Express response object | &nbsp; |
| next | `Function`  | - Express next middleware function | &nbsp; |




##### Returns


-  



#### auth(req, res, next) 

Authorization middleware - assumes channelUrl is already present in request
and tries to locate and authorize appropirate channel if possible, otherwise
denies the request and returns HTTP 401.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| req | `Object`  | - Express request object | &nbsp; |
| req.body.channelUrl | `String`  | - Url of the channel | &nbsp; |
| req.body.channelPassword | `String`  | - Password of the channel | &nbsp; |
| res | `Object`  | - Express response object | &nbsp; |
| next | `Function`  | - Express next middleware function | &nbsp; |




##### Returns


-  




### controllers/validators/isValidPort.js


#### isValidPort(port) 

Function to check if passed parameter is valid port number or not.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| port | `Number`  | - Port number | &nbsp; |




##### Returns


- `boolean`  




### engine/cmdGen.js


#### tagCmd(strings, params) 

Tag Method that helps generating execution command for given string & params




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| strings | `Array`  | - Array of Strings | &nbsp; |
| params | `Array`  | - Array of arguments passed to function | &nbsp; |




##### Returns


- `String`  string with all params placed at right position



#### genCmdSplitter(params) 

Simply stiches together the command and params passed to this function to
generate splitter process execution command




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| params | `Array`  | - Array of arguments passed to function | &nbsp; |




##### Returns


- `String`  splitter process execution command



#### genCmdMonitor(params) 

Simply stiches together the command and params passed to this function to
generate monitor process execution command




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| params | `Array`  | - Array of arguments passed to function | &nbsp; |




##### Returns


- `String`  monitor process execution command




### engine/communicator.js


#### net() 

Communicator module to establish connection and execute commands on remote
standalone engine

Exports methods
 - connect
 - launch
 - stop






##### Returns


- `Void`




### engine/engine.js


#### setProcessMap(mapp) 

Function to set processMap to supplied map type




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| mapp | `Map`  | - Map to store all running processes | &nbsp; |




##### Returns


- `Void`



#### launch(strings, params) 

Async function to launch splitter and monitor processes for given channel,
returns splitter and monitor address on success, otherwise throws Error




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| strings | `Array`  | - Array of Strings | &nbsp; |
| params | `Array`  | - Array of arguments passed to function | &nbsp; |




##### Returns


- `Array`  Array of splitter and monitor address



#### stop(url) 

Function to stop splitter and monitor process associated with certain channel




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| url | `string`  | - Unique channel url for which stop is to be called | &nbsp; |




##### Returns


- `Void`



#### onExit() 

OnExit handler, in case of fatal exit all processes are killed






##### Returns


- `Void`




### engine/getPort.js


#### getPort() 

Generates a random port via net.createServer() and returns it in a promise.






##### Returns


- `Promise`  promise resolving to port number




### engine/monitorProcess.js


#### launchMonitor(channel, splitterPort) 

Async function to launch monitor process for given channel, returns monitor
process and address on success, otherwise throws Error




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| channel | `Object`  | - Channel object containing relevant information | &nbsp; |
| splitterPort | `Number`  | - Port number of splitter process | &nbsp; |




##### Returns


- `Object`  Contains monitor process and address




### engine/splitterProcess.js


#### launchSplitter(channel) 

Async function to launch splitter process for given channel, returns splitter
process and address on success, otherwise throws Error




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| channel | `Object`  | - Channel object containing relevant information | &nbsp; |




##### Returns


- `Object`  Contains splitter process and address




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
