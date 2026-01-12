document.addEventListener("DOMContentLoaded", async () => {
  let expenses = [];

  let rates = {};

  const select = document.querySelector("select");

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
  const amountError = document.querySelector(".amount-error");
  const dateError = document.querySelector(".date-error");

  let currency = select.value;

  select.addEventListener("change", () => {
    currency = select.value;
    localStorage.setItem("currency", currency);
    renderExpenses();
  });

  amountInput.addEventListener("input", () => {
    if (validateAmount(amountInput.value)) clearAmountError();
    else showAmountError("Please enter a valid positive number");
  });

  dateInput.addEventListener("change", () => {
    const result = validateDate(dateInput.value);
    if (result === "Valid") clearDateError();
    else showDateError(result);
  });

  async function getExchangeRates() {
    const currentTime = Date.now();
    let lastTime = JSON.parse(localStorage.getItem("lastTime"));
    if (lastTime === null || currentTime - lastTime > 24 * 60 * 60 * 1000) {
      try {
        const response = await fetch("https://open.er-api.com/v6/latest/INR");
        const data = await response.json();
        rates = data["rates"];
        lastTime = currentTime;
        localStorage.setItem("rates", JSON.stringify(rates));
        localStorage.setItem("lastTime", lastTime);
      } catch {
        alert(
          "New rates could not be fetched, but app will work with old rates."
        );
        rates = JSON.parse(localStorage.getItem("rates")) || {};
      }
    }
    if (Object.keys(rates).length === 0) select.disabled = true;
  }

  await getExchangeRates();

  function convertAmount(amount) {
    if (currency === "INR") return amount;

    const rate = rates[currency];
    if (typeof rate !== "number") return amount;

    return amount * rate;
  }

  function formatAmount(amount) {
    amount = amount.toFixed(2);
    if (currency === "INR") return `₹ ${amount}`;
    else if (currency === "USD") return `$ ${amount}`;
    else return `€ ${amount}`;
  }

  function validateAmount(rawAmount) {
    const amount = rawAmount.trim();
    if (amount === "") return false;
    let numbers = Number(amount);
    if (Number.isNaN(numbers)) return false;
    if (numbers <= 0) return false;
    return true;
  }

  function validateDate(rawDate) {
    if (rawDate === "") return "Empty";
    const inputDate = new Date(rawDate);
    const todayDate = new Date();
    const lastAllowedDate = new Date("1970-01-01");
    inputDate.setHours(0, 0, 0, 0);
    todayDate.setHours(0, 0, 0, 0);
    lastAllowedDate.setHours(0, 0, 0, 0);
    if (inputDate < lastAllowedDate) return "Too Old";
    if (inputDate > todayDate) return "Future"
    return "Valid";
  }

  function showAmountError(message) {
    amountInput.classList.remove("focus:ring-blue-500");
    amountInput.classList.add("focus:ring-red-400");
    amountInput.classList.add("border-red-500");
    amountError.textContent = message;
    amountError.classList.remove("hidden");
  }

  function showDateError(result) {
    dateInput.classList.remove("focus:ring-blue-500");
    dateInput.classList.add("focus:ring-red-400");
    dateInput.classList.add("border-red-500");
    let error = "";
    if (result === "Empty") error = "Please select a Date";
    else if (result === "Too Old") error = "Date cannot be earlier than 1970";
    else if (result === "Future") error = "Date cannot be in the future";
    dateError.textContent = error;
    dateError.classList.remove("hidden");
  }

  function clearAmountError() {
    amountInput.classList.add("focus:ring-blue-500");
    amountInput.classList.remove("focus:ring-red-400");
    amountInput.classList.remove("border-red-500");
    amountError.textContent = "";
    amountError.classList.add("hidden");
  }

  function clearDateError() {
    dateInput.classList.add("focus:ring-blue-500");
    dateInput.classList.remove("focus:ring-red-400");
    dateInput.classList.remove("border-red-500");
    dateError.textContent = "";
    dateError.classList.add("hidden");
  }

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
    totalToday.innerText = formatAmount(convertAmount(todayTotal));
    totalMonth.innerText = formatAmount(convertAmount(monthTotal));
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    clearAmountError();
    clearDateError();
    if (!validateAmount(amountInput.value)) {
      showAmountError("Please enter a valid positive number");
      return;
    }
    const dateValidation = validateDate(dateInput.value);
    if (dateValidation !== "Valid") {
      showDateError(dateValidation);
      return;
    }

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

  const savedCurrency = localStorage.getItem("currency");
  if (savedCurrency !== null) {
    currency = savedCurrency;
    select.value = savedCurrency;
  }

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
    const sortedExpenses = [...expenses].sort((a, b) =>
      b.date.localeCompare(a.date)
    );
    sortedExpenses.forEach((expense) => {
      const row = document.createElement("tr");
      row.className = "border-b border-gray-100";
      row.innerHTML = `
                <td class="p-4 text-gray-500">${expense.date
                  .split("-")
                  .reverse()
                  .join("/")}</td>
                <td class="p-4 text-gray-500">${expense.category}</td>
                <td class="p-4 font-medium">${formatAmount(
                  convertAmount(expense.amount)
                )}</td>
                <td class="p-4">
                    <button class="delete-btn bg-red-500 rounded-lg text-white py-1 px-3 text-sm hover:bg-red-600 transition-colors" data-id="${
                      expense.id
                    }">
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
                    <div class="font-medium">${formatAmount(
                      convertAmount(expense.amount)
                    )}</div>
                </div>
                <div class="row2 flex justify-between gap-4">
                    <div class="text-gray-500">${expense.date}</div>
                    <div>
                        <button class="delete-btn bg-red-500 rounded-lg text-white py-1 px-3 text-sm hover:bg-red-600 transition-colors" data-id="${
                          expense.id
                        }">
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
