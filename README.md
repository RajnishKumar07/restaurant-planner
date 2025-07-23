



This project provides a dynamic **restaurant planning interface** built in **Angular standalone** with **Syncfusion Scheduler**, allowing users to manage tables and create time-slot-based reservations visually.




### 1. Clone the repository

#### Using HTTPS:
```bash
git clone https://github.com/RajnishKumar07/restaurant-planner.git
cd restaurant-planner
````

#### OR using SSH (if configured):

```bash
git clone git@github.com:RajnishKumar07/restaurant-planner.git
cd restaurant-planner
```




### 2. Install dependencies with legacy peer support

```bash
npm install --legacy-peer-deps
```

### 3. Start the development server

```bash
npm start
```

### 4. Open the app in your browser

Navigate to: [http://localhost:4200](http://localhost:4200)

---

## 📦 Technologies Used

* **Angular 18+** with **Standalone Components**
* **Syncfusion Scheduler** (`@syncfusion/ej2-angular-schedule`)[Demo](https://ej2.syncfusion.com/angular/demos/?_gl=1*1bin2th*_ga*MzQ5MTgxMzE3LjE3NTMyNzkxMzI.*_ga_41J4HFMX1J*czE3NTMyNzkxMzEkbzEkZzEkdDE3NTMyNzkyOTUkajYwJGwwJGgw#/bootstrap5/schedule/adaptive-rows)
* **Bootstrap 5** (for responsive layout)
* **SCSS** (modular component styling)
* **Signal-based State Management** (`@angular/core`)
* **Toastr** (`ngx-toastr`) for user notifications

---

## 🧠 Key Decisions & Assumptions

* The **TimelineDay** view is used to show reservations per table.
* Tables are defined as **resources** and grouped visually.
* Reservations are dynamically assigned to the most suitable table based on:

  * Availability (no time overlap)
  * Sufficient capacity (nearest fit)
* Data is managed using `signal` and `computed()` via `PlannerService`.
* Table and reservation creation use **modal dialogs**.
* Start/End times are stored as **ISO strings** and transformed to `Date` objects for Syncfusion rendering.
* Scheduler integration guided with help from ChatGPT.
* Stylesheet from Syncfusion is loaded via CDN:

  ```html
  <link href="https://cdn.syncfusion.com/ej2/30.1.37/tailwind3.css" rel="stylesheet" />
  ```


