import React, { useState } from 'react';
import './AboutPage.css';

export function AboutPage() {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  return (
    <div className="about-page-container">
      <div className="about-content">
        <span className="accent-text">Established in 1997</span>
        <h1>About Us</h1>
        
        <div className="about-description">
          <p>
            The Millennium Awards is a premier global music ceremony dedicated to honoring 
            artistic excellence and technical mastery across all genres. Since its inception, 
            it has served as a beacon for creators who push the boundaries of sound, 
            vision, and cultural impact.
          </p>
          <p>
            Our mission is to provide a prestigious platform that recognizes not only 
            the global icons at the top of their games but also the songwriters, producers, 
            and technical crews who are the architects of modern music.
          </p>
        </div>

        {/* Seção Acordeão */}
        <div className="ranking-section-accordion" style={{ marginTop: '50px' }}>
          <button 
            className={`accordion-toggle ${isAccordionOpen ? 'active' : ''}`}
            onClick={toggleAccordion}
          >
            <h2>RULES & GUIDELINES</h2>
            <span className="toggle-icon">{isAccordionOpen ? '▾' : '▸'}</span>
          </button>
          
          {isAccordionOpen && (
            <div className="accordion-content">
              <div className="rules-grid">
                <div className="rule-item">
                  <span className="accent-text">01. ELIGIBILITY</span>
                  <p><b>Media Formats:</b> Record labels and independent artists may submit albums, singles, individual tracks, or visual media within the eligibility window. Track submissions are not restricted to officially released singles.</p>
                  <p><b>Eligibility Window:</b> Works must be released between October 1st and September 30th of the eligibility cycle to be considered for a nomination. Failure to submit a work within the designated timeframe renders it ineligible for nomination. No further entries will be accepted for that cycle, only for the next with the sole exception of works qualifying under the Five-Year Exception Rule, as detailed in the subsequent section.</p>
                  <p>Tracks originally released as part of an album in a prior period qualify for the current cycle if they are officially released as a single within the current eligibility window.</p>
                  <p><b>The Five-Year Exception:</b> There is a specific exception regarding eligibility: works released up to five years ago may be nominated if they achieved significant prominence within the current eligibility window, provided they have never been submitted to any previous edition. </p>
                  <p><b>Re-recordings and Remasters:</b> Re-recorded versions of previously released material are eligible only if the new recording features significantly updated arrangements or production. Remastered versions of old recordings with no new artistic input are strictly ineligible.</p>
                  <p><b>Live Material:</b> Live recordings of previously released songs qualify for nomination only if they are part of a new, commercially available project and offer a distinct artistic interpretation compared to the original studio version.</p>
                  <p><b>Posthumous Eligibility:</b> Works by deceased artists are eligible for nomination, provided the recordings were completed and released within the current eligibility window and meet all other standard criteria.</p>

                </div>
                <div className="rule-item">
                  <span className="accent-text">02. SUBMISSION</span>
                  <p><b>Commercial Availability:</b> All records must be commercially available via recognized streaming platforms or physical retailers. Exclusive or limited releases can't be submitted.</p>
                  <p><b>Content Originality:</b> Submitted works must consist of at least 55% newly recorded, previously unreleased material. Works relying heavily on uncleared samples or interpolations may be disqualified at the committee's discretion.</p>
                  <p><b>Album Definition:</b> To qualify as an album, a project must contain at least five different tracks and a total playing time of at least 15 minutes, or a minimum of 30 minutes with no track count requirement.</p>
                  <p><b>Re-issues and Deluxe Editions:</b> Expanded deluxe versions or remastered re-issues are ineligible if the original standard version of the work was submitted or nominated in a previous award cycle.</p>
                  <p><b>Linguistic Requirements:</b> For specific regional fields, such as the Latin Field, works must contain at least 51% lyrical content in the designated languages (Spanish or Portuguese) to remain eligible for those categories.</p>
                  <p><b>Best New Artist:</b> Eligibility is limited to artists with no more than three previous submissions who have never been nominated as a lead artist in any prior edition.</p>
                  <p><b>Entry Restrictions:</b> Artists are restricted to one solo entry per category. A second entry is permitted only through a collaboration. While partners may submit their own solo works in the same category, they are prohibited from entering multiple joint projects with the same collaborator.</p>
                  <p><b>Technical Exceptions:</b> Producers, songwriters, directors, and technical crews are exempt from entry limits and can receive multiple nominations within the same category.</p>
                </div>
                <div className="rule-item">
                  <span className="accent-text">03. VOTING</span>
                  <p>Nominations and Winners are selected through a multi-stage process involving both a professional committee and a hundred voting Recording Academy members.</p>
                  <p><b>Timeline & Nomination Phase:</b> The voting cycle commences 14 days after the eligibility window closes. During the first week, a shortlist of the top ten entries is established. In the second week, voters select five official nominees from this list; a sixth or seventh nominee is permitted only in the event of a tie.</p>
                  <p><b>General Field Selection:</b> In the third week, field representatives submit two recommendations per General Field category to the main committee. Any rejection by the committee requires a robust, formal justification. By the fourth week, the General Field Committee elects the final nominees for the main categories. The comittee can submit a work that wasn't officially a entry by any genre field but can only be accepted if all of the members agree.</p>
                  <p><b>Final Voting:</b> Final nominations are publicized to members and the general public in the fifth week. The concluding voting round opens immediately thereafter and lasts for two weeks.</p>
                  <p><b>Voting Jurisdiction:</b> Members are eligible to vote within their specific niche, visual media field and all General Field categories. However, the committee retains exclusive voting jurisdiction over technical and honorary categories, including Producer of the Year, Songwriter of the Year, Best Engineered Album, Diamond Icon Award, and Best Vocal Performance. As of 2026, the voting members consists in 29% Pop/Dance-Electronic, 27% R&B/Rap/Afrobeat, 20% Latín/Global, 16% Alternative/Rock/Metal, 5% Country, 3% Jazz.</p>
                  <p><b>Announcement:</b> Winners are kept confidential until the official announcement during the annual awards ceremony.</p>
                </div>
                <div className="rule-item">
                  <span className="accent-text">04. CATEGORIES</span>
                  <p>Entries are placed into fields based on genre, with General Field categories open to all eligible releases.</p>
                  <p><b>Genre Classification:</b> The awards feature six specialized fields plus the General Field. Genre assignment is determined by a 51% content threshold; works failing to meet this requirement are categorized under "Alternative" or reallocated by voters based on cultural and sonic analysis. In unique cases, a work may qualify exclusively for the General Field.</p>
                  <p><b>Accreditation & Trophies:</b> Performance and Recording categories honor lead artists and general producers. Song categories recognize lead artists and songwriters. For Best Collaboration and Best Music for Visual Media, all mentioned roles are eligible for nomination. While not officially nominated, engineers, mixers, and arrangers may request official certificates upon a category victory.</p>
                  <p><b>Credit Hierarchy:</b> To maintain clarity, contributors are credited only once per work. If a lead artist serves as a producer or songwriter, they receive a single primary credit. Producers who also act as songwriters are credited exclusively in the production field.</p>
                  <p><b>Nominative Restrictions:</b></p>
                    <p>Artist-Only categories: Artist of the Year, Best New Artist, Producer of the Year, Songwriter of the Year, and Best Vocal Performance are restricted to lead artists.</p>
                    <p>Artist-Excluded: Lead artists are ineligible for Best Engineered Album and Best Remixed Recording, unless they serve as the official remixer of the track.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}