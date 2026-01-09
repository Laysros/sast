const express = require('express');
const app = express();
const port = 3000;

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
