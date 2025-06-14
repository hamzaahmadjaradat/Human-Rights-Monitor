# Human Rights Monitor

A comprehensive web-based system for documenting, managing, and analyzing human rights violations. Built to support NGOs, journalists, and human rights defenders in conflict-affected regions, the system offers efficient case management, data visualization, and multilingual support for structured reporting.

---

## 🧩 Project Structure

### 🔹 Backend – FastAPI (Python)

Organized under `backend/app/`:

#### ➤ `controllers/`
Handles core logic for each domain:

- **`caseController.py`** – Add, retrieve, update status, and archive human rights cases.
- **`analyticsController.py`** – Aggregate case statistics for charts.
- **`IndividualController.py`** – Manage individuals (victims/perpetrators).
- **`reportController.py`** – (To be implemented) Generate exports and reports.

#### ➤ `routes/`
Links HTTP endpoints to controller logic:

- **`caseRoutes.py`**
- **`analyticsRoutes.py`**
- **`IndividualRoutes.py`**
- **`reportRoutes.py`**

#### ➤ `database.py`
MongoDB connection and setup.

#### ➤ `main.py`
Main FastAPI app instance with router registration.

---

### 🔹 Frontend – React (JSX)

Located under `frontend/src/`:

#### ➤ `cases/`
- `CasesDemonstration.jsx` – Case listing with filter UI.
- `AddCaseModal.jsx` – Modal for case creation.
- `caseCard.jsx` – Compact card component for case preview.
- `CaseDetails.jsx` – Full detail view for a selected case.
- `CaseManagement.jsx` – Admin panel for managing cases.
- `caseStatusUpdate.jsx` – Component to handle updating status.
- `UpdateCaseStatusModal.jsx` – Modal for status change.
- `casesCss/` – Styles for the above components.

#### ➤ `Analytics/`
- `AnalyticsPage.jsx` – Visualization dashboard (bar chart, pie chart, etc).
- `AnalyticsCss/` – Dedicated styles for analytics components.

---

## ✅ Features Implemented So Far

### 📝 Case Management
- Add new cases with:
  - Title, Description, Location (region, coordinates)
  - Violation types (multi-select)
  - Evidence uploads
  - Victim/perpetrator linking
  - Start and end dates

- Status Management:
  - Update status (new → under_investigation → resolved)
  - Reason logging & timestamped history
  - Archive functionality

### 🔍 Filtering & Display
- Filters: title, region (West Bank cities), date range, violation type
- Pagination of results
- Responsive design with clean UI for readability

### 📈 Analytics (In Progress)
- Fetch stats per type/region/time via backend API
- Display insights in bar and pie charts

### 🌍 Arabic Content
- All cases and descriptions are written in **Arabic**
- Realistic and localized incident data
- Ready for multilingual UI support

---

## 🗂️ Case Schema Example

```json
{
  "case_id": "HRM-2023-0425",
  "title": "تهجير قسري في محافظة الشمال",
  "description": "تهجير جماعي للسكان بعد عمليات عسكرية مكثفة.",
  "violation_types": ["forced_displacement", "property_destruction"],
  "status": "under_investigation",
  "priority": "high",
  "location": {
    "country": "فلسطين",
    "region": "جنين",
    "coordinates": { "type": "Point", "coordinates": [35.2, 32.5] }
  },
  "date_occurred": "2023-04-15T00:00:00Z",
  "date_reported": "2023-04-20T00:00:00Z",
  "victims": [
    { "$oid": "507f1f77bcf86cd799439012" }
  ],
  "perpetrators": [
    { "name": "اللواء 35", "type": "military_unit" }
  ],
  "evidence": [
    {
      "type": "photo",
      "url": "/evidence/hr0425-1.jpg",
      "description": "منازل مدمرة بعد القصف",
      "date_captured": "2023-04-16T00:00:00Z"
    }
  ],
  "created_by": { "$oid": "507f1f77bcf86cd799439021" },
  "created_at": "2023-04-20T14:30:00Z",
  "updated_at": "2023-04-25T09:15:00Z"
}

🚀 How to Run the Project
cd backend
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload


🖼️ Frontend (React)

cd frontend
npm install
npm start


📸 UI Preview
Case cards with status colors (e.g., "in_progress", "archived")

Smart filters: Region, Title, Date (Start/End), Violation types

Buttons: Add Case, Change Status (Modal), View Details