const sendError = (body) => {
  return {success: false, error: body};
}

const sendSuccess = (body) => {
  return {success: true, data: body};
}

module.exports = { sendError, sendSuccess };