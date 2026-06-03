import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add framer-motion and PageTransition imports
content = content.replace("import LandingPage from \"./pages/LandingPage\";", "import LandingPage from \"./pages/LandingPage\";\nimport { AnimatePresence } from 'framer-motion';\nimport PageTransition from '@/components/PageTransition';")

# Fix router-dom import to include useLocation
content = content.replace("import { BrowserRouter, Route, Routes } from \"react-router-dom\";", "import { BrowserRouter, Route, Routes, useLocation } from \"react-router-dom\";")

# Replace Login with LoginPage
content = content.replace("const Login = React.lazy(() => import(\"./pages/Login\"));", "const LoginPage = React.lazy(() => import(\"./pages/LoginPage\"));")

# Create InnerRoutes component
inner_routes = """
const InnerRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
"""

routes_block_match = re.search(r'<Routes>(.*?)</Routes>', content, re.DOTALL)
if routes_block_match:
    routes_str = routes_block_match.group(1)
    
    # Process each route inside
    def replace_route(m):
        path = m.group(1)
        element = m.group(2)
        # If it's the admin layout wrapper which has nested routes
        if 'AdminGuard' in element and '<Route index' not in element:
            return m.group(0) # We handle Admin routes specially below, wait no this is a multiline match!
        
        # for standard routes:
        if '<Login />' in element:
            element = element.replace('<Login />', '<LoginPage />')
        
        # wrap element with PageTransition
        new_element = f"<PageTransition>{element}</PageTransition>"
        return f'<Route{path}element={{{new_element}}}'

    # simple regex for single line routes
    new_routes_str = re.sub(r'<Route([^>]*?)element=\{([^}]+)\}', replace_route, routes_str)
    
    # manual fix for admin nested routes
    new_routes_str = new_routes_str.replace('<Route index element={<AdminOverviewPage />} />', '<Route index element={<PageTransition><AdminOverviewPage /></PageTransition>} />')
    new_routes_str = new_routes_str.replace('element={<AdminGuard>', 'element={<PageTransition><AdminGuard>')
    new_routes_str = new_routes_str.replace('</AdminGuard>\n                  }', '</AdminGuard></PageTransition>\n                  }')
    
    # For nested routes:
    new_routes_str = re.sub(r'<Route path="([^"]+)" element=\{([^}]+)\}', replace_route, new_routes_str)
    
    inner_routes += new_routes_str + """
      </Routes>
    </AnimatePresence>
  );
};
"""
    
    # replace <Routes>...</Routes> with <InnerRoutes />
    content = content.replace(routes_block_match.group(0), "<InnerRoutes />")
    
    # insert inner_routes before const App = () =>
    content = content.replace("const App = () => (", inner_routes + "\nconst App = () => (")
    
    with open('src/App.tsx', 'w') as f:
        f.write(content)
