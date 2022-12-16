import {
  Field,
  SmartContract,
  state,
  State,
  method,
  DeployArgs,
  Permissions,
  PublicKey,
  Signature,
  PrivateKey,
} from 'snarkyjs';

// The public key of our trusted data provider
const ORACLE_PUBLIC_KEY =
  'B62qrtCfwkN4QeHHphwpevEnW1zBzsZTbgWwHVhuBzL5SNgxcJB1b27';

export class OracleExample extends SmartContract {
  // Define contract state
  @state(PublicKey) oraclePublicKey = State<PublicKey>();

  // Define contract events
  events = {
    verified: Field,
  };

  deploy(args: DeployArgs) {
    super.deploy(args);
    this.setPermissions({
      ...Permissions.default(),
      editState: Permissions.proofOrSignature(),
      // receive: Permissions.signature(),
    });
  }

  @method init(zkappKey: PrivateKey) {
    super.init(zkappKey);
    // Initialize contract state
    this.oraclePublicKey.set(PublicKey.fromBase58(ORACLE_PUBLIC_KEY));
    // Specify that caller should include signature with tx instead of proof
    this.requireSignature();
  }

  @method verify(id: Field, creditScore: Field, signature: Signature) {
    // Get the oracle public key from the contract state
    // const oraclePublicKey = this.oraclePublicKey.get();
    this.oraclePublicKey.assertEquals(PublicKey.fromBase58(ORACLE_PUBLIC_KEY));
    // Evaluate whether the signature is valid for the provided data
    const validSignature = signature.verify(PublicKey.fromBase58(ORACLE_PUBLIC_KEY), [id, creditScore]);
    // Check that the signature is valid
    validSignature.assertTrue();
    // Check that the provided credit score is greater than 700
    creditScore.assertGte(Field(700));
    // Emit an event containing the verified users id
    this.emitEvent('verified', id);
  }
}
