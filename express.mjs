import express from 'express';
import mongoose from 'mongoose';

const app = express();
const port = 3000;
const server_url = `http://localhost:${port}`;

app.use(express.json());
app.use(express.static('src', { index: 'index.html' }));

try {
    await mongoose.connect('mongodb+srv://theodorerett:root@cluster0.fvepz.mongodb.net/theodorerett?retryWrites=true&w=majority&appName=Cluster0')
        .then(() => console.log('Connected to MongoDB'));
} catch (error) {
    console.log(error);
}

const recordingSchema = new mongoose.Schema({
    recording_id: String,
    director: String,
    name: String,
    category: String,
    image_name: String,
    duration: Number,
    rating: String,
    year_released: Number,
    price: Number,
    stock: Number,
    actors: Array
});

const recording_model = mongoose.model('Recordings', recordingSchema, 'Recordings');

app.get('/data', async (req, res) => {
    try {
        const recordings = await recording_model.find();
        res.json(recordings);
    } catch (error) {
        res.json({
            status: 'error',
            message: `Database Error: ${error.message}`
        });
    }
});

app.get('/query/:query', async (req, res) => {
    try {
        const queryString = req.params.query;

        if (queryString === null || queryString === undefined || queryString === '') {
            return res.json({
                status: 'error',
                message: 'Must provide query'
            });
        }

        const query = JSON.parse(queryString);

        const results = await recording_model.aggregate(query);
        res.json(results);
    } catch (error) {
        res.json({
            status: 'error',
            message: `Database Error: ${error.message}`
        });
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${server_url}`);
});