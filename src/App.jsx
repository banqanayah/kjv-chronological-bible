import { useState, useMemo, useCallback } from "react";
import { Menu, Search, Minus, Plus, BookOpen } from "lucide-react";
import Sidebar from "./components/Sidebar";
import BibleReader from "./components/BibleReader";
import { OUTLINE, ALL_SECTIONS } from "./data/outline";
import { useBookmarks, useReadingProgress, useNotes } from "./hooks/useStorage";
import "./index.css";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState("Navigate");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState(null);
  const [activeEra, setActiveEra] = useState(null);
  const [fontSize, setFontSize] = useState(20);
  const { bookmarks, addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const { completed, markComplete, markIncomplete, isCompleted } = useReadingProgress();
  const { saveNote, getNote } = useNotes();
  const handleSelectSection = useCallback((section, era) => { setActiveSection(section); setActiveEra(era); setSidebarTab("Navigate"); }, []);
  const flatSections = useMemo(() => OUTLINE.flatMap((era) => era.sections.map((s) => ({ section: s, era }))), []);
  const currentIndex = useMemo(() => flatSections.findIndex((item) => item.section.id === activeSection?.id), [flatSections, activeSection]);
  const handlePrev = () => { if (currentIndex > 0) { const { section, era } = flatSections[currentIndex - 1]; handleSelectSection(section, era); } };
  const handleNext = () => { if (currentIndex < flatSections.length - 1) { const { section, era } = flatSections[currentIndex + 1]; handleSelectSection(section, era); } };
  return (<div className="app-layout"><div className={`sidebar ${sidebarOpen ? "" : "collapsed"}`}><Sidebar activeSection={activeSection} onSelectSection={handleSelectSection} searchQuery={searchQuery} isCompleted={isCompleted} isBookmarked={isBookmarked} bookmarks={bookmarks} onRemoveBookmark={removeBookmark} sidebarTab={sidebarTab} setSidebarTab={setSidebarTab} completed={completed} /></div><div className="main-content"><header className="topbar"><button className="topbar-menu-btn" onClick={() => setSidebarOpen((v) => !v)} title="Toggle sidebar"><Menu size={18} /></button><div className="topbar-search"><Search size={14} className="topbar-search-icon" /><input type="text" placeholder="Search sections, passages…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} aria-label="Search" /></div><div className="topbar-right"><div className="font-controls"><button className="font-btn" onClick={() => setFontSize((f) => Math.max(14, f - 2))} title="Decrease font size"><Minus size={12} /></button><span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-display)", minWidth: 30, textAlign: "center" }}>{fontSize}</span><button className="font-btn" onClick={() => setFontSize((f) => Math.min(30, f + 2))} title="Increase font size"><Plus size={12} /></button></div><button className={`topbar-btn ${sidebarTab === "Bookmarks" && sidebarOpen ? "active" : ""}`} onClick={() => { setSidebarOpen(true); setSidebarTab("Bookmarks"); }}><BookOpen size={13} />Bookmarks</button></div></header><BibleReader section={activeSection} era={activeEra} isBookmarked={isBookmarked} addBookmark={addBookmark} removeBookmark={removeBookmark} isCompleted={isCompleted} markComplete={markComplete} markIncomplete={markIncomplete} getNote={getNote} saveNote={saveNote} fontSize={fontSize} onPrev={handlePrev} onNext={handleNext} hasPrev={currentIndex > 0} hasNext={currentIndex < flatSections.length - 1} /></div></div>);
}
