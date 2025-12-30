
# 📊 React Smart Sheet SPA

A high-performance, web-based spreadsheet application built with **React**. This project mimics the core functionality of Microsoft Excel, featuring a powerful calculation engine, real-time data binding, and custom formula support.

## 🚀 Technologies Used

This Single Page Application (SPA) is built using the following industry-standard libraries:

* **[React.js](https://reactjs.org/):** Component-based UI architecture.
* **[Handsontable](https://handsontable.com/):** The core data grid component providing the Excel-like look and feel.
* **[HyperFormula](https://hyperformula.handsontable.com/):** A high-speed calculation engine (the "brain" behind the formulas) that parses and evaluates complex spreadsheet logic.
* **[Lucide React](https://lucide.dev/):** Lightweight and consistent icon library for the UI toolbar.

---

## ✨ Key Features

* **Spreadsheet Interface:** Fully functional grid with row/column headers, resizing, and selection.
* **Formula Engine:** Supports standard arithmetic and referencing (e.g., `=A1+B1`).
* **Formatting:** Ability to toggle **Bold** text for selected cells.
* **Custom Functions:** Unique formulas developed specifically for this application.
Here is the updated **README.md**. I have updated the **Installation** section to include the specific command and packages you listed, and I have expanded the **Custom Functions** section to include the detailed logic for `FULLNAME` (capitalization) and `RATING` (stars/custom limits), while also emphasizing that standard Excel functions are built-in.


## 🚀 Technologies & Packages

This Single Page Application (SPA) is built using the following industry-standard libraries.

### Installation
To install all required dependencies, run:

```bash
npm install @handsontable/react handsontable hyperformula lucide-react

```

### Package Breakdown

* **React & React DOM:** (Core framework)
* **@handsontable/react:** The React wrapper for the grid component.
* **handsontable:** The core library providing the spreadsheet grid and interaction.
* **hyperformula:** The advanced calculation engine that parses formulas and manages data dependencies.
* **lucide-react:** A clean, lightweight icon set for the UI toolbar.

---

## ✨ Features & Capabilities

### 1. 🧮 300+ Built-in Excel Functions

Powered by HyperFormula, this application supports standard spreadsheet functions out of the box. You can use:

* **Math:** `=SUM(A1:A5)`, `=AVERAGE(B1:B10)`, `=MAX(C1:C5)`
* **Logic:** `=IF(A1>10, "Pass", "Fail")`, `=AND()`, `=OR()`
* **Text:** `=UPPER()`, `=LOWER()`, `=CONCATENATE()`

### 2. 🛠️ Custom Functions (Smart Logic)

We have extended the engine with unique functions tailored for this application.

#### ➤ `FULLNAME` (Smart Capitalization)

Joins names together and automatically fixes capitalization (converts mixed case to Title Case).

**Syntax:** `=FULLNAME(text1, [text2])`

| Input Formula | Output Result | Logic Applied |
| --- | --- | --- |
| `=FULLNAME("john", "doe")` | **John Doe** | Capitalizes first letters |
| `=FULLNAME("jOhN", "sMItH")` | **John Smith** | Fixes mixed/messy casing |
| `=FULLNAME("ALICE", "WONDERLAND")` | **Alice Wonderland** | Fixes all caps |
| `=FULLNAME("michael")` | **Michael** | Handles single arguments |
| `=FULLNAME("john henry doe")` | **John Henry Doe** | Handles full strings |

#### ➤ `RATING` (Visual Star System)

Converts numeric scores into a visual star rating string. It supports custom maximum scales (default is 5).

**Syntax:** `=RATING(score, [max_stars])`

| Input Formula | Output Result | Logic Applied |
| --- | --- | --- |
| `=RATING(3)` | ★★★☆☆ | Standard 5-star scale |
| `=RATING(5)` | ★★★★★ | Full rating |
| `=RATING(0)` | ☆☆☆☆☆ | Zero rating |
| `=RATING(3.5)` | ★★★⭐☆ | Supports half-star logic |
| `=RATING(4.7)` | ★★★★★ | Rounds to nearest whole star |
| `=RATING(7, 10)` | ★★★★★★★☆☆☆ | **Custom Max:** 7 out of 10 |

---

## ⚙️ How to Run Locally

**1. Clone the Repository**

```bash
git clone [https://github.com/your-username/react-excel-clone.git](https://github.com/your-username/react-excel-clone.git)
cd react-excel-clone

```

**2. Install Dependencies**

```bash
npm install

```

**3. Run the Development Server**

```bash
npm run dev

```

**4. Open in Browser**
Visit `http://localhost:5173` to start using the spreadsheet.

---

## 📂 Project Structure

```bash
src/
├── components/
│   ├── FormulaBar.jsx   # Input bar for editing cell values
│   └── Toolbar.jsx      # Formatting buttons (Bold, etc.)
├── plugins/             # Custom Formula Logic
│   └── FullNamePlugin.js # Smart Capitalization Logic
│   └── RatingPlugin.js   # Star Rating Logic
├── Spreadsheet.jsx      # Main Grid & Engine Configuration
├── App.jsx              # Root Component
└── main.jsx             # Entry Point

```

---

**Developed by Srilakshmi Mounika Bandaru**

```
