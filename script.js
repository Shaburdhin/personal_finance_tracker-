let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let expensesChart;

const transactionForm = document.getElementById('transactionForm');
const transactionTable = document.getElementById('transactionTable').getElementsByTagName('tbody')[0];
const totalIncomeElement = document.getElementById('totalIncome');
const totalExpensesOverviewElement = document.getElementById('totalExpensesOverview');
const savingsElement = document.getElementById('savings');
const chartCtx = document.getElementById('expensesChart').getContext('2d');


function addTransaction(event) {
    event.preventDefault();
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;
    const type = document.getElementById('type').value;
    const category = document.getElementById('category').value;

    const transaction = { description, amount, date, type, category };
    transactions.push(transaction);
    saveTransactions();
    renderTransactions();
    updateSummary();
    updateChart();
    transactionForm.reset();
}

function renderTransactions() {
    transactionTable.innerHTML = '';
    transactions.forEach((transaction, index) => {
        const row = transactionTable.insertRow();
        row.insertCell(0).textContent = transaction.description;
        row.insertCell(1).textContent = `$${transaction.amount.toFixed(2)}`;
        row.insertCell(2).textContent = transaction.date;
        row.insertCell(3).textContent = transaction.type;
        row.insertCell(4).textContent = transaction.category;

        const deleteCell = row.insertCell(5);
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-btn';
        deleteButton.onclick = () => deleteTransaction(index);
        deleteCell.appendChild(deleteButton);
    });
}

function deleteTransaction(index) {
    transactions.splice(index, 1);
    saveTransactions();
    renderTransactions();
    updateSummary();
    updateChart();
}

function updateSummary() {
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    const savings = totalIncome - totalExpenses;

    totalIncomeElement.textContent = totalIncome.toFixed(2);
    totalExpensesOverviewElement.textContent = totalExpenses.toFixed(2);
    savingsElement.textContent = savings.toFixed(2);
}

function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}


function initializeChart() {
    expensesChart = new Chart(chartCtx, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                    '#C9CBCF'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                },
                title: {
                    display: true,
                    text: 'Expenses by Category'
                }
            }
        }
    });
}

function updateChart() {
    const expensesByCategory = {};

    transactions.forEach(transaction => {
        if (transaction.type === 'expense') {
            expensesByCategory[transaction.category] = (expensesByCategory[transaction.category] || 0) + transaction.amount;
        }
    });
    expensesChart.data.labels = Object.keys(expensesByCategory);
    expensesChart.data.datasets[0].data = Object.values(expensesByCategory);
    expensesChart.update();
}

transactionForm.addEventListener('submit', addTransaction);
initializeChart();
renderTransactions();
updateSummary();
updateChart();