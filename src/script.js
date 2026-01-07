document.addEventListener("DOMContentLoaded", () => {
  let expenses = [];

  const totalToday = document.querySelector(".totalToday");
  const totalMonth = document.querySelector(".totalMonth");

  const form = document.querySelector("form");
  const amountInput = document.getElementById("amount");
  const categoryInput = document.getElementById("category");
  const dateInput = document.getElementById("date");
  const noteInput = document.getElementById("note");

  const expensesTableBody = document.querySelector(".expensesTable tbody");
  const expensesCardsContainer = document.querySelector(".expensesCards");
  const expensesList = document.querySelector(".expensesList");
  const emptyState = document.querySelector(".noExpenses");

  function updateTotals() {
    if (expenses.length === 0) {
      totalToday.innerText = "0.00";
      totalMonth.innerText = "0.00";
      return;
    }
    let date = new Date();
    date = date.toISOString().split("T")[0];
    const today = date;
    const month = date.slice(0, 7);
    let todayTotal = 0;
    let monthTotal = 0;
    expenses.forEach((expense) => {
      if (expense.date === today) todayTotal += expense.amount;
      if (expense.date.slice(0, 7) === month) monthTotal += expense.amount;
    });

    totalToday.innerText = todayTotal.toFixed(2);
    totalMonth.innerText = monthTotal.toFixed(2);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (Number(amountInput.value) <= 0) return;
    const expense = {
      id: Date.now(),
      amount: Number(amountInput.value),
      category: categoryInput.value.trim(),
      date: dateInput.value,
      note: noteInput.value.trim(),
    };
    expenses.push(expense);
    amountInput.value = "";
    categoryInput.value = "";
    dateInput.value = "";
    noteInput.value = "";
    updateTotals();
    saveExpenses();
    renderExpenses();
  });

  function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }

  function loadExpenses() {
    const stored = localStorage.getItem("expenses");
    expenses = stored ? JSON.parse(stored) : [];
  }

  loadExpenses();

  function renderExpenses() {
    if (expenses.length === 0) {
      emptyState.classList.remove("hidden");
      expensesList.classList.add("hidden");
    } else {
      emptyState.classList.add("hidden");
      expensesList.classList.remove("hidden");
    }

    updateTotals();
    expensesTableBody.innerHTML = "";
    expensesCardsContainer.innerHTML = "";
    sortedExpenses = [...expenses].sort((a, b) => b.date.localeCompare(a.date))
    sortedExpenses.forEach((expense) => {
      const row = document.createElement("tr");
      row.className = "border-b border-gray-100";
      row.innerHTML = `
                <td class="p-4 text-gray-500">${expense.date.split("-").reverse().join("/")}</td>
                <td class="p-4 text-gray-500">${expense.category}</td>
                <td class="p-4 font-medium">${expense.amount}</td>
                <td class="p-4">
                    <button class="delete-btn bg-red-500 rounded-lg text-white py-1 px-3 text-sm hover:bg-red-600 transition-colors" data-id="${expense.id}">
                        Delete
                    </button>
                </td>
            `;
      expensesTableBody.appendChild(row);

      const card = document.createElement("div");
      card.className =
        "w-full border-b border-gray-200 p-4 flex flex-col gap-4";
      card.innerHTML = `
                <div class="row1 flex justify-between gap-4">
                    <div class="text-gray-500">${expense.category}</div>
                    <div class="font-medium">${expense.amount}</div>
                </div>
                <div class="row2 flex justify-between gap-4">
                    <div class="text-gray-500">${expense.date}</div>
                    <div>
                        <button class="delete-btn bg-red-500 rounded-lg text-white py-1 px-3 text-sm hover:bg-red-600 transition-colors" data-id="${expense.id}">
                            Delete
                        </button>
                    </div>
                </div>
            `;
      expensesCardsContainer.appendChild(card);
    });
  }

  expensesList.addEventListener("click", (e) => {
    if (!e.target.classList.contains("delete-btn")) return;

    const button = e.target;
    const buttonId = Number(button.dataset.id);
    expenses = expenses.filter((expense) => expense.id !== buttonId);
    saveExpenses();
    renderExpenses();
  });

  renderExpenses();
});
