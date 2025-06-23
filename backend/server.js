const express = require('express');
const cors = require('cors');
const app = express();

const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/users'); // ✅ Add this line

app.use(cors());
app.use(express.json());

// ✅ Mount routers
app.use('/api', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter); // ✅ Mount user routes

app.get('/api/test', (req, res) =>
  res.json({ success: true, message: 'Server is running!' })
);

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
