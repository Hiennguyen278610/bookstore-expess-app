export function checkEmptyBody(req, res, next) {
  const methodWithoutBody = ['GET', 'DELETE'];
  if (methodWithoutBody.includes(req.method)){
    return next();
  }
  if (req.is('application/json')){
    if (!req.body || Object.keys(req.body).length === 0){
      return res.status(400).json({ message: 'Request body cannot be empty' });
    }
  }
  if (req.is('multipart/form-data')) {
    const hasBody = req.body && Object.keys(req.body).length > 0;
    const hasFiles = (req.file && Object.keys(req.file).length > 0) ||
      (req.files && Object.keys(req.files).length > 0);

    console.log(hasBody, hasFiles);
    if (!hasBody && !hasFiles) {
      return res.status(400).json({ message: 'Request cannot be empty' });
    }
  }

  else if (!req.body ||  Object.keys(req.body).length === 0){
    return res.status(400).json({ message: 'Request body cannot be empty' });
  }
  next();
}