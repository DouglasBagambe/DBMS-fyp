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

-- Add indexes for performance
CREATE INDEX idx_driver_sessions_token ON driver_sessions(token);
CREATE INDEX idx_driver_sessions_driver_id ON driver_sessions(driver_id); 