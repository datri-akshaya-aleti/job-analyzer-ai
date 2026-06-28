import { useState } from "react";

function Sidebar({ activePage, setActivePage }) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: "analyzer", icon: "📄", label: "Resume Analyzer" },
    { id: "games", icon: "🎮", label: "Aptitude Games" },
  ];

  return (
    <>
      <button
        className="hamburger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
      )}

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h3>Job <span>Analyzer</span> AI</h3>
          <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
        </div>

        <div className="sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-item ${activePage === item.id ? "active" : ""}`}
              onClick={() => {
                setActivePage(item.id);
                setIsOpen(false);
              }}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
          <p>Built with ❤️ using AI</p>
        </div>
      </div>
    </>
  );
}

export default Sidebar;