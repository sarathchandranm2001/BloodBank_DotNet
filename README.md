# Blood Bank Management System

A comprehensive ASP.NET Core Web API application for managing blood bank operations including donor management, recipient management, blood requests, and inventory tracking.

## 🎯 Project Overview

This Blood Bank Management System provides a complete solution for blood banks to manage donors, recipients, blood requests, and inventory efficiently with role-based access control and real-time stock tracking.

## 🚀 Features

### ✅ Completed Features

#### **Authentication & User Management**
- JWT-based authentication with role-based authorization
- User registration and login
- Role management (Admin, Donor, Recipient)
- Password hashing with SHA256
- User profile management (CRUD operations)

#### **Donor Management System**
- Complete donor profile management
- Blood group tracking (A+, A-, B+, B-, AB+, AB-, O+, O-)
- Donation eligibility calculation (90-day rule)
- Last donation date tracking
- Medical history management
- Contact information management
- Donation history tracking

#### **Recipient Management System**
- Recipient profile with hospital and doctor information
- Medical condition tracking
- Complete contact information
- Blood request management
- Request status tracking

#### **Blood Request Management**
- Blood request creation with urgency levels (Low, Medium, High, Critical)
- Request status workflow (Pending → Approved → Fulfilled/Rejected/Cancelled)
- Units requested tracking
- Required by date management
- Doctor notes and admin notes
- Approval and fulfillment audit trail

#### **Blood Inventory Management**
- Real-time stock tracking by blood group
- Available vs reserved units tracking
- Stock location management
- Expiry date tracking (oldest and newest units)
- Low stock alerts (< 10 units)
- Expiring units alerts (within 7 days)
- Stock addition and removal with reasons

#### **Individual Blood Stock Management** ✅ *NEW*
- Individual blood unit tracking with unique stock IDs
- Comprehensive expiry date management and alerts
- Donor batch tracking for traceability
- Storage location assignment
- FIFO (First In, First Out) blood issuing system
- Automated stock level updates during donations/issues
- Low stock alerts (< 5 units per blood group)
- Expiring soon alerts (within 7 days)
- Blood issuing system with audit trail

## 🏗️ Technical Stack

- **Framework**: ASP.NET Core 8.0 Web API
- **Database**: MySQL 8.0 with Entity Framework Core
- **Authentication**: JWT Bearer tokens
- **ORM**: Entity Framework Core with Pomelo MySQL provider
- **Documentation**: Swagger/OpenAPI
- **Security**: Role-based authorization, password hashing

## 📊 Database Schema

### Core Entities

#### Users Table
- `UserId` (Primary Key)
- `Name`, `Email`, `PasswordHash`
- `Role` (Admin=1, Donor=2, Recipient=3)
- `CreatedAt`, `UpdatedAt`

#### Donors Table
- `DonorId` (Primary Key)
- `UserId` (Foreign Key to Users)
- `BloodGroup` (Enum)
- `LastDonationDate`
- `ContactInfo` (Owned Entity: Phone, Address, City, State, ZipCode, Country)
- `MedicalHistory`
- Calculated properties: `IsEligibleToDonate`, `NextEligibleDonationDate`

#### Recipients Table
- `RecipientId` (Primary Key)
- `UserId` (Foreign Key to Users)
- `HospitalName`, `DoctorName`
- `ContactInfo` (Owned Entity)
- `MedicalCondition`

#### BloodRequests Table
- `RequestId` (Primary Key)
- `RecipientId` (Foreign Key to Recipients)
- `BloodGroup`, `UnitsRequested`
- `Urgency` (Low=1, Medium=2, High=3, Critical=4)
- `Status` (Pending=1, Approved=2, Fulfilled=3, Rejected=4, Cancelled=5)
- `RequestReason`, `DoctorNotes`, `AdminNotes`
- `RequestDate`, `RequiredByDate`, `ApprovedDate`, `FulfilledDate`
- `ApprovedBy`, `FulfilledBy` (Foreign Keys to Users)

#### BloodInventory Table
- `InventoryId` (Primary Key)
- `BloodGroup` (Unique)
- `AvailableUnits`, `ReservedUnits`
- `Location`, `Notes`
- `LastUpdated`
- `OldestUnitExpiry`, `NewestUnitExpiry`

#### BloodStocks Table ✅ *NEW*
- `StockId` (Primary Key)
- `BloodGroup` (Indexed for fast queries)
- `UnitsAvailable`, `ExpiryDate` (Indexed)
- `DateAdded`, `DonorBatch`, `StorageLocation`
- `Notes`, `CreatedAt`, `UpdatedAt`
- Computed properties: `IsExpired`, `IsExpiringSoon`, `DaysUntilExpiry`, `IsLowStock`
- Composite index on (BloodGroup, ExpiryDate) for FIFO operations

## 🔗 API Endpoints

### Authentication Endpoints
```
POST /api/users/register    - Register new user
POST /api/users/login       - User login
GET  /api/users             - Get all users (Admin only)
GET  /api/users/{id}        - Get user by ID
PUT  /api/users/{id}        - Update user
DELETE /api/users/{id}      - Delete user (Admin only)
```

### Donor Management Endpoints
```
GET    /api/donors                    - Get all donors (Admin only)
GET    /api/donors/{id}               - Get donor details
POST   /api/donors                    - Create donor profile (Admin only)
PUT    /api/donors/{id}               - Update donor
DELETE /api/donors/{id}               - Delete donor (Admin only)
GET    /api/donors/{id}/eligibility   - Check donation eligibility
GET    /api/donors/{id}/nextdonation  - Get next donation date
GET    /api/donors/{id}/history       - Get donation history
POST   /api/donors/{id}/donate        - Record donation (Admin only)
GET    /api/donors/eligible           - Get eligible donors (Admin only)
GET    /api/donors/bloodgroup/{group} - Get donors by blood group (Admin only)
```

### Recipient Management Endpoints
```
GET  /api/recipients                   - Get all recipients (Admin only)
GET  /api/recipients/{id}              - Get recipient details
POST /api/recipients                   - Create recipient profile (Admin only)
PUT  /api/recipients/{id}              - Update recipient
DELETE /api/recipients/{id}            - Delete recipient (Admin only)
POST /api/recipients/{id}/requests     - Create blood request
GET  /api/recipients/{id}/requests     - Get recipient's requests
GET  /api/recipients/{id}/availability - View blood availability
```

### Blood Inventory Endpoints
```
GET  /api/bloodinventory              - Get all inventory
GET  /api/bloodinventory/{bloodGroup} - Get inventory by blood group
POST /api/bloodinventory/add-stock    - Add stock (Admin only)
POST /api/bloodinventory/remove-stock - Remove stock (Admin only)
GET  /api/bloodinventory/low-stock    - Get low stock items (Admin only)
GET  /api/bloodinventory/expiring-soon - Get expiring items (Admin only)
```

### Blood Stock Management Endpoints ✅ *NEW*
```
GET    /api/bloodstock                      - Get all blood stocks (Admin only)
GET    /api/bloodstock/{id}                 - Get specific blood stock (Admin only)
POST   /api/bloodstock                      - Add new blood stock (Admin only)
PUT    /api/bloodstock/{id}                 - Update blood stock (Admin only)
DELETE /api/bloodstock/{id}                 - Remove blood stock (Admin only)
GET    /api/bloodstock/summary              - Get stock summary by blood group (Admin only)
GET    /api/bloodstock/low-stock-alerts     - Get low stock alerts (Admin only)
GET    /api/bloodstock/expiring-soon        - Get expiring stocks (Admin only)
GET    /api/bloodstock/expired              - Get expired stocks (Admin only)
GET    /api/bloodstock/by-blood-group/{group} - Get stocks by blood group (Admin only)
POST   /api/bloodstock/issue-blood          - Issue blood units (FIFO) (Admin only)
```

## 🔐 Authorization Roles

### Admin
- Full access to all endpoints
- User management
- Donor and recipient management
- Inventory management
- Request approval and fulfillment

### Donor
- View own profile
- Update own profile
- View own donation history
- Check own eligibility

### Recipient
- View own profile
- Update own profile
- Create blood requests
- View own requests
- Check blood availability

## 🗃️ DTOs (Data Transfer Objects)

### User DTOs
- `UserRegistrationDto`, `UserLoginDto`, `UserDto`, `UserUpdateDto`
- `UserLoginResponseDto` (includes JWT token)

### Donor DTOs
- `DonorRegistrationDto`, `DonorDto`, `DonorUpdateDto`
- `DonorEligibilityDto`, `DonationHistoryDto`
- `ContactInfoDto`

### Recipient DTOs
- `RecipientRegistrationDto`, `RecipientDto`, `RecipientUpdateDto`

### Blood Request DTOs
- `BloodRequestCreateDto`, `BloodRequestDto`, `BloodRequestUpdateDto`
- `BloodRequestStatusUpdateDto`

### Inventory DTOs
- `BloodAvailabilityDto`
- `AddStockDto`, `RemoveStockDto`

### Blood Stock DTOs ✅ *NEW*
- `BloodStockCreateDto` - For adding new blood stock
- `BloodStockDto` - Complete stock information with computed properties
- `BloodStockUpdateDto` - For updating existing stock
- `BloodStockSummaryDto` - Summary by blood group with alert indicators
- `LowStockAlertDto` - For low stock notifications
- `IssueBloodDto` - For blood issuing operations

## 🚧 Business Logic

### Donor Eligibility
- Donors must wait 90 days between donations
- Automatic calculation of next eligible donation date
- Real-time eligibility status

### Blood Request Workflow
1. **Pending**: Initial request status
2. **Approved**: Admin approves the request
3. **Fulfilled**: Blood issued and inventory updated
4. **Rejected**: Request denied with admin notes
5. **Cancelled**: Request cancelled

### Inventory Management
- Real-time stock tracking
- Automatic reservation during approval
- Low stock alerts (< 10 units)
- Expiry tracking and alerts
- Location-based storage

### Blood Stock Management ✅ *NEW*
- **FIFO System**: First In, First Out blood issuing
- **Auto-Expiry Detection**: Stocks expire after set date
- **Low Stock Alerts**: Triggered when units < 5 per blood group
- **Expiry Warnings**: Alerts 7 days before expiration
- **Batch Tracking**: Full traceability from donor to recipient
- **Storage Management**: Location-based stock organization
- **Auto-Update Integration**: Stock updates during donations/issues
- **Inventory Synchronization**: BloodInventory auto-updates from BloodStocks

## 🛠️ Setup Instructions

### Prerequisites
- .NET 8.0 SDK
- MySQL 8.0 or XAMPP
- Visual Studio Code or Visual Studio

### Database Setup
1. Install XAMPP and start MySQL
2. Create database `bloodbankdotnet`
3. Update connection string in `appsettings.json`

### Running the Application
```bash
cd BloodBankManagement
dotnet restore
dotnet ef database update
dotnet run
```

### Access Swagger UI
Navigate to: `https://localhost:5258/swagger`

## 📝 Configuration

### Connection String (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=bloodbankdotnet;User=root;Password=;"
  }
}
```

### JWT Settings
- Secret key configured in `JwtSettings`
- 24-hour token expiration
- Role-based claims

## 🔄 Recent Updates

### September 21, 2025
- ✅ Initial project setup with .NET 8.0
- ✅ JWT authentication implementation
- ✅ User management with role-based authorization
- ✅ Donor management system with eligibility tracking
- ✅ Recipient management system
- ✅ Blood request management with workflow
- ✅ Blood inventory tracking system
- ✅ Database migrations and MySQL integration
- ✅ Complete API documentation
- ✅ Repository setup on GitHub

## 🎯 Upcoming Features
- Blood stock management with individual unit tracking
- Auto-update stock on donations and issues
- Low stock alert system
- Advanced reporting and analytics
- Email notifications
- Mobile app integration

## 📧 Contact

**Repository**: [BloodBank_DotNet](https://github.com/sarathchandranm2001/BloodBank_DotNet)

---

*Last Updated: September 21, 2025*