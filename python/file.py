 import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.metrics import mean_squared_error, accuracy_score
import matplotlib.pyplot as plt
import seaborn as sns

# Step 1: Data Preprocessing and Feature Engineering
# Load the dataset
data = pd.read_csv("path_to_data/combined_data.csv")

# Handle missing values
data.dropna(inplace=True)

# Ensure proper alignment by timestamp
data['DateTime'] = pd.to_datetime(data['DateTime'])
data.set_index('DateTime', inplace=True)

# Step 2: Model Development (Power Generation)
# Split data into train and test sets
X = data[['Air', 'Pressure', 'wind_speed']]
y = data['Power_generated']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Random Forest Regressor
rf_regressor = RandomForestRegressor(n_estimators=100, random_state=42)
rf_regressor.fit(X_train, y_train)

# Predict on test set
y_pred = rf_regressor.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
print("Mean Squared Error:", mse)

# Step 3: Power Distribution
# Distribute power to consumption nodes
total_power_generated = y_pred.sum()
node1_power = total_power_generated * 0.20
node2_power = total_power_generated * 0.45
node3_power = total_power_generated * 0.35

# Step 4: Grid Stability Evaluation
# Load grid stability dataset
grid_data = pd.read_csv("path_to_data/GridData.csv")
grid_data['DateTime'] = pd.to_datetime(grid_data['DateTime'])
grid_data.set_index('DateTime', inplace=True)

# Prepare data for stability evaluation
X_stability = grid_data[['power_gen_1', 'power_gen_2', 'power_gen_3', 'p1', 'p2', 'p3', 'C1', 'C2', 'C3']]
y_stability = grid_data['stability']

# Train Random Forest Classifier for stability
X_stability_train, X_stability_test, y_stability_train, y_stability_test = train_test_split(X_stability, y_stability, test_size=0.2, random_state=42)
rf_classifier = RandomForestClassifier(n_estimators=100, random_state=42)
rf_classifier.fit(X_stability_train, y_stability_train)

# Predict on test set
y_stability_pred = rf_classifier.predict(X_stability_test)
accuracy = accuracy_score(y_stability_test, y_stability_pred)
print("Accuracy:", accuracy)

# Step 5: Generate Insights
# Analyze stability trends
grid_data['Predicted_Stability'] = y_stability_pred
sns.countplot(x='Predicted_Stability', data=grid_data)
plt.title('Predicted Grid Stability')
plt.show()

# Further analysis and insights generation can be done based on specific requirements
