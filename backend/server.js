const express = require('express');
const cors = require('cors');
const app = express();

const authRouter = require('./routes/auth');

app.use(cors());
app.use(express.json()); // Important: parse JSON request bodies

app.use('/api', authRouter);

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
