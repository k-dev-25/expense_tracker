# Expense Tracker 💸

A feature-rich expense tracker built using **vanilla JavaScript**, **HTML**, and **Tailwind CSS**.  
The app supports expense tracking, live currency conversion, local persistence, and robust error handling.

## Getting Started 🚀

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/k-dev-25/expense-tracker.git
cd expense-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Build Tailwind CSS:
```bash
npm run build
```

4. For development with live CSS rebuild:
```bash
npm run dev
```

5. Open `index.html` in your browser or use a local server:
```bash
python3 -m http.server 8000
# or
npx serve
```

Then visit `http://localhost:8000` in your browser.

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
- **Export to CSV** - Download all expenses as a CSV file for use in Excel, Google Sheets, or other tools

### Totals 📊
- **Total Today** - Sum of all expenses from today
- **Total for Current Month** - Sum of all expenses from the current month
- Totals automatically update when:
  - Adding an expense
  - Deleting an expense
  - Switching currency

---

### Currency Conversion 💱

- **Base currency:** INR
- **Supported currencies:** INR, USD, EUR
- **Live exchange rates** fetched from: [ExchangeRate-API](https://open.er-api.com/v6/latest/INR)

#### How it works
- All expenses are stored internally in **INR**
- Currency conversion happens **only during rendering**
- Switching currency does **not** mutate stored expense data
- Selected currency persists across page reloads

### Smart Caching & Error Handling 🧠

- Exchange rates are:
  - Cached in `localStorage`
  - Refetched only once every **24 hours**
- If the API fails:
  - The app continues using cached rates
  - Currency selector is disabled if no rates are available
  - A graceful alert informs the user
- The app never crashes due to API failure

### Persistence 💾

The app uses `localStorage` to persist:
- Expenses list
- Selected currency
- Cached exchange rates
- Last exchange-rate fetch timestamp

No backend or database required.

---

## Tech Stack 🛠️

- **HTML5**
- **Tailwind CSS v4** (with CLI)
- **Vanilla JavaScript** (ES6+)
- **ExchangeRate API** (open.er-api.com)
- **localStorage** for data persistence

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
  - buildCSV()
  - downloadCSV()

---

## Known Limitations 🚧

- No backend or authentication
- Currency list is limited (easy to extend)
- Depends on third-party API availability

---

## Possible Improvements 🔮

- 📊 Category-wise analytics and visualizations
- 📈 Monthly spending charts
- 📄 PDF export functionality
- 🌙 Dark mode toggle
- 📱 Progressive Web App (PWA) support
- 🔍 Search and filter expenses
- 🏷️ Custom categories management
- 🔄 Budget tracking and alerts

---

## Author ✍️

Built by **Kushal**  
A learning-first project built from scratch without frameworks.

---

## License 📜

MIT License - feel free to use this project for learning and personal use.
