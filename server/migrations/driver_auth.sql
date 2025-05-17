-- Add authentication columns to drivers table
ALTER TABLE drivers
ADD COLUMN password_hash VARCHAR(255),
ADD COLUMN password_changed BOOLEAN DEFAULT FALSE,
ADD COLUMN last_login TIMESTAMP;

-- Create driver sessions table
CREATE TABLE driver_sessions (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER REFERENCES drivers(id),
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    device_info JSONB,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create driver activity logs table
CREATE TABLE driver_activity_logs (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER REFERENCES drivers(id),
    activity_type VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    location_data JSONB,
    vehicle_id INTEGER REFERENCES vehicles(id)
);

-- Add indexes for performance
CREATE INDEX idx_driver_sessions_token ON driver_sessions(token);
CREATE INDEX idx_driver_sessions_driver_id ON driver_sessions(driver_id);
CREATE INDEX idx_driver_activity_logs_driver_id ON driver_activity_logs(driver_id);
CREATE INDEX idx_driver_activity_logs_created_at ON driver_activity_logs(created_at); 