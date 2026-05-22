import { useState, useMemo } from "react";
import { ChevronRight, Bookmark, CheckCircle, X } from "lucide-react";
import { OUTLINE } from "../data/outline";

export default function Sidebar({
  activeSection,
  onSelectSection,
  searchQuery,
  isCompleted,
  isBookmarked,
  bookmarks,
  onRemoveBookmark,
  sidebarTab,
  setSidebarTab,
  completed,
}) {
  const [openEras, setOpenEras] = useState(() => {
    const defaults = {};
    OUTLINE.forEach((e) => { defaults[e.id] = true; });
    return defaults;
  });

  const toggleEra = (id) => {
    setOpenEras((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter by search query
  const filteredOutline = useMemo(() => {
    if (!searchQuery.trim()) return OUTLINE;
    const q = searchQuery.toLowerCase();
    return OUTLINE
      .map((era) => ({
        ...era,
        sections: era.sections.filter(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            era.era.toLowerCase().includes(q) ||
            (s.passages || []).some((p) => p.toLowerCase().includes(q))
        ),
      }))
      .filter((era) => era.sections.length > 0);
  }, [searchQuery]);

  const totalSections = OUTLINE.flatMap((e) => e.sections).length;
  const completedCount = completed.length;

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <h1>KJV Chronological<br />Study Bible</h1>
        <p>Edward Reese · Baker Publishing Group</p>
      </div>

      <div className="progress-bar-wrap">
        <div className="progress-bar-label">
          <span>Reading Progress</span>
          <span>{completedCount} / {totalSections}</span>
        </div>
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${(completedCount / totalSections) * 100}%` }}
          />
        </div>
      </div>

      <div className="sidebar-tabs">
        {["Navigate", "Bookmarks"].map((tab) => (
          <button
            key={tab}
            className={`sidebar-tab ${sidebarTab === tab ? "active" : ""}`}
            onClick={() => setSidebarTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="sidebar-content">
        {sidebarTab === "Navigate" ? (
          filteredOutline.map((era) => (
            <div key={era.id} className="era-group">
              <div
                className="era-header"
                onClick={() => toggleEra(era.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && toggleEra(era.id)}
              >
                <div
                  className="era-dot"
                  style={{ background: era.color }}
                />
                <div className="era-label">
                  <h3>{era.era}</h3>
                  {era.dateRange && <span>{era.dateRange}</span>}
                </div>
                <ChevronRight
                  size={14}
                  className={`era-chevron ${openEras[era.id] ? "open" : ""}`}
                />
              </div>

              {openEras[era.id] && (
                <div className="era-sections">
                  {era.sections.map((section) => (
                    <div
                      key={section.id}
                      className={`section-item ${activeSection?.id === section.id ? "active" : ""}`}
                      onClick={() => onSelectSection(section, era)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && onSelectSection(section, era)}
                    >
                      <span className="section-label-badge">{section.label}</span>
                      <span className="section-item-text">{section.title}</span>
                      {isCompleted(section.id) && (
                        <CheckCircle size={12} className="section-check" />
                      )}
                      {isBookmarked(section.id) && !isCompleted(section.id) && (
                        <Bookmark size={12} className="section-check" style={{ color: "var(--gold-dim)" }} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bookmarks-list">
            {bookmarks.length === 0 ? (
              <p className="empty-state">No bookmarks yet. Open a section and press the bookmark button.</p>
            ) : (
              bookmarks.map((b) => (
                <div
                  key={b.sectionId}
                  className="bookmark-item"
                  onClick={() => {
                    // Find the section in outline and navigate
                    for (const era of OUTLINE) {
                      const section = era.sections.find((s) => s.id === b.sectionId);
                      if (section) { onSelectSection(section, era); break; }
                    }
                    setSidebarTab("Navigate");
                  }}
                >
                  <Bookmark size={14} className="bookmark-icon" fill="currentColor" />
                  <div className="bookmark-info">
                    <strong>{b.label}</strong>
                    <span>{b.eraTitle}</span>
                  </div>
                  <button
                    className="bookmark-remove"
                    onClick={(e) => { e.stopPropagation(); onRemoveBookmark(b.sectionId); }}
                    title="Remove bookmark"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
