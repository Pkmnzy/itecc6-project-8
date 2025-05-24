# Express Server

This folder contains the backend server application for the Contact Manager project. It is built with Node.js and Express, and provides RESTful API endpoints for managing contacts, including CRUD operations, search, filter, and export (JSON/CSV). 
## API Endpoints

### Get all contacts
- `GET /api/contacts`
- Query params: `search` (string), `relationship` (string)

### Get a single contact
- `GET /api/contacts/:id`

### Add a new contact
- `POST /api/contacts`
- Body: `{ name: string (required), email: string, phone: string, address: string, relationship: string, notes: string }`
- Validation: `name` is required, `email` must be valid if provided

### Update a contact
- `PUT /api/contacts/:id`
- Body: `{ name?: string, email?: string, phone?: string, address?: string, relationship?: string, notes?: string }`
- Validation: `name` (if provided) must not be empty, `email` (if provided) must be valid

### Delete a contact
- `DELETE /api/contacts/:id`

### Export contacts as JSON
- `GET /api/contacts-export/json`

### Export contacts as CSV
- `GET /api/contacts-export/csv`

### Get all unique relationship types
- `GET /api/relationships`
