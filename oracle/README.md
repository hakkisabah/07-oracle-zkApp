GENERAL INFORMATION
-
This is a sample application that uses the Oracle ZKApp framework to create a simple application that.

Its no require a server to run, its a serverless application for require requests :)

We use and configure on Lambda of AWS.


PRE REQUIREMENTS
-
- AWS account
- aws cli (install instructions: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- nodejs 16.x (it must because aws lambda some functions may be not compatible with another versions)

PREPARE THE ENVIRONMENT
-
- change name of the file serverenv_example.json to serverenv.json and fill the values after getting the keys(PREPARE WITH NPM title is how to instructions).
- if you want to use .env file for the environment variables, change the name of the file .env_example to .env and fill the values after getting the keys for the other use.

PREPARE WITH NPM (use node version 16.x)
-
-  run `npm run keygen` command and get the generated keys with  from the console prints and save keys to serverenv.json.
- run `npm install` and follow the other instructions below.

AWS CONFIGURATION & DEPLOY
-
Aws cli
---
If you want to use aws cli, you must have an aws account and configure your aws cli with your credentials.

After create your aws account, you can find or create your credentials in aws console(https://console.aws.amazon.com/iam/home?region=eu-central-1#/security_credentials).

If not have a credentials, open your console in iam home and find "Access keys (access key ID and secret access key)" tab and click in "Create access key" button. Save your credentials in a safe place.

After installing aws cli, you need to configure it with your aws credentials. You can do it with `aws configure` command.

While configure your aws cli, you must provide your aws access key id, secret access key, default region name(you prefer eu-central-1) and for default output format just press enter.

I suggest for region to use eu-central-1. You can use another region.


Create zip file for lambda function
---
if you wanto zip with CLI command(in oracle folder) :
`zip -r minaOracle *`

Create role for lambda function
---
AWS role crate url = https://console.aws.amazon.com/iamv2/home#/roles

1. create role
2. select AWS service
3. select use case for Lambda and click next
4. find and add AWSLambdaBasicExecutionRole role and click next
5. enter role name(you should prefer minaOracle or whatever want to use)
6. click create role

and after use for create lambda function

Create Lambda function with aws cli
---
**Parameter mean** :

*YOUR-IAM-ID* is your aws account id

*LAMBDA-ROLE-NAME* is created role name

**aws cli commands** :

1 - 
`aws lambda create-function     --function-name minaOracle     --runtime nodejs16.x --memory-size 512  --environment file://serverenv.json  --zip-file fileb://minaOracle.zip     --handler index.handler --timeout 30   --role arn:aws:iam::`*YOUR-IAM-ID*`:role/`*LAMBDA-ROLE-NAME*

2 -
`aws lambda add-permission \
--function-name minaOracle \
--action lambda:InvokeFunctionUrl \
--principal "*" \
--function-url-auth-type "NONE" \
--statement-id url`

3 -
`aws lambda create-function-url-config \
--function-name minaOracle \
--auth-type NONE`

OPTIONAL : If you want to update lambda function use this after re zip file

4 - 
`aws lambda update-function-code     --function-name  minaOracle     --zip-file fileb://minaOracle.zip`


EXAMPLE REQUESTS :
--
- POST

`curl -X POST -H "Content-Type: application/json" -d '{"score": 1000}' https://`*YOUR-LAMBDA-FUNCTION-URL*`/score`

- GET

`curl https://`*YOUR-LAMBDA-FUNCTION-URL*`/score/1`


CODE STRUCTURE
-

- index.js : main file for lambda function and process requests
- getScore.js : get score from database
- setScore.js : set score to database
- processBase.js : base file for process for get and get score implementations
- keygen.js : generate keys for environment variables
- serverenv.json : environment variables of oracle keys for lambda function

EXPLANATION
-

- index.js
  - `event.requestContext.http.path` : get request path
  - `event.requestContext.http.method` : get request method
  - POST method is fake set score to database and return to random id with score
  - GET method is fake get score from database and return to score with id
  - All requests values check for integer and return error if not integer
- getScore.js
  - params : userId (integer)
  - knownCreditScore : fake database for get score its 1 or another integer value
  - return : generated score with userId
- setScore.js
  - params : score (integer)
  - mockId : fake generated id for userId
  - return : generated random id with score
- processBase.js
  - params : userId (integer) and score (integer)
  - return : signed data with params
- keygen.js
  - generate keys for environment variables

**NOTE** : processBase.js and keygen.js getting from https://github.com/jackryanservia/oracle-example
