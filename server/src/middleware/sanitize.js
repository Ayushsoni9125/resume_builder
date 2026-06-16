// Recursively sanitizes objects to prevent NoSQL injection and XSS
const sanitizeInput = (input) => {
  if (input instanceof Array) {
    return input.map(item => sanitizeInput(item));
  }
  
  if (input !== null && typeof input === 'object') {
    const clean = {};
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        // Prevent NoSQL Injection: omit keys starting with $ or containing a dot
        if (key.startsWith('$') || key.includes('.')) {
          continue;
        }
        clean[key] = sanitizeInput(input[key]);
      }
    }
    return clean;
  }
  
  if (typeof input === 'string') {
    // Prevent XSS: neutralized HTML tags by escaping `<` and `>`
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
  
  return input;
};

const sanitize = (req, res, next) => {
  if (req.body) req.body = sanitizeInput(req.body);
  if (req.query) req.query = sanitizeInput(req.query);
  if (req.params) req.params = sanitizeInput(req.params);
  next();
};

module.exports = sanitize;
