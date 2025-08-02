// ContactPage.js
import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { FaUser, FaEnvelope, FaCommentDots, FaPaperPlane } from 'react-icons/fa';
import CONFIG from "./config";
import githublogo from "./images/github-mark.png"

const ContactPage = () => {
  const form = useRef();
  const [status, setStatus] = useState('');

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      CONFIG.REACT_APP_EMAILJS_SERVICE_ID,
      CONFIG.REACT_APP_EMAILJS_TEMPLATE_ID,
      form.current,
      CONFIG.REACT_APP_EMAILJS_PUBLIC_KEY
    ).then(
      () => {
        setStatus('✅ Message sent successfully!');
        e.target.reset();
      },
      () => {
        setStatus('❌ Failed to send message. Try again.');
      }
    );
  };

  const styles = {
    container: {
      maxWidth: '50%',
      margin: '100px auto',
      padding: '30px',
      background: '#f8f9fa',
      borderRadius: '10px',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    },
    heading: {
      marginBottom: '20px',
      color: '#333',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
    },
    input: {
      padding: '12px',
      margin: '10px 0',
      border: '1px solid #ddd',
      borderRadius: '5px',
      fontSize: '1em',
      width: '100%'
    },
    button: {
      background: '#007bff',
      color: '#fff',
      padding: '12px 25px',
      border: 'none',
      borderRadius: '5px',
      fontSize: '1em',
      cursor: 'pointer',
      transition: 'background 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      marginLeft: '24px'
    },
    status: {
      marginTop: '15px',
      fontWeight: 'bold',
      color: '#28a745',
      marginLeft: '24px'
    },
    iconInput: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
  };

  return (
    <div><div className="header">
      <h1 className="title">S.A.D.Q.</h1>
      <h2 className="subtitle">Standardized Admissions Distribution Queue</h2>
    </div>
    <div style={styles.container}>
      
      <h2 style={styles.heading}>Contact Us</h2>
      <form ref={form} onSubmit={sendEmail} style={styles.form}>
        <div style={styles.iconInput}>
          <FaUser />
          <input type="text" name="user_name" placeholder="Your Name" required style={styles.input} />
        </div>
        <div style={styles.iconInput}>
          <FaEnvelope />
          <input type="email" name="user_email" placeholder="Your Email" required style={styles.input} />
        </div>
        <div style={styles.iconInput}>
          <FaCommentDots />
          <textarea name="message" placeholder="Your Message" required style={styles.input} rows={10}></textarea>
        </div>
        <button type="submit" style={styles.button}>
          <FaPaperPlane /> Send
        </button>
      </form>
      {status && <p style={styles.status}>{status}</p>}
    </div>
    <div className="footer">
      <img
          alt="copy button"
          className="githubbutton"
          src={githublogo}
          onClick={(ev) => {
              window.open("https://github.com/sadqueue/sad/tree/main", '_blank');
          }} />
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

export default ContactPage;
