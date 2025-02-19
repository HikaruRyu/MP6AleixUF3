const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3030;
// Middleware per parsejar el cos de les sol·licituds a JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//mongodb+srv://Aleix:Aleix@hikaruryu0.9hefn.mongodb.net/?retryWrites=true&w=majority&appName=HikaruRyu0
// Connecta't a MongoDB (modifica l'URI amb la teva pròpia cadena de connexió)
mongoose.connect('mongodb+srv://Aleix:Aleix@hikaruryu0.9hefn.mongodb.net/EntrenametDB?retryWrites=true&w=majority&appName=HikaruRyu0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log(' Connected to MongoDB - EntrenametDB'))
  .catch(err => console.log(' Error connecting to MongoDB:', err));

// Definició del model de dades (un exemple simple d'un model de "Usuari")
const userSchema = new mongoose.Schema({
  muscul: String,
  data: String,
  exercicis: [
    {
      excercici: Number,
      nom: String,
      informacio: [
        {
          numSeries: Number,
          repeticioMin: String,
          repeticioMax: String,
          tempsRepeticio: String,
          tempsDescans: String,
          foto: String,
          altImg: String,
          descripcio: String
        }
      ]
    }
  ]
});

const User = mongoose.model('Entrenamet', userSchema, 'Entrenamet');

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.post('/entrenament', async (req, res) => {
  /// res.status(200).json(req.body);
  // Check if request body is empty and fill with default values
  if (!req.body.muscul || !req.body.data || !req.body.exercicis) {
    req.body.muscul = req.body.muscul || "err";
    req.body.data = req.body.data || "err";
    req.body.exercicis = req.body.exercicis || "err";
  }

  try {
    const user = new User({ muscul: req.body.muscul, data: req.body.data, exercicis: req.body.exercicis});
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: 'Error creating entrenament', error: err.message });
  }
});

// Ruta per obtenir tots els usuaris
app.get('/entrenament', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching entrenaments', error: err.message });
  }
});

// Ruta per obtenir una lista de entrenaments per data
app.get('/entrenament/list/:dataini/:datafi', async (req, res) => {
  const { dataini, datafi } = req.params;

  try {
    const entrenament = await User.find({
      data: { $gte: dataini, $lte: datafi}});

    if (entrenament.length === 0) {
      return res.status(404).json({ message: 'Entrenament not found in this rang of data' });
    }
    res.status(200).json(entrenament);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching entrenament', error: err.message });
  }
});


// Ruta per eliminar un usuari per ID 
app.delete('/entrenament/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'Entrenament not found' });
    }
    res.status(200).json({ message: 'Entrenament deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting entrenament', error: err.message });
  }
});

// Inicia el servidorxºxºz  
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
