const express = require('express');
const helmet = require('helmet');
const app = express();
const port = 3000;

// FIX: Use Helmet to secure HTTP headers
app.use(helmet());

// FIX: Custom CSP to allow scripts if necessary (Helmet sets a strict one by default)
// For this simple app, default Helmet CSP is fine, but we might want to relax it for the inline script if we want to keep the XSS vulnerable part working? 
// No, the user asked to "fix vulnerability". 
// But wait, the XSS depends on inline scripts being allowed? 
// If I use helmet, it blocks inline scripts by default, so it effectively mitigates the XSS too at the browser level (CSP).
// I will just use defaults for now as it fixes the headers.

// FIX: Removal of 'X-Powered-By' is handled by helmet automatically.
// FIX: Cache-Control
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.get('/', (req, res) => {
  const name = req.query.name;
  // VULNERABILITY 1: Reflected XSS
  // If ?name=<script>alert(1)</script> is passed, it returns explicitly.
  res.send(`<h1>A Hello ${name || 'World'}</h1>`);
});

// VULNERABILITY 2: Hardcoded Secret (SAST should catch this)
const AWS_ACCESS_KEY = "AKIA1234567890EXTRA";
const AWS_SECRET_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Debug secret: ${AWS_ACCESS_KEY}`); // Intentional usage
});
