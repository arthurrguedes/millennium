import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SubmitPage.css';

export function SubmitPage() {
  const [submissionType, setSubmissionType] = useState('record');
  const [isSubmitted, setIsSubmitted] = useState(false); // Novo estado para sucesso

  const handleTypeChange = (e) => {
    setSubmissionType(e.target.value);
  };

  // Função para "enviar" e limpar o formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui seria onde a lógica de backend entraria. 
    // Por enquanto, apenas simulamos o envio.
    setIsSubmitted(true);
    window.scrollTo(0, 0); // Volta para o topo para ver a mensagem
  };

  // Função para resetar e permitir nova submissão
  const handleReset = () => {
    setIsSubmitted(false);
    setSubmissionType('record');
  };

  const isPersonProfile = submissionType === 'producer' || submissionType === 'songwriter';

  return (
    <div className="submit-page-container">
      <div className="submit-header">
        <span className="accent-text">Millennium Awards Submission Portal</span>
        <h1>Submit Your Work</h1>
        <p>Select the appropriate category and fill out the details for the 2026 eligibility cycle.</p>
        <p className="submit-guidelines">
          Follow the criteria of submissions in <Link to="/about">Rules & Guidelines</Link>
        </p>
      </div>

      <div className="submit-form-card">
        {isSubmitted ? (
          /* MENSAGEM DE SUCESSO */
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h2>Submission Received!</h2>
            <p>Your entry has been successfully sent to the Millennium Awards committee for review.</p>
            <button onClick={handleReset} className="submit-btn secondary">
              SUBMIT ANOTHER WORK
            </button>
          </div>
        ) : (
          /* FORMULÁRIO */
          <>
            <div className="form-group">
              <label>Submission Category</label>
              <select value={submissionType} onChange={handleTypeChange} className="submit-select">
                <option value="record">Record</option>
                <option value="song">Song</option>
                <option value="album">Album</option>
                <option value="artist">Artist</option>
                <option value="producer">Producer</option>
                <option value="songwriter">Songwriter</option>
                <option value="video">Music Video</option>
                <option value="visual">Music for Visual Media</option>
                <option value="eng">Album Engineering</option>
                <option value="vocal">Vocal Performance</option>
              </select>
            </div>

            <form className="dynamic-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                {isPersonProfile ? (
                  <>
                    <div className="form-group full-width">
                      <label>{submissionType === 'producer' ? 'Producer Name' : 'Songwriter Name'}</label>
                      <input type="text" placeholder="Enter full name" required />
                    </div>
                    <div className="form-group full-width">
                      <label>Relevant Works (Eligibility Period)</label>
                      <textarea placeholder="Describe relevant works..." required></textarea>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <label>{submissionType === 'eng' ? 'Work Title' : 'Lead Artist Name'}</label>
                      <input type="text" placeholder={submissionType === 'eng' ? "Enter project title" : "Names separated by comma"} required />
                    </div>

                    {submissionType !== 'artist' && submissionType !== 'eng' && (
                      <div className="form-group">
                        <label>{submissionType === 'album' ? 'Album Title' : 'Title'}</label>
                        <input type="text" placeholder={`Enter ${submissionType} title`} required />
                      </div>
                    )}

                    <div className="form-group">
                      <label>Release Date</label>
                      <input type="date" required />
                    </div>

                    <div className="form-group">
                      <label>Genre / Field</label>
                      <select className="submit-select">
                        <option>Pop</option>
                        <option>Dance / Electronic</option>
                        <option>Latín</option>
                        <option>Global</option>
                        <option>R&B & Soul</option>
                        <option>Rap</option>
                        <option>African Music</option>
                        <option>Alternative</option>
                        <option>Rock & Metal</option>
                        <option>Country</option>
                        <option>Jazz & Traditional Pop</option>
                      </select>
                    </div>

                    {submissionType === 'eng' && (
                      <>
                        <div className="form-group">
                          <label>Producer Assistants</label>
                          <input type="text" placeholder="Names separated by comma" />
                        </div>
                        <div className="form-group">
                          <label>Sound Engineers</label>
                          <input type="text" placeholder="Names separated by comma" />
                        </div>
                        <div className="form-group">
                          <label>Mixing Engineers</label>
                          <input type="text" placeholder="Names separated by comma" />
                        </div>
                        <div className="form-group">
                          <label>Master Engineers</label>
                          <input type="text" placeholder="Names separated by comma" />
                        </div>
                      </>
                    )}

                    {['record', 'song', 'album', 'visual'].includes(submissionType) && (
                      <>
                        {(submissionType === 'record' || submissionType === 'album' || submissionType === 'visual') && (
                          <div className="form-group">
                            <label>Producer(s)</label>
                            <input type="text" placeholder="Names separated by comma" />
                          </div>
                        )}
                        {(submissionType === 'song' || submissionType === 'album' || submissionType === 'visual') && (
                          <div className="form-group">
                            <label>Songwriter(s)</label>
                            <input type="text" placeholder="Names separated by comma" />
                          </div>
                        )}
                      </>
                    )}

                    {submissionType === 'video' && (
                      <div className="form-group">
                        <label>Director</label>
                        <input type="text" placeholder="Names separated by comma" />
                      </div>
                    )}

                    {submissionType === 'artist' && (
                      <div className="form-group full-width">
                        <label>Brief Bio / Career Highlights</label>
                        <textarea placeholder="Describe achievements..." required></textarea>
                      </div>
                    )}

                    <div className="form-group full-width">
                      <label>Streaming / Video Link</label>
                      <input type="url" placeholder="Spotify, Apple Music, or YouTube Link" required />
                    </div>
                  </>
                )}
              </div>

              <button type="submit" className="submit-btn">
                SUBMIT FOR CONSIDERATION
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}