const log = async(req, res, next) => {
    console.log('Request:', req.method, req.url);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  
  res.on('finish', () => {
    console.log('Response:', res.statusCode, res.statusMessage);
    console.log('Headers:', res.getHeaders());
    console.log('Body:', res.body);
  });

  next();
}

module.exports = log