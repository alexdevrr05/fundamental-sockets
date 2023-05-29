const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      // Linea obligatoria
      useCreateIndex: true,
    });

    console.log('Conectado a la DB online');
  } catch (error) {
    console.log(error);
    throw new Error('No se pudo conectar a la DB');
  }
};

module.exports = {
  connectDatabase,
};
