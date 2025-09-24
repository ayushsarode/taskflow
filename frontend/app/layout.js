export const metadata = { title: 'SvaraAI Task Manager', description: 'Task & Project Management System' };
import './globals.css';
import { AuthProvider } from '../context/AuthContext.jsx';
import Header from './components/Header.jsx';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900 [font-family:Inter,system-ui,Arial]">
        <AuthProvider>
          <Header />
           <div className="mx-auto px-6 py-8 lg:max-w-[80%]">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
