import React, { useState, useRef } from "react";
import axios from "axios";
import "./ResumeAnalyzer.css";
import Icon from "./Icons";

// ── Helpers ───────────────────────────────────────────────────────────────────
function scoreClass(n) {
  if (n >= 80) return "great";
  if (n >= 60) return "good";
  if (n >= 40) return "fair";
  return "weak";
}

function scoreLabel(n) {
  if (n >= 80) return "Strong Resume";
  if (n >= 60) return "Good Resume";
  if (n >= 40) return "Needs Work";
  return "Weak Resume";
}

function barColor(cls) {
  return { great: "#1a6b3c", good: "#C8622A", fair: "#e0a000", weak: "#c0392b" }[cls];
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// ── Sub-components ────────────────────────────────────────────────────────────
function FeedbackIcon({ type }) {
  if (type === "positive") return <Icon name="check-circle" size={17} color="#1a6b3c" />;
  if (type === "warning")  return <Icon name="alert-triangle" size={17} color="#e0a000" />;
  return <Icon name="lightbulb" size={17} color="#C8622A" />;
}

function FileIcon({ filename }) {
  const ext = filename?.split(".").pop().toLowerCase();
  if (ext === "pdf")  return <Icon name="file-pdf" size={20} color="#fff" />;
  if (ext === "docx") return <Icon name="file-text" size={20} color="#fff" />;
  return <Icon name="file" size={20} color="#fff" />;
}

// ── Dropzone ──────────────────────────────────────────────────────────────────
function DropZone({ fileInputRef, onFileSelect, dragOver, onDragOver, onDragLeave, onDrop }) {
  return (
    <div
      className={`az-dropzone${dragOver ? " drag-over" : ""}`}
      onClick={() => fileInputRef.current?.click()}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="az-dropzone-icon">
        <Icon name="upload" size={24} color="#888" />
      </div>
      <div className="az-dropzone-title">Drop your resume here or click to browse</div>
      <div className="az-dropzone-sub">Text is extracted automatically — no manual copying needed</div>
      <div className="az-dropzone-formats">
        <span className="az-format-badge">PDF</span>
        <span className="az-format-badge">DOCX</span>
        <span className="az-format-badge">TXT</span>
      </div>
    </div>
  );
}

// ── FileCard ──────────────────────────────────────────────────────────────────
function FileCard({ file, extracting, extractedOk, wordCount: wc, onRemove }) {
  return (
    <div className="az-file-selected">
      <div className="az-file-info">
        <div className="az-file-icon">
          <FileIcon filename={file.name} />
        </div>
        <div className="az-file-details">
          <div className="az-file-name">{file.name}</div>
          <div className="az-file-size">{formatFileSize(file.size)}</div>
        </div>
        <button className="az-file-remove" onClick={onRemove}>
          <Icon name="x" size={13} color="currentColor" />
          Remove
        </button>
      </div>

      {extracting && (
        <div className="az-file-status extracting">
          <div className="az-spinner sm" />
          Extracting text…
        </div>
      )}
      {!extracting && extractedOk && (
        <div className="az-file-status extracted">
          <Icon name="check" size={14} color="#1a6b3c" />
          {wc} words extracted — ready to analyze
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ResumeAnalyzer() {
  const [mode, setMode]           = useState("general");   // "general" | "jd"
  const [inputMode, setInputMode] = useState("paste");     // "paste" | "upload"
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText]       = useState("");
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState(null);
  const [error, setError]         = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extracting, setExtracting]     = useState(false);
  const [extractedOk, setExtractedOk]   = useState(false);
  const [dragOver, setDragOver]         = useState(false);
  const fileInputRef = useRef(null);

  // ── File extraction ─────────────────────────────────────────────────────────
  const extractTextFromFile = async (file) => {
    setExtracting(true);
    setExtractedOk(false);
    setError("");
    try {
      const ext = file.name.split(".").pop().toLowerCase();

      if (ext === "txt" || ext === "md") {
        setResumeText(await file.text());
        setExtractedOk(true);

      } else if (ext === "pdf") {
        if (!window.pdfjsLib) {
          await new Promise((res, rej) => {
            const s = document.createElement("script");
            s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
            s.onload = res; s.onerror = rej;
            document.head.appendChild(s);
          });
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        }
        const pdf = await window.pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page    = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((it) => it.str).join(" ") + "\n";
        }
        setResumeText(text.trim());
        setExtractedOk(true);

      } else if (ext === "docx") {
        if (!window.mammoth) {
          await new Promise((res, rej) => {
            const s = document.createElement("script");
            s.src = "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js";
            s.onload = res; s.onerror = rej;
            document.head.appendChild(s);
          });
        }
        const { value } = await window.mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
        setResumeText(value.trim());
        setExtractedOk(true);

      } else {
        setError("Unsupported file type. Please upload a PDF, DOCX, or TXT file.");
        setUploadedFile(null);
      }
    } catch (err) {
      setError("Could not read this file. Try a different file or paste your resume text.");
      console.error(err);
    }
    setExtracting(false);
  };

  const handleFileSelect = async (file) => {
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    if (!["pdf", "docx", "txt", "md"].includes(ext)) {
      setError("Please upload a PDF, DOCX, or TXT file.");
      return;
    }
    setUploadedFile(file);
    setResumeText("");
    setExtractedOk(false);
    await extractTextFromFile(file);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setResumeText("");
    setExtractedOk(false);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleInputModeSwitch = (next) => {
    setInputMode(next);
    setResumeText("");
    setUploadedFile(null);
    setExtractedOk(false);
    setError("");
  };

  // ── Analyze ─────────────────────────────────────────────────────────────────
  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError(
        inputMode === "upload"
          ? "File text could not be extracted. Try a different file or switch to paste mode."
          : "Please paste your resume text first."
      );
      return;
    }
    if (mode === "jd" && !jdText.trim()) {
      setError("Please paste the job description too.");
      return;
    }
    setError(""); setLoading(true); setResult(null);
    try {
      const endpoint = mode === "jd" ? "/api/ai/analyze-jd" : "/api/ai/analyze";
      const payload  = mode === "jd" ? { resumeText, jobDescription: jdText } : { resumeText };
      const res      = await axios.post(`http://localhost:5001${endpoint}`, payload);
      setResult(res.data);
    } catch {
      setError("Could not reach the AI service. Make sure the backend is running.");
    }
    setLoading(false);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="az-root">
      {/* Header */}
      <div className="az-header">
        <h1>AI Analysis</h1>
        <p>Upload or paste your resume for instant AI-powered feedback, scores &amp; suggestions</p>
      </div>

      <div className="az-grid">

        {/* ── Input Card ───────────────────────────────────────────────────── */}
        <div className="az-card az-card-full">

          {/* Analysis mode tabs */}
          <div className="az-card-label">Analysis Mode</div>
          <div className="az-mode-tabs">
            <button
              className={`az-tab${mode === "general" ? " active" : ""}`}
              onClick={() => setMode("general")}
            >
              <Icon name="activity" size={14} color="currentColor" />
              General Analysis
            </button>
            <button
              className={`az-tab${mode === "jd" ? " active" : ""}`}
              onClick={() => setMode("jd")}
            >
              <Icon name="search" size={14} color="currentColor" />
              Match to Job Description
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: mode === "jd" ? "1fr 1fr" : "1fr", gap: "1.25rem" }}>

            {/* Resume input */}
            <div>
              <div className="az-card-label">Your Resume</div>

              {/* Paste / Upload toggle */}
              <div className="az-input-toggle">
                <button
                  className={`az-input-toggle-btn${inputMode === "paste" ? " active" : ""}`}
                  onClick={() => handleInputModeSwitch("paste")}
                >
                  <Icon name="paste" size={13} color="currentColor" />
                  Paste Text
                </button>
                <button
                  className={`az-input-toggle-btn${inputMode === "upload" ? " active" : ""}`}
                  onClick={() => handleInputModeSwitch("upload")}
                >
                  <Icon name="upload" size={13} color="currentColor" />
                  Upload File
                </button>
              </div>

              {inputMode === "paste" ? (
                <>
                  <textarea
                    className="az-textarea"
                    placeholder="Paste your full resume text here — include all sections: summary, experience, education, skills, etc."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                  />
                  <div className="az-hint">
                    {wordCount(resumeText)} words · {resumeText.length} characters
                  </div>
                </>
              ) : (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.txt,.md"
                    className="az-file-input"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                  />
                  {!uploadedFile ? (
                    <DropZone
                      fileInputRef={fileInputRef}
                      onFileSelect={handleFileSelect}
                      dragOver={dragOver}
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileSelect(e.dataTransfer.files[0]); }}
                    />
                  ) : (
                    <FileCard
                      file={uploadedFile}
                      extracting={extracting}
                      extractedOk={extractedOk}
                      wordCount={wordCount(resumeText)}
                      onRemove={handleRemoveFile}
                    />
                  )}
                </>
              )}
            </div>

            {/* Job description input */}
            {mode === "jd" && (
              <div>
                <div className="az-card-label">Job Description</div>
                <textarea
                  className="az-textarea"
                  placeholder="Paste the job description here. The AI will compare your resume against it for keyword match, skills alignment and role fit."
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                />
                <div className="az-hint">{jdText.length} characters</div>
              </div>
            )}
          </div>

          {error && (
            <div className="az-error">
              <Icon name="alert-triangle" size={16} color="#c0392b" />
              {error}
            </div>
          )}

          <button
            className="az-btn-primary"
            onClick={handleAnalyze}
            disabled={loading || extracting}
          >
            {loading ? (
              <><div className="az-spinner sm" /> Analyzing…</>
            ) : extracting ? (
              <><div className="az-spinner sm" /> Extracting file…</>
            ) : (
              <><Icon name="cpu" size={16} color="#fff" /> Analyze with AI</>
            )}
          </button>
        </div>

        {/* ── Loading ───────────────────────────────────────────────────────── */}
        {loading && (
          <div className="az-card az-card-full">
            <div className="az-loading">
              <div className="az-spinner" />
              <span>AI is reading your resume…</span>
            </div>
          </div>
        )}

        {/* ── Empty state ───────────────────────────────────────────────────── */}
        {!loading && !result && (
          <div className="az-card az-card-full">
            <div className="az-empty">
              <Icon name="activity" size={44} color="#ccc" />
              <span>Your analysis results will appear here</span>
            </div>
          </div>
        )}

        {/* ── Results ───────────────────────────────────────────────────────── */}
        {result && !loading && (
          <>
            {/* Overall Score */}
            <div className="az-card">
              <div className="az-card-label">Overall Score</div>
              <div className="az-score-row">
                <div className={`az-score-circle ${scoreClass(result.overallScore)}`}>
                  {result.overallScore}
                </div>
                <div className="az-score-meta">
                  <h3>{scoreLabel(result.overallScore)}</h3>
                  <p>{result.overallSummary}</p>
                </div>
              </div>
            </div>

            {/* ATS Score */}
            {result.atsScore !== undefined && (
              <div className="az-card">
                <div className="az-card-label">ATS Compatibility</div>
                <div className="az-score-row">
                  <div className={`az-score-circle ${scoreClass(result.atsScore)}`}>
                    {result.atsScore}
                  </div>
                  <div className="az-score-meta">
                    <h3>ATS Score</h3>
                    <p>{result.atsSummary || "Based on keyword density, section structure & formatting."}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Section Breakdown */}
            {result.sectionScores && (
              <div className="az-card az-card-full">
                <div className="az-card-label">Section Breakdown</div>
                <div className="az-section-grid">
                  {Object.entries(result.sectionScores).map(([section, score]) => {
                    const cls = scoreClass(score);
                    return (
                      <div className="az-section-pill" key={section}>
                        <div className="az-section-pill-label">{section}</div>
                        <div className={`az-section-pill-score ${cls}`}>
                          {score}
                          <span style={{ fontSize: "0.75rem", fontFamily: "Epilogue", fontWeight: 600 }}>/100</span>
                        </div>
                        <div className="az-pill-bar">
                          <div className="az-pill-bar-fill" style={{ width: `${score}%`, background: barColor(cls) }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* JD Match */}
            {mode === "jd" && result.matchScore !== undefined && (
              <div className="az-card az-card-full">
                <div className="az-card-label">Job Description Match</div>
                <div className="az-match-pct">{result.matchScore}% Match</div>
                <div className="az-match-bar-wrap">
                  <div className="az-match-bar-fill" style={{ width: `${result.matchScore}%` }} />
                </div>
                <p style={{ fontSize: "0.875rem", color: "#444", lineHeight: 1.65, fontWeight: 500 }}>
                  {result.matchSummary}
                </p>

                {result.presentKeywords?.length > 0 && (
                  <>
                    <div className="az-kw-section-label" style={{ color: "#1a6b3c" }}>
                      <Icon name="check-circle" size={13} color="#1a6b3c" />
                      Keywords Found
                    </div>
                    <div className="az-keywords-wrap">
                      {result.presentKeywords.map((kw) => (
                        <span key={kw} className="az-kw-tag present">{kw}</span>
                      ))}
                    </div>
                  </>
                )}

                {result.missingKeywords?.length > 0 && (
                  <>
                    <div className="az-kw-section-label" style={{ color: "#c0392b" }}>
                      <Icon name="x" size={13} color="#c0392b" />
                      Missing Keywords
                    </div>
                    <div className="az-keywords-wrap">
                      {result.missingKeywords.map((kw) => (
                        <span key={kw} className="az-kw-tag missing">{kw}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Improvements */}
            {result.improvements?.length > 0 && (
              <div className="az-card az-card-full">
                <div className="az-card-label">Improvement Suggestions</div>
                <div className="az-feedback-list">
                  {result.improvements.map((item, i) => (
                    <div className="az-feedback-item" key={i}>
                      <span className="az-feedback-icon">
                        <FeedbackIcon type={item.type} />
                      </span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tone */}
            {result.toneNotes?.length > 0 && (
              <div className="az-card az-card-full">
                <div className="az-card-label">Language &amp; Tone</div>
                <div className="az-feedback-list">
                  {result.toneNotes.map((note, i) => (
                    <div className="az-feedback-item" key={i}>
                      <span className="az-feedback-icon">
                        <Icon name="edit" size={17} color="#555" />
                      </span>
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
