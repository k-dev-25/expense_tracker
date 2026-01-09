# Expense Tracker 💸

A feature-rich expense tracker built using **vanilla JavaScript**, **HTML**, and **Tailwind CSS**.  
The app supports expense tracking, live currency conversion, local persistence, and robust error handling.

Live Demo: *(add your GitHub Pages link here)*

---

## Features ✨

### Core Functionality
- Add expenses with:
  - Amount
  - Category
  - Date
  - Optional note
- View expenses in:
  - Table layout (desktop)
  - Card layout (mobile)
- Delete expenses instantly
- Expenses are sorted by **most recent date first**

---

## Totals 📊
- **Total Today**
- **Total for Current Month**
- Totals automatically update when:
  - Adding an expense
  - Deleting an expense
  - Switching currency

---

## Currency Conversion 💱

- **Base currency:** INR
- Supported currencies:
  - INR
  - USD
  - EUR
- Live exchange rates fetched from:
[https://open.er-api.com/v6/latest/INR](https://open.er-api.com/v6/latest/INR)


### How it works
- All expenses are stored internally in **INR**
- Currency conversion happens **only during rendering**
- Switching currency does **not** mutate stored expense data
- Selected currency persists across page reloads

---

## Smart Caching & Error Handling 🧠

- Exchange rates are:
  - Cached in `localStorage`
  - Refetched only once every **24 hours**
- If the API fails:
  - The app continues using cached rates
  - Currency selector is disabled if no rates are available
  - A graceful alert informs the user
- The app never crashes due to API failure

---

## Persistence 💾

The app uses `localStorage` to persist:
- Expenses list
- Selected currency
- Cached exchange rates
- Last exchange-rate fetch timestamp

No backend or database required.

---

## Tech Stack 🛠️

- HTML5
- Tailwind CSS
- Vanilla JavaScript (ES6+)
- ExchangeRate API (open.er-api.com)
- GitHub Pages for deployment

---

## Project Structure 📁

```
expense_tracker/
├── dist/
│   └── output.css
├── src/
│   ├── input.css
│   └── script.js
├── index.html
├── package.json
└── README.md
```

---

## Key Concepts Used 🧩

- DOM manipulation
- Event delegation
- Derived UI rendering
- localStorage persistence
- API integration with async/await
- Error handling using try/catch
- Time-based cache invalidation
- Clean separation of concerns:
  - convertAmount()
  - formatAmount()
  - updateTotals()
  - renderExpenses()

---

## Known Limitations 🚧

- No backend or authentication
- Currency list is limited (easy to extend)
- Depends on third-party API availability

---

## Possible Improvements 🔮

- Category-wise analytics
- Monthly charts
- CSV export
- Dark mode
- Progressive Web App (PWA) support

---

## Author ✍️

Built by **Kushal**  
A learning-first project built from scratch without frameworks.
