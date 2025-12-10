# How to Check Contacts Data in PostgreSQL Database

## ✅ **Good News: The API is Working!**
I just tested the contact form API and it's successfully saving data to the database.

## 🔍 **How to View the Data:**

### **Method 1: Using pgAdmin 4 (Easiest)**

1. **Open pgAdmin 4**
2. **Connect to your PostgreSQL server:**
   - Server: `localhost` (or your server name)
   - Port: `5432`
   - Username: `postgres`
   - Password: `098765` (or your password)

3. **Navigate to the database:**
   - Expand: `Servers` → `PostgreSQL` → `Databases` → `doctor_finder`

4. **View the contacts table:**
   - Expand: `Schemas` → `public` → `Tables` → `contacts`
   - **Right-click on `contacts`** → Select **"View/Edit Data"** → **"All Rows"**

5. **You should see all contact form submissions!**

---

### **Method 2: Using SQL Query in pgAdmin 4**

1. Open pgAdmin 4
2. Right-click on `doctor_finder` database → **"Query Tool"**
3. Run this query:

```sql
SELECT * FROM contacts ORDER BY "createdAt" DESC;
```

4. Click the **Execute** button (▶️) or press `F5`

---

### **Method 3: Using Command Line (psql)**

Open Terminal and run:

```bash
psql -U postgres -d doctor_finder
```

Then enter your password when prompted, and run:

```sql
SELECT * FROM contacts ORDER BY "createdAt" DESC;
```

---

### **Method 4: Check if Table Exists**

If you don't see the `contacts` table, it might not have been created yet. Run this query:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'contacts';
```

**If the table doesn't exist:**
1. Restart the backend server (it will auto-create the table)
2. The backend uses `synchronize: true` which automatically creates tables

---

## 🧪 **Test the Contact Form:**

1. Go to: http://localhost:3000/contact
2. Fill out the form:
   - Name: Test User
   - Email: test@example.com
   - Subject: Test Subject
   - Message: Test message
3. Click "Send Message"
4. Check the database using one of the methods above

---

## 📊 **Useful SQL Queries:**

```sql
-- Count total contacts
SELECT COUNT(*) as total FROM contacts;

-- View unread contacts
SELECT * FROM contacts WHERE "isRead" = false;

-- View contacts from today
SELECT * FROM contacts 
WHERE DATE("createdAt") = CURRENT_DATE;

-- View table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'contacts';
```

---

## ⚠️ **Troubleshooting:**

### **If you can't see the table:**
1. Make sure PostgreSQL is running
2. Make sure you're connected to the `doctor_finder` database (not `postgres`)
3. Restart the backend server to create the table:
   ```bash
   cd backend/backend
   npm run start:dev
   ```

### **If you see an error:**
- Check the backend terminal for error messages
- Verify your `.env` file has correct database credentials
- Make sure the database `doctor_finder` exists

---

## ✅ **Quick Verification:**

The API test I just ran returned:
```json
{
  "id": "9d0c10ce-567a-489e-9acd-8cd2bb53a5c3",
  "name": "Test User",
  "email": "test@example.com",
  "subject": "Test Subject",
  "message": "Test message",
  "isRead": false,
  "createdAt": "2025-12-01T16:12:06.931Z",
  "updatedAt": "2025-12-01T16:12:06.931Z"
}
```

**This means data IS being saved!** You just need to check the database using one of the methods above.







