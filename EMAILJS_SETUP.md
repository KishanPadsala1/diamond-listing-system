# EmailJS Setup Guide

This guide will help you set up EmailJS to send invoice emails from your Diamond Listing System application.

## Step 1: Create an EmailJS Account

1. Go to [EmailJS](https://www.emailjs.com/) and sign up for an account
2. After signing up, log in to your EmailJS dashboard

## Step 2: Add an Email Service

1. In the EmailJS dashboard, go to the "Email Services" tab
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the instructions to connect your email account
5. Give your service a name (e.g., "Diamond Listing System")
6. Save the service and note the **Service ID** for later use

## Step 3: Create an Email Template

1. In the EmailJS dashboard, go to the "Email Templates" tab
2. Click "Create New Template"
3. Give your template a name (e.g., "Invoice Template")
4. Copy the HTML content from the `emailjs-invoice-template.html` file in this project
5. Paste it into the template editor
6. Save the template and note the **Template ID** for later use

### Template Variables

The template uses the following variables that will be passed from your application:

- `{{to_name}}` - The broker's name
- `{{to_email}}` - The broker's email address
- `{{invoice_number}}` - The invoice number
- `{{invoice_date}}` - The date of the invoice
- `{{total_amount}}` - The total amount of the invoice
- `{{total_diamonds}}` - The number of diamonds in the invoice
- `{{total_carats}}` - The total carats of all diamonds
- `{{message}}` - A custom message
- `{{pdf_attachment}}` - The PDF invoice attachment (base64 encoded)

## Step 4: Configure Environment Variables

1. In your project, create or edit the `.env` file
2. Add the following environment variables:

```
REACT_APP_EMAILJS_USER_ID=your_emailjs_user_id
REACT_APP_EMAILJS_SERVICE_ID=your_emailjs_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
```

3. Replace the placeholder values with your actual EmailJS credentials:
   - Find your **User ID** in the EmailJS dashboard under "Account" > "API Keys"
   - Use the **Service ID** from Step 2
   - Use the **Template ID** from Step 3

## Step 5: Test the Email Functionality

1. Start your application
2. Navigate to the Transactions page
3. Create a transaction and generate an invoice
4. Click the "Send to Broker" button to test the email functionality

## Troubleshooting

If you encounter issues with sending emails:

1. Check that all environment variables are correctly set
2. Verify that your EmailJS account is active and has available email credits
3. Check the browser console for any error messages
4. Ensure that the template variables match those expected by your application
5. Verify that your email service is properly connected in EmailJS

## Additional Resources

- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [EmailJS React Integration](https://www.emailjs.com/docs/examples/reactjs/)
- [EmailJS SDK Reference](https://www.emailjs.com/docs/sdk/installation/) 