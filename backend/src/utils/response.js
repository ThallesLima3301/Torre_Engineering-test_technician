function success(res, data, status = 200) {
  return res.status(status).json({ success: true, data });
}

function error(res, message = 'Internal Server Error', status = 500) {
  return res.status(status).json({ success: false, message });
}

module.exports = { success, error };
function success(res, data, status = 200) {
  return res.status(status).json({ success: true, data });
}

function error(res, message = 'Internal Server Error', status = 500) {
  return res.status(status).json({ success: false, message });
}

module.exports = { success, error };
