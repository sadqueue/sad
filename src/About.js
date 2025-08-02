// AboutPage.js
import React from 'react';
import { FaLaptopCode, FaLightbulb, FaUserAlt, FaBriefcaseMedical } from 'react-icons/fa';
import githublogo from "./images/github-mark.png"

const AboutPage = () => {
  const styles = {
    container: {
      maxWidth: '800px',
      margin: '50px auto',
      padding: '40px',
      background: '#fefefe',
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Arial, sans-serif',
      color: '#333',
      lineHeight: '1.6',
    },
    heading: {
      textAlign: 'center',
      marginBottom: '30px',
    },
    section: {
      marginBottom: '30px',
    },
    iconHeading: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '1.4em',
      marginBottom: '10px',
    },
    profileImg: {
      width: '150px',
      borderRadius: '50%',
      margin: '0 auto 20px',
      display: 'block',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
  };

  return (
    <div>    <div className="header">
      <h1 className="title">S.A.D.Q.</h1>
      <h2 className="subtitle">Standardized Admissions Distribution Queue</h2>
    </div>
      <div style={styles.container}>
        <h1 style={styles.heading}>About</h1>

        {/* <img
        src="https://github.com/sadqueue/sad/blob/main/src/images/sadqueuelogo.png" // Replace with your profile image URL
        alt="Profile"
        style={styles.profileImg}
      /> */}

        <div style={styles.section}>
          <div style={styles.iconHeading}>
            <FaUserAlt /> <span>About</span>
          </div>
          <p>
            SADQ (Standardized Admission Distribution Queue) is a custom-built tool designed to streamline and automate the hospitalist admission process. It intelligently organizes and assigns patient admissions based on timestamp data and team-specific rules, ensuring a fair, transparent, and efficient workflow. Backed by real-time data handling, SADQ helps hospitalist teams manage workloads, reduce confusion, and improve collaboration. It’s an evolving tool created with direct feedback from physicians, tailored to meet the unique needs of hospital environments.
          </p>
        </div>
        <br></br>
        <div style={styles.section}>
          <div style={styles.iconHeading}>
            <FaLaptopCode /> <span>What We Do</span>
          </div>
          <p>
            We provide a smart, automated platform that simplifies and optimizes the hospitalist admission process. Our system uses timestamped data and team-specific logic to generate a fair and balanced admission order, ensuring equal distribution of workload across providers. By reducing manual tracking and communication gaps, SADQ empowers hospitalist teams to focus more on patient care and less on logistical challenges.
          </p>
        </div>
        <br></br>
        <div style={styles.section}>
          <div style={styles.iconHeading}>
            <FaLightbulb /> <span>Our Mission</span>
          </div>
          <p>
            Our mission is to support hospitalist teams by bringing clarity, fairness, and efficiency to the admission workflow. We strive to build intuitive tools that are shaped by real-world clinical needs and provider feedback. Through thoughtful design and continuous innovation, we aim to improve the daily experience of hospitalists and ultimately enhance patient care delivery.
          </p>
        </div>
        <br></br>
        <div style={styles.section}>
          <div style={styles.iconHeading}>
            <FaBriefcaseMedical /> <span>Disclaimer</span>
          </div>
          <p>
            This tool is provided for workflow support only. It does not replace clinical judgment. Final decisions remain the responsibility of the provider. No patient data is stored, and no PHI is processed. Use is granted “as is” with no implied warranties or support. The developers assume no liability for outcomes resulting from use.        </p>
        </div>
        <br></br>
      </div>
      <div className="footer">
        {/* <img
        alt="copy button"
        className="githubbutton"
        src={githublogo}
        onClick={(ev) => {
            window.open("https://github.com/sadqueue/sad/tree/main", '_blank');
        }} /> */}
        <div className="footer">
          {/* <img
                            alt="copy button"
                            className="githubbutton"
                            src={githublogo}
                            onClick={(ev) => {
                                window.open("https://github.com/sadqueue/sad/tree/main", '_blank');
                            }} /> */}
          <p className="footer-text">&copy; {new Date().getFullYear()} Genki MD LLC</p>
          <p className="footer-text">All rights reserved. Licensed use only.</p>
          <p className="footer-text">This tool is for workflow support only. Providers are responsible for final admission and care decisions.</p>
        </div>
      </div>
    </div>

  );
};

export default AboutPage;
