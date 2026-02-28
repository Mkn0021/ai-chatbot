-- Drop existing objects safely
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS treatments CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS monthly_department_metrics CASCADE;

-- =============================
-- Departments
-- =============================
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    floor INT NOT NULL,
    annual_budget NUMERIC(12,2) NOT NULL
);

-- =============================
-- Doctors
-- =============================
CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    department_id INT NOT NULL REFERENCES departments(id),
    hire_date DATE NOT NULL,
    salary NUMERIC(10,2) NOT NULL
);

CREATE INDEX idx_doctors_department ON doctors(department_id);

-- =============================
-- Patients
-- =============================
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    birth_date DATE NOT NULL,
    city VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_patients_city ON patients(city);

-- =============================
-- Treatments
-- =============================
CREATE TABLE treatments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    department_id INT NOT NULL REFERENCES departments(id),
    base_cost NUMERIC(10,2) NOT NULL,
    avg_duration_minutes INT NOT NULL
);

CREATE INDEX idx_treatments_department ON treatments(department_id);

-- =============================
-- Appointments (time-series base)
-- =============================
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL REFERENCES patients(id),
    doctor_id INT NOT NULL REFERENCES doctors(id),
    treatment_id INT NOT NULL REFERENCES treatments(id),
    appointment_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    total_cost NUMERIC(10,2) NOT NULL
);

CREATE INDEX idx_appointments_date ON appointments(appointment_date);

-- =============================
-- Payments
-- =============================
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    appointment_id INT NOT NULL REFERENCES appointments(id),
    amount NUMERIC(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    method VARCHAR(50) NOT NULL
);

-- =============================
-- Monthly Aggregated Metrics (for area/line charts)
-- =============================
CREATE TABLE monthly_department_metrics (
    id SERIAL PRIMARY KEY,
    department_id INT NOT NULL REFERENCES departments(id),
    month DATE NOT NULL,
    patient_count INT NOT NULL,
    revenue NUMERIC(12,2) NOT NULL,
    cost NUMERIC(12,2) NOT NULL,
    success_rate NUMERIC(5,2) NOT NULL
);

CREATE INDEX idx_monthly_metrics_month ON monthly_department_metrics(month);
CREATE INDEX idx_monthly_metrics_department ON monthly_department_metrics(department_id);