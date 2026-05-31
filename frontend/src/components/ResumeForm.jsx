import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .rb-root {
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
    background: #EDEBE6;
    padding: 2.5rem 2rem;
    color: #111;
  }

  .rb-header {
    max-width: 1140px;
    margin: 0 auto 2rem;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
    border-bottom: 1px solid #ddd;
    padding-bottom: 1rem;
  }

  .rb-header h1 {
    font-family: 'Inter', sans-serif;
    font-size: 2rem;
    font-weight: 700;
    color: #111;
    line-height: 1;
    letter-spacing: -0.03em;
  }

  .rb-header p {
    font-size: 0.88rem;
    color: #555;
    font-weight: 500;
  }

  .rb-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.75rem;
    max-width: 1140px;
    margin: 0 auto;
  }

  @media (max-width: 820px) { .rb-layout { grid-template-columns: 1fr; } }

  .rb-form-panel {
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 10px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    padding: 2rem;
  }

  .rb-section-label {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #53056b;
    margin-bottom: 0.75rem;
    margin-top: 1.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .rb-section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e5e5e5;
  }

  .rb-section-label:first-child { margin-top: 0; }

  .rb-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    color: #111;
    background: #fafafa;
    transition: border-color 0.15s;
    box-sizing: border-box;
    margin-bottom: 0.65rem;
    outline: none;
  }

  .rb-input::placeholder { color: #aaa; font-weight: 400; }

  .rb-input:focus {
    border-color: #53056b;
    background: #fff;
  }

  textarea.rb-input {
    resize: vertical;
    min-height: 100px;
    line-height: 1.6;
  }

  .rb-inline {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .rb-inline .rb-input { margin-bottom: 0; }

  .rb-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.65rem 1.25rem;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.15s;
    white-space: nowrap;
    letter-spacing: 0.02em;
  }

  .rb-btn:hover { transform: translateY(-1px); }
  .rb-btn:active { transform: translateY(0); }

  .rb-btn-add {
    background: #1f1d1d;
    color: #fff;
  }

  .rb-btn-add:hover { background: #111; border-color: #333; }

  .rb-btn-ai {
    background: #53056b;
    color: #fff;
    border-color: #53056b;
    width: 100%;
    justify-content: center;
    padding: 0.8rem;
    font-size: 0.88rem;
    margin-top: 0.25rem;
  }

  .rb-btn-ai:hover { background: #3e0550; border-color: #3e0550; }
  .rb-btn-ai:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .rb-btn-save {
    background: #111;
    color: #fff;
    flex: 1;
    justify-content: center;
  }

  .rb-btn-pdf {
    background: #fff;
    color: #111;
    border-color: #111;
    flex: 1;
    justify-content: center;
  }

  .rb-btn-pdf:hover { background: #111; color: #fff; }

  .rb-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #f0f0f0;
  }

  .rb-suggestion {
    background: #FFF8F5;
    border-left: 4px solid #53056b;
    padding: 0.9rem 1.1rem;
    font-size: 0.875rem;
    color: #333;
    line-height: 1.65;
    margin-top: 0.65rem;
    border-radius: 0 4px 4px 0;
  }

  .rb-suggestion-label {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #53056b;
    margin-bottom: 0.4rem;
  }

  .rb-tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
    margin-top: 0.6rem;
  }

  .rb-tag {
    color: #111;
    padding: 0.3rem 0.85rem;
    background: #dbd1d1;
    border-radius: 2px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
    letter-spacing: 0.02em;
  }

  .rb-tag:hover { background: #5f5d5f; }

  .rb-edu-exp-item {
    background: #f8f8f8;
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 0.65rem 1rem;
    font-size: 0.85rem;
    font-weight: 500;
    color: #222;
    margin-bottom: 0.4rem;
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .rb-edu-exp-item:hover { border-color: #53056b; color: #53056b; }
  .rb-edu-exp-item span { font-size: 0.72rem; color: #aaa; font-weight: 400; }

  /* ── Preview Panel ── */
  .rb-preview {
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 10px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    padding: 2.25rem 2.5rem;
    font-family: 'Inter', sans-serif;
    position: sticky;
    top: 1.5rem;
    min-height: 500px;
  }

  .rb-preview-name {
    font-family: 'Inter', sans-serif;
    font-size: 2rem;
    font-weight: 700;
    color: #111;
    line-height: 1.15;
    letter-spacing: -0.02em;
  }

  .rb-preview-contact {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 1.25rem;
    margin-top: 0.6rem;
    font-size: 0.82rem;
    color: #555;
    font-weight: 500;
  }

  .rb-preview-divider {
    height: 3px;
    background: #111;
    margin: 1.1rem 0;
  }

  .rb-preview-section-title {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #53056b;
    margin-bottom: 0.65rem;
    margin-top: 1.1rem;
  }

  .rb-preview-summary {
    font-size: 0.88rem;
    line-height: 1.7;
    color: #333;
    font-style: italic;
    font-family: 'Inter', sans-serif;
    font-weight: 400;
  }

  .rb-preview-skills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .rb-preview-skill-tag {
    color: #111;
    padding: 0.22rem 0.75rem;
    border-radius: 2px;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  .rb-preview-edu-item, .rb-preview-exp-item {
    margin-bottom: 0.75rem;
  }

  .rb-preview-edu-item strong, .rb-preview-exp-item strong {
    font-size: 0.9rem;
    color: #111;
    font-weight: 700;
    display: block;
  }

  .rb-preview-edu-item div, .rb-preview-exp-item div {
    font-size: 0.8rem;
    color: #777;
    margin-top: 0.1rem;
    font-weight: 500;
  }

  .rb-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 260px;
    color: #ccc;
    font-size: 0.88rem;
    gap: 0.75rem;
    text-align: center;
    font-weight: 500;
  }
`;

function ResumeForm() {
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", location: "", summary: "",
    skills: [], education: [], experiences: [], projects: "",
    certifications: [], achievements: [], languages: [], positionsOfResponsibility: []
  });

  const [tempSkill, setTempSkill] = useState("");
  const [tempEdu, setTempEdu] = useState({ degree: "", institution: "", year: "" });
  const [tempExp, setTempExp] = useState({ company: "", role: "", duration: "" });
  const [tempCert, setTempCert] = useState({ name: "", issuer: "", year: "" });
  const [tempAchievement, setTempAchievement] = useState({ title: "", description: "" });
  const [tempLanguage, setTempLanguage] = useState({ language: "", proficiency: "" });
  const [tempPOR, setTempPOR] = useState({ role: "", organization: "", duration: "" });
  const [suggestion, setSuggestion] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAIImprove = async () => {
    setLoadingAI(true);
    try {
      const res = await axios.post("http://localhost:5001/api/ai/suggest", { resumeText: form.summary });
      setSuggestion(res.data.suggestion);
    } catch { setSuggestion("Couldn't reach AI service. Try again."); }
    setLoadingAI(false);
  };

  const handleAddSkill = () => {
    if (tempSkill.trim()) { setForm({ ...form, skills: [...form.skills, tempSkill.trim()] }); setTempSkill(""); }
  };
  const handleRemoveSkill = (i) => setForm({ ...form, skills: form.skills.filter((_, idx) => idx !== i) });

  const handleAddEducation = () => {
    const { degree, institution, year } = tempEdu;
    if (degree && institution && year) { setForm({ ...form, education: [...form.education, tempEdu] }); setTempEdu({ degree: "", institution: "", year: "" }); }
  };
  const handleRemoveEducation = (i) => setForm({ ...form, education: form.education.filter((_, idx) => idx !== i) });

  const handleAddExperience = () => {
    const { company, role, duration } = tempExp;
    if (company && role && duration) { setForm({ ...form, experiences: [...form.experiences, tempExp] }); setTempExp({ company: "", role: "", duration: "" }); }
  };
  const handleRemoveExperience = (i) => setForm({ ...form, experiences: form.experiences.filter((_, idx) => idx !== i) });

  const handleAddCertification = () => {
    const { name, issuer } = tempCert;
    if (name && issuer) { setForm({ ...form, certifications: [...form.certifications, tempCert] }); setTempCert({ name: "", issuer: "", year: "" }); }
  };
  const handleRemoveCertification = (i) => setForm({ ...form, certifications: form.certifications.filter((_, idx) => idx !== i) });

  const handleAddAchievement = () => {
    if (tempAchievement.title) { setForm({ ...form, achievements: [...form.achievements, tempAchievement] }); setTempAchievement({ title: "", description: "" }); }
  };
  const handleRemoveAchievement = (i) => setForm({ ...form, achievements: form.achievements.filter((_, idx) => idx !== i) });

  const handleAddLanguage = () => {
    if (tempLanguage.language) { setForm({ ...form, languages: [...form.languages, tempLanguage] }); setTempLanguage({ language: "", proficiency: "" }); }
  };
  const handleRemoveLanguage = (i) => setForm({ ...form, languages: form.languages.filter((_, idx) => idx !== i) });

  const handleAddPOR = () => {
    if (tempPOR.role && tempPOR.organization) { setForm({ ...form, positionsOfResponsibility: [...form.positionsOfResponsibility, tempPOR] }); setTempPOR({ role: "", organization: "", duration: "" }); }
  };
  const handleRemovePOR = (i) => setForm({ ...form, positionsOfResponsibility: form.positionsOfResponsibility.filter((_, idx) => idx !== i) });

  const handleSave = async () => {
    try {
      const res = await axios.post("http://localhost:5001/api/resume", form);
      alert("Resume saved! ID: " + res.data._id);
    } catch { alert("Save failed. Is the backend running?"); }
  };

  const handleDownloadPDF = () => {
    const input = document.getElementById("resume-preview");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${form.fullName || "resume"}.pdf`);
    });
  };

  const isEmpty = !form.fullName && !form.email && !form.summary;

  return (
    <>
      <style>{styles}</style>
      <div className="rb-root">
        <div className="rb-header">
          <h1>Resume Builder</h1>
          <p>Fill in the left — preview updates live</p>
        </div>

        <div className="rb-layout">
          {/* Form */}
          <div className="rb-form-panel">
            <div className="rb-section-label">Personal Info</div>
            <input className="rb-input" name="fullName" placeholder="Full Name" onChange={handleChange} value={form.fullName} />
            <input className="rb-input" name="email" placeholder="Email Address" onChange={handleChange} value={form.email} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
              <input className="rb-input" name="phone" placeholder="Phone" onChange={handleChange} value={form.phone} style={{ marginBottom: 0 }} />
              <input className="rb-input" name="location" placeholder="Location" onChange={handleChange} value={form.location} style={{ marginBottom: 0 }} />
            </div>

            <div className="rb-section-label" style={{ marginTop: "1.5rem" }}>Summary</div>
            <textarea className="rb-input" name="summary" placeholder="A punchy professional summary..." onChange={handleChange} value={form.summary} />
            <button className="rb-btn rb-btn-ai" onClick={handleAIImprove} disabled={loadingAI}>
              {loadingAI ? "Improving…" : "✦ Improve with AI"}
            </button>
            {suggestion && (
              <div className="rb-suggestion">
                <div className="rb-suggestion-label">AI Suggestion</div>
                {suggestion}
              </div>
            )}

            <div className="rb-section-label">Skills</div>
            <div className="rb-inline">
              <input className="rb-input" value={tempSkill} onChange={(e) => setTempSkill(e.target.value)}
                placeholder="e.g. React, Python, Figma" onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                style={{ marginBottom: 0 }} />
              <button className="rb-btn rb-btn-add" onClick={handleAddSkill}>Add</button>
            </div>
            {form.skills.length > 0 && (
              <div className="rb-tag-list">
                {form.skills.map((s, i) => (
                  <span key={i} className="rb-tag" title="Click to remove" onClick={() => handleRemoveSkill(i)}>{s} ×</span>
                ))}
              </div>
            )}

            <div className="rb-section-label">Education</div>
            <input className="rb-input" placeholder="Degree / Qualification" value={tempEdu.degree} onChange={(e) => setTempEdu({ ...tempEdu, degree: e.target.value })} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 90px", gap: "0.65rem" }}>
              <input className="rb-input" placeholder="Institution" value={tempEdu.institution} onChange={(e) => setTempEdu({ ...tempEdu, institution: e.target.value })} style={{ marginBottom: 0 }} />
              <input className="rb-input" placeholder="Year" value={tempEdu.year} onChange={(e) => setTempEdu({ ...tempEdu, year: e.target.value })} style={{ marginBottom: 0 }} />
            </div>
            <button className="rb-btn rb-btn-add" style={{ marginTop: "0.65rem" }} onClick={handleAddEducation}>Add Education</button>
            {form.education.map((edu, i) => (
              <div key={i} className="rb-edu-exp-item" onClick={() => handleRemoveEducation(i)}>
                <span>{edu.degree} — {edu.institution}</span>
                <span>{edu.year} · remove</span>
              </div>
            ))}

            <div className="rb-section-label">Experience</div>
            <input className="rb-input" placeholder="Company" value={tempExp.company} onChange={(e) => setTempExp({ ...tempExp, company: e.target.value })} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
              <input className="rb-input" placeholder="Role / Title" value={tempExp.role} onChange={(e) => setTempExp({ ...tempExp, role: e.target.value })} style={{ marginBottom: 0 }} />
              <input className="rb-input" placeholder="Duration" value={tempExp.duration} onChange={(e) => setTempExp({ ...tempExp, duration: e.target.value })} style={{ marginBottom: 0 }} />
            </div>
            <button className="rb-btn rb-btn-add" style={{ marginTop: "0.65rem" }} onClick={handleAddExperience}>Add Experience</button>
            {form.experiences.map((exp, i) => (
              <div key={i} className="rb-edu-exp-item" onClick={() => handleRemoveExperience(i)}>
                <span>{exp.role} at {exp.company}</span>
                <span>{exp.duration} · remove</span>
              </div>
            ))}

            <div className="rb-section-label">Certifications</div>
            <input className="rb-input" placeholder="Certification name" value={tempCert.name} onChange={(e) => setTempCert({ ...tempCert, name: e.target.value })} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 90px", gap: "0.65rem" }}>
              <input className="rb-input" placeholder="Issuing organization" value={tempCert.issuer} onChange={(e) => setTempCert({ ...tempCert, issuer: e.target.value })} style={{ marginBottom: 0 }} />
              <input className="rb-input" placeholder="Year" value={tempCert.year} onChange={(e) => setTempCert({ ...tempCert, year: e.target.value })} style={{ marginBottom: 0 }} />
            </div>
            <button className="rb-btn rb-btn-add" style={{ marginTop: "0.65rem" }} onClick={handleAddCertification}>Add Certification</button>
            {form.certifications.map((cert, i) => (
              <div key={i} className="rb-edu-exp-item" onClick={() => handleRemoveCertification(i)}>
                <span>{cert.name} — {cert.issuer}</span>
                <span>{cert.year && `${cert.year} · `}remove</span>
              </div>
            ))}

            <div className="rb-section-label">Achievements</div>
            <input className="rb-input" placeholder="Achievement title" value={tempAchievement.title} onChange={(e) => setTempAchievement({ ...tempAchievement, title: e.target.value })} />
            <input className="rb-input" placeholder="Brief description (optional)" value={tempAchievement.description} onChange={(e) => setTempAchievement({ ...tempAchievement, description: e.target.value })} />
            <button className="rb-btn rb-btn-add" onClick={handleAddAchievement}>Add Achievement</button>
            {form.achievements.map((ach, i) => (
              <div key={i} className="rb-edu-exp-item" onClick={() => handleRemoveAchievement(i)}>
                <span>{ach.title}</span>
                <span>remove</span>
              </div>
            ))}

            <div className="rb-section-label">Languages</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
              <input className="rb-input" placeholder="Language" value={tempLanguage.language} onChange={(e) => setTempLanguage({ ...tempLanguage, language: e.target.value })} style={{ marginBottom: 0 }} />
              <input className="rb-input" placeholder="Proficiency" value={tempLanguage.proficiency} onChange={(e) => setTempLanguage({ ...tempLanguage, proficiency: e.target.value })} style={{ marginBottom: 0 }} />
            </div>
            <button className="rb-btn rb-btn-add" style={{ marginTop: "0.65rem" }} onClick={handleAddLanguage}>Add Language</button>
            {form.languages.length > 0 && (
              <div className="rb-tag-list">
                {form.languages.map((lang, i) => (
                  <span key={i} className="rb-tag" onClick={() => handleRemoveLanguage(i)}>
                    {lang.language}{lang.proficiency ? ` · ${lang.proficiency}` : ""} ×
                  </span>
                ))}
              </div>
            )}

            <div className="rb-section-label">Positions of Responsibility</div>
            <input className="rb-input" placeholder="Role / Title" value={tempPOR.role} onChange={(e) => setTempPOR({ ...tempPOR, role: e.target.value })} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
              <input className="rb-input" placeholder="Organization / Club" value={tempPOR.organization} onChange={(e) => setTempPOR({ ...tempPOR, organization: e.target.value })} style={{ marginBottom: 0 }} />
              <input className="rb-input" placeholder="Duration" value={tempPOR.duration} onChange={(e) => setTempPOR({ ...tempPOR, duration: e.target.value })} style={{ marginBottom: 0 }} />
            </div>
            <button className="rb-btn rb-btn-add" style={{ marginTop: "0.65rem" }} onClick={handleAddPOR}>Add Position</button>
            {form.positionsOfResponsibility.map((por, i) => (
              <div key={i} className="rb-edu-exp-item" onClick={() => handleRemovePOR(i)}>
                <span>{por.role} — {por.organization}</span>
                <span>{por.duration && `${por.duration} · `}remove</span>
              </div>
            ))}

            <div className="rb-actions">
              <button className="rb-btn rb-btn-save" onClick={handleSave}>↑ Save Resume</button>
              <button className="rb-btn rb-btn-pdf" onClick={handleDownloadPDF}>↓ Download PDF</button>
            </div>
          </div>

          {/* Preview */}
          <div id="resume-preview" className="rb-preview">
            {isEmpty ? (
              <div className="rb-empty-state">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="7" y1="8" x2="17" y2="8" />
                  <line x1="7" y1="12" x2="13" y2="12" />
                  <line x1="7" y1="16" x2="15" y2="16" />
                </svg>
                <span>Your resume preview appears here</span>
              </div>
            ) : (
              <>
                {form.fullName && <div className="rb-preview-name">{form.fullName}</div>}
                <div className="rb-preview-contact">
                  {form.email && <span>{form.email}</span>}
                  {form.phone && <span>{form.phone}</span>}
                  {form.location && <span>{form.location}</span>}
                </div>

                {form.summary && (
                  <>
                    <div className="rb-preview-divider" />
                    <div className="rb-preview-section-title">About</div>
                    <div className="rb-preview-summary">{form.summary}</div>
                  </>
                )}

                {form.skills.length > 0 && (
                  <>
                    <div className="rb-preview-section-title">Skills</div>
                    <div className="rb-preview-skills">
                      {form.skills.map((s, i) => <span key={i} className="rb-preview-skill-tag">{s}</span>)}
                    </div>
                  </>
                )}

                {form.education.length > 0 && (
                  <>
                    <div className="rb-preview-section-title">Education</div>
                    {form.education.map((edu, i) => (
                      <div key={i} className="rb-preview-edu-item">
                        <strong>{edu.degree}</strong>
                        <div>{edu.institution} · {edu.year}</div>
                      </div>
                    ))}
                  </>
                )}

                {form.experiences.length > 0 && (
                  <>
                    <div className="rb-preview-section-title">Experience</div>
                    {form.experiences.map((exp, i) => (
                      <div key={i} className="rb-preview-exp-item">
                        <strong>{exp.role}</strong>
                        <div>{exp.company} · {exp.duration}</div>
                      </div>
                    ))}
                  </>
                )}

                {form.certifications.length > 0 && (
                  <>
                    <div className="rb-preview-divider" />
                    <div className="rb-preview-section-title">Certifications</div>
                    {form.certifications.map((cert, i) => (
                      <div key={i} className="rb-preview-edu-item">
                        <strong>{cert.name}</strong>
                        <div>{cert.issuer}{cert.year && ` · ${cert.year}`}</div>
                      </div>
                    ))}
                  </>
                )}

                {form.achievements.length > 0 && (
                  <>
                    <div className="rb-preview-divider" />
                    <div className="rb-preview-section-title">Achievements</div>
                    {form.achievements.map((ach, i) => (
                      <div key={i} className="rb-preview-edu-item">
                        <strong>{ach.title}</strong>
                        {ach.description && <div>{ach.description}</div>}
                      </div>
                    ))}
                  </>
                )}

                {form.languages.length > 0 && (
                  <>
                    <div className="rb-preview-divider" />
                    <div className="rb-preview-section-title">Languages</div>
                    <div className="rb-preview-skills">
                      {form.languages.map((lang, i) => (
                        <span key={i} className="rb-preview-skill-tag">
                          {lang.language}{lang.proficiency ? ` · ${lang.proficiency}` : ""}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                {form.positionsOfResponsibility.length > 0 && (
                  <>
                    <div className="rb-preview-divider" />
                    <div className="rb-preview-section-title">Positions of Responsibility</div>
                    {form.positionsOfResponsibility.map((por, i) => (
                      <div key={i} className="rb-preview-exp-item">
                        <strong>{por.role}</strong>
                        <div>{por.organization}{por.duration && ` · ${por.duration}`}</div>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ResumeForm;