import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Wallet,
  ChevronLeft,
  ChevronRight,
  Hexagon,
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  {
    section: 'Overview',
    links: [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    section: 'Management',
    links: [
      { to: '/employees', label: 'Employees', icon: Users },
      { to: '/attendance', label: 'Attendance', icon: CalendarCheck },
      { to: '/salary', label: 'Salary', icon: Wallet },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`} id="main-sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Hexagon size={20} color="white" />
        </div>
        {!collapsed && (
          <span className="sidebar-logo-text">
            <span className="text-gradient">HRMS</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav" aria-label="Main navigation">
        {navItems.map((section) => (
          <div key={section.section}>
            {!collapsed && (
              <div className="sidebar-section-label">{section.section}</div>
            )}
            {section.links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
                id={`nav-${link.label.toLowerCase()}`}
                title={collapsed ? link.label : undefined}
              >
                <span className="sidebar-link-icon">
                  <link.icon size={20} />
                </span>
                {!collapsed && (
                  <span className="sidebar-link-text">{link.label}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="sidebar-toggle">
        <button onClick={onToggle} aria-label="Toggle sidebar" id="sidebar-toggle-btn">
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}
