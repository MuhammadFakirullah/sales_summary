from flask import Flask, render_template, request, redirect, url_for
import pandas as pd
from datetime import datetime
import os

global_df = None

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def clear_upload_folder():
    folder = app.config['UPLOAD_FOLDER']
    for filename in os.listdir(folder):
        file_path = os.path.join(folder, filename)
        try:
            if os.path.isfile(file_path):
                os.remove(file_path)
        except Exception as e:
            print(f"Error deleting file {file_path}: {e}")

@app.route('/')
def index():
    return render_template('upload.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    clear_upload_folder()  # 👈 This deletes old files

    if 'file' not in request.files:
        return "No file part"

    file = request.files['file']
    if file.filename == '':
        return "No selected file"

    filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(filepath)

    # Read file
    if filepath.endswith('.csv'):
        df = pd.read_csv(filepath)
    else:
        df = pd.read_excel(filepath, sheet_name='Sales')

    # Ensure required columns
    required_columns = {'Transaction Value (RM)', 'Date', 'Product', 'Item Sold'}
    if not required_columns.issubset(df.columns):
        return "File must contain 'Transaction Value (RM)', 'Date', 'Product', and 'Item Sold' columns"

    # Preprocess Date
    df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
    df.dropna(subset=['Date'], inplace=True)
    df['Year'] = df['Date'].dt.year
    df['Month'] = df['Date'].dt.strftime('%B')

    # ✅ Save globally for dashboard route
    global global_df
    global_df = df.copy()

    current_year = datetime.now().year
    df_current = df[df['Year'] == current_year]

    # Calculate KPIs cards
    total_sales = df['Transaction Value (RM)'].sum()
    total_items = df['Item Sold'].sum()
    total_products = df['Product'].nunique()
    total_transactions = df.shape[0]  # or len(df)

    # Bar Chart: Monthly Transaction Value
    monthly_sales = df_current.groupby('Month')['Transaction Value (RM)'].sum()
    months_order = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December']
    monthly_sales = monthly_sales.reindex(months_order).fillna(0)

    labels = list(monthly_sales.index)
    values = [round(float(val), 2) for val in monthly_sales.values]
     
    # Doughnut Chart: Sum of Number of Items by Product
    doughnut_summary = df_current.groupby('Product')['Item Sold'].sum()
    # ✅ Sort and select top 5 products
    top_5_products = doughnut_summary.sort_values(ascending=False).head(5)
    # ✅ Prepare labels and values
    doughnut_labels = list(top_5_products.index)
    doughnut_values = [int(x) for x in top_5_products.values]

    # ✅ LINE CHART: Count of Transactions per Month
    # Convert date to month name if needed
    df_current['Month'] = pd.to_datetime(df_current['Date']).dt.strftime('%B')

    # Count number of transactions per month
    monthly_transaction_count = df_current.groupby('Month').size()

    # Reorder by calendar month
    months_transaction_order = ['January', 'February', 'March', 'April', 'May', 'June',
                                'July', 'August', 'September', 'October', 'November', 'December']
    monthly_transaction_count = monthly_transaction_count.reindex(months_transaction_order).fillna(0)

    # Prepare for chart
    line_labels = list(monthly_transaction_count.index)
    line_values = [int(val) for val in monthly_transaction_count.values]


    # ✅ PIE CHART: Frequency of Category by Month for Current Year
    if 'Category' in df_current.columns:
        category_counts = df_current['Category'].value_counts()
        pie_labels = list(category_counts.index)
        pie_values = [int(x) for x in category_counts.values]  # FIXED HERE
    else:
        pie_labels = []
        pie_values = []


    # HORIZONTAL BAR CHART: Frequency of Payment Method by Product for current year
    if 'Payment Method' in df_current.columns:
        # Group by Payment Method, Month, and Product — but for now just aggregate at Payment Method level
        payment_summary = df_current.groupby('Payment Method').size().sort_values(ascending=False)
        
        horizontal_labels = list(payment_summary.index)
        horizontal_values = [int(x) for x in payment_summary.values]
    else:
        horizontal_labels = []
        horizontal_values = []

    # ✅ STACKED BAR CHART: Revenue vs Discount by Month (Simulated Discount = 10%)
    stacked_data = df_current.groupby(['Month', 'Category'])['Profit Per Sale (RM)'].sum().unstack(fill_value=0)

    # Prepare labels for the months and the category labels
    stacked_labels = list(stacked_data.index)  # Months
    stacked_categories = list(stacked_data.columns)  # Categories

    # Prepare stacked values for each category
    stacked_values = [list(stacked_data[category]) for category in stacked_categories]

    return render_template(
        'dashboard.html',
        labels=labels,
        values=values,
        doughnut_labels=doughnut_labels,
        doughnut_values=doughnut_values,
        line_labels =line_labels,
        line_values = line_values,
        pie_labels = pie_labels,
        pie_values = pie_values,
        horizontal_labels=horizontal_labels,
        horizontal_values=horizontal_values,
        stacked_labels=stacked_labels,
        stacked_categories=stacked_categories,
        stacked_values=stacked_values,
        year=current_year,

        # 🟢 New Summary Stats
        total_sales=f"{total_sales:,.2f}",
        total_items=total_items,
        total_products=total_products,
        total_transactions=total_transactions
    )

@app.route('/dashboard', methods=['GET', 'POST'])
def dashboard():
    global global_df
    if global_df is None:
        return redirect(url_for('index'))  # Redirect to upload page if no file uploaded yet

    selected_year = request.form.get('year', datetime.now().year)
    try:
        selected_year = int(selected_year)
    except ValueError:
        selected_year = datetime.now().year

    df = global_df.copy()
    df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
    df.dropna(subset=['Date'], inplace=True)
    df['Year'] = df['Date'].dt.year
    df['Month'] = df['Date'].dt.strftime('%B')

    df_current = df[df['Year'] == selected_year]

    # Your existing summary/chart generation logic can go here, but replace current_year with selected_year
    # (Just copy your existing code, replacing current_year with selected_year)
    
    # Example:
    total_sales = df['Transaction Value (RM)'].sum()
    total_items = df['Item Sold'].sum()
    total_products = df['Product'].nunique()
    total_transactions = df.shape[0]
    
    # Bar Chart: Monthly Transaction Value
    monthly_sales = df_current.groupby('Month')['Transaction Value (RM)'].sum()
    months_order = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December']
    monthly_sales = monthly_sales.reindex(months_order).fillna(0)

    labels = list(monthly_sales.index)
    values = [round(float(val), 2) for val in monthly_sales.values]

    # Doughnut Chart: Sum of Number of Items by Product
    doughnut_summary = df_current.groupby('Product')['Item Sold'].sum()
    # ✅ Sort and select top 5 products
    top_5_products = doughnut_summary.sort_values(ascending=False).head(5)
    # ✅ Prepare labels and values
    doughnut_labels = list(top_5_products.index)
    doughnut_values = [int(x) for x in top_5_products.values]

    # ✅ LINE CHART: Count of Transactions per Month
    # Convert date to month name if needed
    df_current['Month'] = pd.to_datetime(df_current['Date']).dt.strftime('%B')

    # Count number of transactions per month
    monthly_transaction_count = df_current.groupby('Month').size()

    # Reorder by calendar month
    months_transaction_order = ['January', 'February', 'March', 'April', 'May', 'June',
                                'July', 'August', 'September', 'October', 'November', 'December']
    monthly_transaction_count = monthly_transaction_count.reindex(months_transaction_order).fillna(0)

    # Prepare for chart
    line_labels = list(monthly_transaction_count.index)
    line_values = [int(val) for val in monthly_transaction_count.values]


    # ✅ PIE CHART: Frequency of Category by Month for Current Year
    # ✅ PIE CHART: Frequency of Category by Month for Current Year
    if 'Category' in df_current.columns:
        category_counts = df_current['Category'].value_counts()
        pie_labels = list(category_counts.index)
        pie_values = [int(x) for x in category_counts.values]  # FIXED HERE
    else:
        pie_labels = []
        pie_values = []


    # HORIZONTAL BAR CHART: Frequency of Payment Method by Product for current year
    if 'Payment Method' in df_current.columns:
        # Group by Payment Method, Month, and Product — but for now just aggregate at Payment Method level
        payment_summary = df_current.groupby('Payment Method').size().sort_values(ascending=False)
        
        horizontal_labels = list(payment_summary.index)
        horizontal_values = [int(x) for x in payment_summary.values]
    else:
        horizontal_labels = []
        horizontal_values = []

    # ✅ STACKED BAR CHART: Revenue vs Discount by Month (Simulated Discount = 10%)
    # Group by 'Month' and 'Category' and sum the 'Profit Per Sale (RM)'
    stacked_data = df_current.groupby(['Month', 'Category'])['Profit Per Sale (RM)'].sum().unstack(fill_value=0)
    stacked_months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December']
    stacked_data = stacked_data.reindex(stacked_months).fillna(0)
    
    # Prepare labels for the months and the category labels
    stacked_labels = list(stacked_data.index)  # Months
    stacked_categories = list(stacked_data.columns)  # Categories

    # Prepare stacked values for each category
    stacked_values = [list(stacked_data[category]) for category in stacked_categories]

    return render_template(
        'dashboard.html',
        labels=labels,
        values=values,
        doughnut_labels=doughnut_labels,
        doughnut_values=doughnut_values,
        line_labels=line_labels,
        line_values=line_values,
        pie_labels=pie_labels,
        pie_values=pie_values,
        horizontal_labels=horizontal_labels,
        horizontal_values=horizontal_values,
        stacked_labels=stacked_labels,
        stacked_categories=stacked_categories,
        stacked_values=stacked_values,
        total_sales=f"{total_sales:,.2f}",
        total_items=total_items,
        total_products=total_products,
        total_transactions=total_transactions,
        year=selected_year,
        selected_year=selected_year  # 👈 Pass selected year again (if template expects this)
    )
