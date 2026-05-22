import { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck, CheckCircle, Circle, ChevronLeft, ChevronRight } from "lucide-react";
import PassageBlock from "./PassageBlock";

export default function BibleReader({
  section,
  era,
  isBookmarked,
  addBookmark,
  removeBookmark,
  isCompleted,
  markComplete,
  markIncomplete,
  getNote,
  saveNote,
  fontSize,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}) {
  const [note, setNote] = useState("");

  useEffect(() => {
    if (section) setNote(getNote(section.id));
  }, [section?.id]);

  if (!section) {
    return (
      <div className="reader-area">
        <div className="reader-empty">
          <div className="reader-empty-icon">✦</div>
          <h2>Select a Section to Begin</h2>
          <p>
            Choose any section from the chronological outline in the sidebar.
            The Bible text will appear here, arranged as it happened in history.
          </p>
          <p style={{ marginTop: 8, fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-display)", letterSpacing: "0.06em" }}>
            KJV TEXT · REESE CHRONOLOGICAL ARRANGEMENT · 2016 EDITION
          </p>
        </div>
      </div>
    );
  }

  const bookmarked = isBookmarked(section.id);
  const completed = isCompleted(section.id);

  const handleBookmark = () => {
    if (bookmarked) removeBookmark(section.id);
    else addBookmark(section.id, section.title, era?.era || "");
  };

  const handleComplete = () => {
    if (completed) markIncomplete(section.id);
    else markComplete(section.id);
  };

  const handleNoteBlur = () => {
    if (section) saveNote(section.id, note);
  };

  return (
    <div className="reader-area">
      {/* Header */}
      <div className="section-header">
        <div className="section-breadcrumb">
          <span className="breadcrumb-era">{era?.era}</span>
          {era?.dateRange && (
            <>
              <span>·</span>
              <span>{era.dateRange}</span>
            </>
          )}
        </div>

        <div className="section-title-row">
          <h2 className="section-title">
            <span style={{ color: "var(--gold-dim)", fontWeight: 400 }}>{section.label}. </span>
            {section.title}
          </h2>
          <div className="section-actions">
            <button
              className={`action-btn ${bookmarked ? "bookmarked" : ""}`}
              onClick={handleBookmark}
              title={bookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              {bookmarked ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
              {bookmarked ? "Saved" : "Bookmark"}
            </button>
            <button
              className={`action-btn ${completed ? "completed" : ""}`}
              onClick={handleComplete}
              title={completed ? "Mark as unread" : "Mark as read"}
            >
              {completed ? <CheckCircle size={14} /> : <Circle size={14} />}
              {completed ? "Read" : "Mark Read"}
            </button>
          </div>
        </div>
      </div>

      {/* Inter-testamental info note (no passages) */}
      {section.note && (
        <div className="info-note-block">
          {section.note}
        </div>
      )}

      {/* Bible Passages */}
      {section.passages && section.passages.length > 0 && (
        <div className="fade-in">
          {section.passages.map((ref) => (
            <PassageBlock key={ref} reference={ref} fontSize={fontSize} />
          ))}
        </div>
      )}

      {/* Ornament */}
      <div className="ornament">✦</div>

      {/* Personal Notes */}
      <div className="notes-section">
        <h4>Personal Study Notes</h4>
        <textarea
          className="notes-textarea"
          placeholder="Write your thoughts, reflections, or cross-references here…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={handleNoteBlur}
        />
      </div>

      {/* Prev / Next navigation */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: 40,
        paddingTop: 24,
        borderTop: "1px solid var(--border-subtle)",
        gap: 16,
      }}>
        <button
          className="action-btn"
          onClick={onPrev}
          disabled={!hasPrev}
          style={{ opacity: hasPrev ? 1 : 0.3 }}
        >
          <ChevronLeft size={14} /> Previous
        </button>
        <button
          className="action-btn"
          onClick={onNext}
          disabled={!hasNext}
          style={{ opacity: hasNext ? 1 : 0.3 }}
        >
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
