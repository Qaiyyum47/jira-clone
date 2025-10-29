const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const issueRoutes = require('./routes/issueRoutes');
const commentRoutes = require('./routes/commentRoutes');
const spaceRoutes = require('./routes/spaceRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {})
  .catch((err) => {});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api', issueRoutes);
app.use('/api', commentRoutes); 
app.use('/api/spaces', spaceRoutes);


app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(port, () => {});