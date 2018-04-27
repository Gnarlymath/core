const Model = require('../models/transaction')
const cryptoBuilder = require('./crypto')
const configManager = require('../managers/config')
const slots = require('../crypto/slots')

module.exports = class Transaction {
  /**
   * @constructor
   */
  constructor () {
    this.model = Model

    this.id = null
    this.timestamp = slots.getTime()
    this.version = 0x02
    this.network = configManager.get('pubKeyHash')
  }

  /**
   * Create new instance.
   * @return {Transaction}
   */
  create () {
    return this
  }

  /**
   * Set transaction fee.
   * @param {Number} fee
   * @return {Transaction}
   */
  setFee (fee) {
    this.fee = fee
    return this
  }

  /**
   * Set amount to transfer.
   * @param  {Number} amount
   * @return {Transaction}
   */
  setAmount (amount) {
    this.amount = amount
    return this
  }

  /**
   * Set recipient id.
   * @param  {String} recipientId
   * @return {Transaction}
   */
  setRecipientId (recipientId) {
    this.recipientId = recipientId
    return this
  }

  /**
   * Set sender public key.
   * @param  {String} publicKey
   * @return {Transaction}
   */
  setSenderPublicKey (publicKey) {
    this.senderPublicKey = publicKey
    return this
  }

  /**
   * Verify the transaction.
   * @return {Boolean}
   */
  verify () {
    return cryptoBuilder.verify(this)
  }

  /**
   * Serialize the transaction.
   * @return {Buffer}
   */
  serialize () {
    return this.model.serialize(this.getStruct())
  }

  /**
   * Sign transaction using passphrase.
   * @param  {String} passphrase
   * @return {Transaction}
   */
  sign (passphrase) {
    const keys = cryptoBuilder.getKeys(passphrase)
    this.senderPublicKey = keys.publicKey
    this.signature = cryptoBuilder.sign(this, keys)
    return this
  }

  /**
   * Sign transaction with second passphrase.
   * @param  {String} secondPassphrase
   * @return {Transaction}
   */
  secondSign (secondPassphrase) {
    const keys = cryptoBuilder.getKeys(secondPassphrase)
    this.secondSignature = cryptoBuilder.secondSign(this, keys)
    return this
  }

  /**
   * Get structure of transaction
   * @return {Object}
   */
  getStruct () {
    return {
      hex: cryptoBuilder.getBytes(this).toString('hex'),
      id: cryptoBuilder.getId(this),
      signature: this.signature,
      secondSignature: this.secondSignature,
      timestamp: this.timestamp,

      type: this.type,
      fee: this.fee,
      senderPublicKey: this.senderPublicKey
    }
  }
}