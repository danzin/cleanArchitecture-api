const mongoose = require('mongoose');

/**
 * Executes a function within a MongoDB transaction.
 * @param {function} fn - The function to execute within the transaction. This function receives the session as its argument.
 * @returns {Promise} Returns a Promise that resolves to the result of the executed function if the transaction commits successfully.
 * @throws {Error} Throws an error if the transaction fails and is aborted.
 */
async function initiateTransaction(fn) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const result = await fn(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

module.exports = initiateTransaction;
