import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Notification from '../common/Notification';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Notification />
      <div className="ml-64">
        <Header />
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}