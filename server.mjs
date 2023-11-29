import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';


const app = express();
const PORT =  3000;

app.use(cors());

app.use(express.json());


mongoose.connect('mongodb+srv://varadapatil123:4FH3RJp25kt4p1UC@cluster0.qqlsyvu.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("CONNECTED TO MONGODB"))
  .catch(error => console.error("MongoDB connection error:", error));


const expenseSchema = new mongoose.Schema({
    description: String,
    amount: Number
});

const Expense = mongoose.model('Expense', expenseSchema);

app.post('/api/addExpense', async (req, res) => {
    try {
        const { description, amount } = req.body;

        if (!description || isNaN(amount)) {
            return res.status(400).json({ error: 'Invalid input' });
        }

        const newExpense = new Expense({
            description,
            amount
        });

        await newExpense.save();

        res.status(201).json({ message: 'Expense added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/getExpenses', async (req, res) => {
    try {
        const expenses = await Expense.find({}, { _id: 0, __v: 0 });
        res.status(200).json(expenses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});