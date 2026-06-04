import os
import re

app_path = "src/App.tsx"
with open(app_path, 'r') as f:
    content = f.read()

# Replace AnimatedDashboardPage import
content = re.sub(r'const AnimatedDashboardPage = React\.lazy\(\(\) => import\("\./pages/AnimatedDashboardPage"\)\);\n', 'const Dashboard = React.lazy(() => import("./pages/Dashboard"));\n', content)

# Remove all Admin... imports
content = re.sub(r'const Admin.*?\n', '', content)
content = re.sub(r'const AboutDeveloperPage = React\.lazy\(\(\) => import\("\./pages/admin/AboutDeveloperPage"\)\);\n', '', content)

# Replace the dashboard route
old_dashboard_route = r'<Route path="/dashboard" element={<ProtectedRoute adminOnly=\{true\}><AnimatedDashboardPage /></ProtectedRoute>} />'
new_dashboard_route = '<Route path="/dashboard" element={<RequireAdmin><Dashboard /></RequireAdmin>} />'
content = re.sub(old_dashboard_route, new_dashboard_route, content)

# Remove the Admin block
admin_block_pattern = r'\s*\{/\* Admin \*/\}\s*<Route\s*path="/admin"\s*element=\{[\s\S]*?</Route>'
content = re.sub(admin_block_pattern, '', content)

with open(app_path, 'w') as f:
    f.write(content)
