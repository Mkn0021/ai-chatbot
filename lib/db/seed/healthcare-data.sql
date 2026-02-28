-- =============================
-- Departments
-- =============================
INSERT INTO departments (name, floor, annual_budget) VALUES
('Cardiology', 2, 2500000),
('Neurology', 3, 1800000),
('Orthopedics', 4, 2200000),
('Pediatrics', 1, 1500000),
('Emergency', 0, 3000000),
('Oncology', 5, 2700000);

-- =============================
-- Doctors (30)
-- =============================
INSERT INTO doctors (full_name, department_id, hire_date, salary)
SELECT 
    'Dr. ' || md5(random()::text),
    (random()*5 + 1)::int,
    CURRENT_DATE - (random()*2000)::int,
    90000 + (random()*80000)
FROM generate_series(1,30);

-- =============================
-- Patients (500)
-- =============================
INSERT INTO patients (full_name, gender, birth_date, city)
SELECT 
    'Patient_' || gs,
    CASE WHEN random() > 0.5 THEN 'Male' ELSE 'Female' END,
    DATE '1960-01-01' + (random()*20000)::int,
    (ARRAY['New York','Chicago','Houston','Boston','Seattle','Denver'])[floor(random()*6+1)]
FROM generate_series(1,500) gs;

-- =============================
-- Treatments (12)
-- =============================
INSERT INTO treatments (name, department_id, base_cost, avg_duration_minutes)
SELECT
    'Treatment_' || gs,
    (random()*5 + 1)::int,
    200 + (random()*800),
    20 + (random()*120)::int
FROM generate_series(1,12) gs;

-- =============================
-- Appointments (1000, 24 months trend)
-- =============================
INSERT INTO appointments (patient_id, doctor_id, treatment_id, appointment_date, status, total_cost)
SELECT
    (random()*499 + 1)::int,
    (random()*29 + 1)::int,
    (random()*11 + 1)::int,
    DATE '2024-01-01' + (random()*730)::int,
    (ARRAY['Completed','Cancelled','No-Show'])[floor(random()*3+1)],
    200 + (random()*1000)
FROM generate_series(1,1000);

-- =============================
-- Payments (Completed only)
-- =============================
INSERT INTO payments (appointment_id, amount, payment_date, method)
SELECT
    a.id,
    a.total_cost,
    a.appointment_date + (random()*5)::int,
    (ARRAY['Cash','Card','Insurance'])[floor(random()*3+1)]
FROM appointments a
WHERE a.status = 'Completed';

-- =============================
-- Monthly Department Metrics (24 months x 6 departments)
-- Seasonal + growth + anomalies
-- =============================
INSERT INTO monthly_department_metrics (
    department_id,
    month,
    patient_count,
    revenue,
    cost,
    success_rate
)
SELECT
    d.id,
    m.month,
    -- patient count with seasonal spike in Jan & Dec
    (200 + (EXTRACT(MONTH FROM m.month) IN (1,12))::int * 80 
     + (random()*50) + (EXTRACT(YEAR FROM m.month)-2024)*20)::int,

    -- revenue with growth trend
    100000 
    + (EXTRACT(YEAR FROM m.month)-2024)*15000
    + (EXTRACT(MONTH FROM m.month)*2000)
    + (random()*20000),

    -- cost lower than revenue
    70000 
    + (EXTRACT(YEAR FROM m.month)-2024)*10000
    + (EXTRACT(MONTH FROM m.month)*1500)
    + (random()*15000),

    -- success rate between 85-98
    85 + (random()*13)
FROM departments d
CROSS JOIN (
    SELECT generate_series(
        DATE '2024-01-01',
        DATE '2025-12-01',
        INTERVAL '1 month'
    )::date AS month
) m;