document.addEventListener("DOMContentLoaded", () => {
  const balanceElement = document.getElementById("balance");
  const expensesList = document.getElementById("expenses-list");
  const expenseDescriptionInput = document.getElementById(
    "expense-description"
  );
  const expenseAmountInput = document.getElementById("expense-amount");
  const addExpenseBtn = document.getElementById("add-expense-btn");

  addExpenseBtn.addEventListener("click", async () => {
    const description = expenseDescriptionInput.value;
    const amount = parseFloat(expenseAmountInput.value);

    if (description && !isNaN(amount)) {
      await addExpense(description, amount);
      updateBalance();
      clearInputs();
      fetchExpenses(); 
    } else {
      alert("Please enter a valid description and amount.");
    }
  });

  async function addExpense(description, amount) {
    try {
      await fetch("http://localhost:3000/api/addExpense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description, amount }),
      });
    } catch (error) {
      console.error(error);
      alert("Failed to add expense. Please try again.");
    }
  }
  async function fetchExpenses() {
    try {
      const response = await fetch("http://localhost:3000/api/getExpenses");
      const expenses = await response.json();
      const expenseAmounts = expenses.map((expense) => expense.amount);

      const totalExpense = expenseAmounts.reduce((sum, amount) => sum + amount, 0);
      balanceElement.innerHTML = totalExpense
      updateExpensesList(expenses);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch expenses. Please try again.");
    }
  }

  function updateBalance() {
    const expenses = Array.from(expensesList.children)
        .map(item => parseFloat(item.children[1].textContent.slice(1)))
        .reduce((acc, curr) => acc + curr, 0);
    const balance = -expenses;
    balanceElement.textContent = balance.toFixed(2);
}


  function updateExpensesList(expenses) {
    expensesList.innerHTML = "";

    expenses.forEach((expense) => {
      const li = document.createElement("li");
      li.className = "expense-item";
      li.innerHTML = `
                <span>${expense.description}</span>
                <span>₹${expense.amount.toFixed(2)}</span>
            `;
      expensesList.appendChild(li);
    });
  }

  function clearInputs() {
    expenseDescriptionInput.value = "";
    expenseAmountInput.value = "";
  }
  fetchExpenses();
});
