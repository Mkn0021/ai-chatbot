# Healthcare Analytics Demo Database

Ready-to-use demo database with realistic multi-department hospital data for testing analytics, dashboards, and AI-driven insights.

## 📦 What's Inside

- **6 Departments** (Cardiology, Neurology, Orthopedics, Pediatrics, Emergency, Oncology)
- **30 Doctors** distributed across departments
- **500 Patients** across multiple cities
- **12 Treatment Types**
- **1000 Appointments** spanning 24 months (Jan 2024 – Dec 2025)
- **Seasonal patterns** (Q1 & Q4 patient spikes)
- **Revenue growth trend** over 2 years
- **Department-level KPIs** including revenue, cost, patient count, and success rate

Designed specifically for:
- 📈 Area charts (multi-metric time series)
- 📉 Line charts (trend analysis)
- 📊 Bar charts (category comparison)
- 🥧 Pie charts (distribution breakdown)
- 🟢 Radial charts (performance comparison)
- 🏆 Ranking charts (top performers)

---

## 🚀 Quick Start

Run the setup script to create and populate the database:

```bash
cd lib/db/seed
./setup-healthcare-db.sh
```

That’s it. The database will be running on:

```
localhost:5433
```

---

## 🔗 Connection Details

```
postgresql://demo:demo123@localhost:5433/healthcare_demo
```

---

## 💡 Example AI Queries You Can Test

- "Show monthly hospital revenue and cost trends"
- "Which department has the highest success rate?"
- "Compare revenue vs cost by department"
- "Show patient distribution by department"
- "Who are the top 10 revenue-generating doctors?"
- "Show appointment trends for the last 12 months"

---

## 📊 Example Analytical Queries

### Area Chart — Revenue, Cost, Patients Over Time

```sql
SELECT 
    month,
    SUM(revenue) AS total_revenue,
    SUM(cost) AS total_cost,
    SUM(patient_count) AS total_patients
FROM monthly_department_metrics
GROUP BY month
ORDER BY month;
```

---

### Line Chart — Appointment Trend (Last 12 Months)

```sql
SELECT 
    date_trunc('month', appointment_date) AS month,
    COUNT(*) AS total_appointments
FROM appointments
WHERE appointment_date >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY month
ORDER BY month;
```

---

### Bar Chart — Revenue vs Cost by Department

```sql
SELECT 
    d.name,
    SUM(m.revenue) AS revenue,
    SUM(m.cost) AS cost
FROM monthly_department_metrics m
JOIN departments d ON d.id = m.department_id
GROUP BY d.name
ORDER BY revenue DESC;
```

---

### Pie Chart — Patient Distribution by Department

```sql
SELECT 
    d.name,
    SUM(m.patient_count) AS total_patients
FROM monthly_department_metrics m
JOIN departments d ON d.id = m.department_id
GROUP BY d.name;
```

---

### Radial Chart — Average Success Rate by Department

```sql
SELECT 
    d.name,
    ROUND(AVG(m.success_rate),2) AS avg_success_rate
FROM monthly_department_metrics m
JOIN departments d ON d.id = m.department_id
GROUP BY d.name;
```

---

### Ranking Chart — Top 10 Doctors by Revenue

```sql
SELECT 
    doc.full_name,
    SUM(p.amount) AS total_revenue
FROM payments p
JOIN appointments a ON a.id = p.appointment_id
JOIN doctors doc ON doc.id = a.doctor_id
GROUP BY doc.full_name
ORDER BY total_revenue DESC
LIMIT 10;
```

---

## 🛠 Commands

```bash
# Start database (if container stopped)
docker start healthcare-demo-db

# Stop database
docker stop healthcare-demo-db

# Remove container
docker rm -f healthcare-demo-db

# Reset everything (clean slate)
./setup-healthcare-db.sh

# View logs
docker logs healthcare-demo-db
```

---

## 🗂 Database Schema

- `departments` — Hospital departments and budgets
- `doctors` — Medical staff with department assignments
- `patients` — Patient demographic data
- `treatments` — Treatment catalog
- `appointments` — Appointment records (time-series base)
- `payments` — Revenue transactions
- `monthly_department_metrics` — Pre-aggregated KPIs for analytics

---

## 🎯 Files

- `healthcare-schema.sql` — Table definitions with indexes
- `healthcare-data.sql` — Realistic seed data (generated via SQL)
- `setup-healthcare-db.sh` — One-command setup script

---

## 📈 Data Characteristics

- 24 months of structured data (2024–2025)
- Built-in seasonal spikes
- Revenue growth trend (~8–12%)
- Department-level performance variance
- Success rates between 85%–98%
- Realistic revenue-cost margins
- Suitable for BI tools, dashboards, and AI analytics testing