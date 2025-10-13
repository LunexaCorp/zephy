import mongoose from 'mongoose';
import dotenv from 'dotenv';
import pc from 'picocolors';

dotenv.config();

const addIndexes = async () => {
  try {
    console.log(pc.blue('Conectando a MongoDB...'));

    await mongoose.connect(process.env.MONGODB_URI || process.env.DATABASE_URL);

    console.log(pc.green('✓ Conectado a MongoDB'));

    const db = mongoose.connection.db;

    // 1. Índices para SensorReading
    console.log(pc.cyan('\nCreando índices para SensorReading...'));

    await db.collection('sensorreadings').createIndex(
      { device: 1, timestamp: -1 },
      { name: 'device_timestamp_idx' }
    );
    console.log(pc.green('  ✓ Índice device_timestamp creado'));

    await db.collection('sensorreadings').createIndex(
      { timestamp: -1 },
      { name: 'timestamp_idx' }
    );
    console.log(pc.green('  ✓ Índice timestamp creado'));

    // 2. Índices para Device
    console.log(pc.cyan('\nCreando índices para Device...'));

    await db.collection('devices').createIndex(
      { location: 1, isEnabled: 1 },
      { name: 'location_enabled_idx' }
    );
    console.log(pc.green('  Índice location_enabled creado'));

    await db.collection('devices').createIndex(
      { isEnabled: 1 },
      { name: 'enabled_idx' }
    );
    console.log(pc.green('  Índice enabled creado'));

    // 3. Índices para Location
    console.log(pc.cyan('\nCreando índices para Location...'));

    await db.collection('locations').createIndex(
      { name: 1 },
      { name: 'name_idx' }
    );
    console.log(pc.green('  Índice name creado'));

    // Verificar índices creados
    console.log(pc.cyan('\nVerificando índices...'));

    const sensorIndexes = await db.collection('sensorreadings').indexes();
    console.log(pc.gray('  SensorReading índices:'), sensorIndexes.map(i => i.name));

    const deviceIndexes = await db.collection('devices').indexes();
    console.log(pc.gray('  Device índices:'), deviceIndexes.map(i => i.name));

    const locationIndexes = await db.collection('locations').indexes();
    console.log(pc.gray('  Location índices:'), locationIndexes.map(i => i.name));

    console.log(pc.green('\nTodos los índices creados exitosamente'));

    // Analizar rendimiento
    console.log(pc.cyan('\nEstadísticas de colecciones:'));

    const sensorStats = await db.collection('sensorreadings').stats();
    console.log(pc.gray(`  SensorReading: ${sensorStats.count} documentos, ${(sensorStats.size / 1024 / 1024).toFixed(2)} MB`));

    const deviceStats = await db.collection('devices').stats();
    console.log(pc.gray(`  Device: ${deviceStats.count} documentos, ${(deviceStats.size / 1024).toFixed(2)} KB`));

    const locationStats = await db.collection('locations').stats();
    console.log(pc.gray(`  Location: ${locationStats.count} documentos, ${(locationStats.size / 1024).toFixed(2)} KB`));

  } catch (error) {
    console.error(pc.red('Error al crear índices:'), error);
  } finally {
    await mongoose.disconnect();
    console.log(pc.yellow('\nDesconectado de MongoDB'));
    process.exit(0);
  }
};

addIndexes();
