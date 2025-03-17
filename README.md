# Diamond Listing System

A comprehensive application for managing diamond inventory, brokers, and transactions.

## Overview

The Diamond Listing System is a React-based web application that allows users to:
- Manage diamond inventory with detailed specifications
- Maintain broker information
- Create transactions between brokers and diamonds
- Generate and send PDF invoices via email

## Technologies Used

- React 18
- TypeScript
- Ant Design for UI components
- Tailwind CSS for styling
- jsPDF for PDF generation
- EmailJS for email functionality
- React Toastify for notifications

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/KishanPadsala1/diamond-listing-system.git
   cd diamond-listing-system
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create environment variables (see Configuration section)

4. Start the json server:
   ```
   npm run server
   ```

5. Start the development server:
   ```
   npm start
   ```

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# EmailJS Configuration
REACT_APP_EMAILJS_USER_ID=your_emailjs_user_id
REACT_APP_EMAILJS_SERVICE_ID=your_emailjs_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
```

These variables are required for the email functionality to work properly. You can obtain these values by:
1. Creating an account at [EmailJS](https://www.emailjs.com/)
2. Setting up a service (Gmail, Outlook, etc.)
3. Creating an email template
4. Copying the User ID, Service ID, and Template ID to your `.env` file

A `.env.example` file is provided as a template.

### EmailJS Setup

For detailed instructions on setting up EmailJS:

1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Create a new service (connect your email provider)
3. Create an email template with the following variables:
   - `{{to_name}}` - Broker name
   - `{{to_email}}` - Broker email
   - `{{invoice_number}}` - Invoice number
   - `{{invoice_date}}` - Date of invoice
   - `{{total_amount}}` - Total invoice amount
   - `{{total_diamonds}}` - Number of diamonds
   - `{{total_carats}}` - Total carats
   - `{{message}}` - Custom message
   - `{{pdf_attachment}}` - PDF attachment (base64)
4. Get your User ID, Service ID, and Template ID
5. Add these values to your `.env` file

## Features

### Broker Management
- Add, edit, and delete brokers
- Filter brokers by status
- Sort brokers by name or rate

### Diamond Inventory
- Add, edit, and delete diamonds with detailed specifications
- Bulk upload diamonds via Excel
- Filter and sort diamonds by various attributes
- Automatic calculation of PPC (Price Per Carat) and total amount

### Transaction Management
- Select broker and diamonds for transactions
- View summary matrix of selected diamonds
- Generate invoices with detailed information
- Download invoices as PDF
- Send invoices to brokers via email

### Notifications
- Toast notifications for all operations
- Success and error messages for API calls
- Email status notifications

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Brokers/        # Broker-related components
│   ├── Diamonds/       # Diamond-related components
│   ├── Layout/         # Layout components
│   └── Transactions/   # Transaction-related components
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API services
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```