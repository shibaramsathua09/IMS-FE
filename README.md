# Insurance-Management-System

# Project Overview

IMS is a robust and secure Insurance Management System built with .NET Core Web API and SQL Server. It manages core modules like Users, Customers, Agents, Policies, Claims, and Notifications, and implements **JWT-based role-based authentication** for Admin, Customer, and Agent users.

## Technologies Used

- Backend: ASP.NET Core Web API
- Database: SQL Server (SSMS)
- Architecture: Clean Architecture (Controller, Services, Repositories, DTOs)
- Authentication: JWT Token with Role-based Authorization
- Object Mapping: AutoMapper
- Documentation: Swagger UI
- Frontend: Angular

## Project Highlights

- All use cases of the project have been successfully completed.
- The backend is built using ASP.NET Web API, providing robust and scalable RESTful services.
- SQL is used for data storage, ensuring reliable and efficient data management.
- C# is the primary programming language, leveraging the Code First approach for database modeling.
- The frontend is developed using Angular, offering a dynamic and responsive user interface.
- Material UI is utilized in Angular for consistent and modern UI styling.

## Getting Started

To get started with the project, clone the repository and follow the setup instructions for backend and frontend components.

# Project Directory Structure

<pre>src/
├── index.html
├── main.ts
├── styles.css
├── tests.ts
├── app/
│   ├── app.component.html
│   ├── app.component.css
│   ├── app.component.spec.ts
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── core/
    └── auth/
│      ├── auth.service.ts
│      ├── auth.guards.ts 
│   └── intercepter/
│      └──services/
│   └── features/
│           ├── admin/
│           │   ├── admin-dashboard/
│           │   └── admin-profile/
│           ├── agent-management/
│           ├── customer-management/
│           ├── policy-management/
│           ├── agent/
│           ├── auth/
│           ├── login/
│           ├── registry/
│           ├── customer/
│           ├── home/
│           ├── products/
│       └── layouts/
│           ├── admin-layout/
│           ├── agent-layout/
│           └── customer-layout/
|        └── shared/
|            ├── components/
|            ├── confirm-dialog/
|           ├── reject-dialog/
|          ├── api-response.interface.ts
|         ├── pagedResult.dtos.ts
└── environment/
    └── environment.development.ts </pre>

 
## User Roles & Permissions
 
- **Admin:** Manage all modules
- **Agent:** Handle policies and claims
- **Customer:** Request/view policies, submit claims
 
## Authentication
 
- Implemented JWT-based login with 3 roles
- Secured endpoints with `[Authorize(Roles = "Admin")]`, etc.
 
## Features Implemented
 
- ✅ User Registration & Login (JWT Auth)
- ✅ CRUD for Customers, Agents, Policies, Claims
- ✅ Role-based access
- ✅ Exception handling middleware
- ✅ Swagger integrated
- ✅ Clean Architecture using Interfaces, Repositories, Services
- ✅ AutoMapper configured
- ✅ Code First Approach with Migration.
 
## API Testing
 
- Used Swagger to test endpoints
- Include Authorization Header with Bearer Token
 
## Setup Instructions

Add your connection string in appsettings.json.
Run the project:
dotnet run

For installation:
npm i

Run the Project :
ng serve

## Links
- **Backend**: https://dotnettutorials.net/course/asp-net-web-api/
- **Database**: https://www.sqltutorial.org/
- **Programming Language**: https://dotnettutorials.net/course/csharp-dot-net-tutorials/
- **Angular**: https://angular.dev/overview


