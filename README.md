## expense-tracker
A react-native app to log expenses and send them to google sheet.  
  
example config:
``` 
export default conf = {
  spreadsheetId: "",
  spreadSheetName: "expenses",
  CLIENT_ID: "",
  CLIENT_SECRET: "",
  REFRESH_TOKEN: "",
  columnOrder: ["Sent at", "Date", "Time", "Amount", "Payee", "Category", "Subcategory", "PaymentMethod", "Description"],
  categories: [
    {name: "Food", 
      subCat: ["Groceries", "Restaurant", "Other"]},
    {name: "Health Care", 
      subCat: ["Dental", "Other"]},
    {name: "Household", 
      subCat: ["Cleaning", "Home Maintenance", "Other"]},
    {name: "Personal", 
      subCat: ["Gift", "Hobby", "Game", "Personal Care", "Other"]},
    {name: "Transportation", 
      subCat: ["Bus", "Taxi", "Train", "Other"]},
    {name: "Other", 
      subCat: ["Other"]},
  ],
  paymentMethods: ["Credit", "Cash", "Bank Check"],
};
```
