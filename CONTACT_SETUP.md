# Contact Form Setup Instructions

## Environment Variables Required

Add the following environment variables to your `.env` file in the backend directory:

```env
# Email Configuration (for Contact Form)
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password
```

## Gmail Setup Instructions

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password as `EMAIL_PASS` in your .env file

## Installation

1. **Install Nodemailer**:
   ```bash
   cd COER/backend
   npm install nodemailer
   ```

2. **Update your .env file** with the email credentials

3. **Restart your backend server**

## Testing

1. Navigate to `/contact` in your frontend
2. Fill out the contact form
3. Submit the form
4. Check your email for the contact form submission

## Features

- ✅ Modern, responsive contact page
- ✅ Client-side form validation
- ✅ Email sending with Nodemailer
- ✅ Beautiful HTML email templates
- ✅ Error handling and user feedback
- ✅ Contact information display
- ✅ FAQ section

## API Endpoint

- **POST** `/api/contact` - Submit contact form
- **Body**: `{ fullName, email, subject, message }`
- **Response**: `{ success: boolean, message: string }`

