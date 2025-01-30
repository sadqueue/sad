import "./App.css";
import React, { useState, useEffect } from "react";
import moment from "moment";
import {
    SHIFT_TYPES,
    START_TIMES,
    SCORE_NEW_ROLE,
    DATA_TYPE_INT,
    DATA_TYPE_TIME,
    CHRONIC_LOAD_RATIO_THRESHOLD,
    ADMISSIONS_FORMAT,
    TIME_FORMAT,
    MINIMIZE_TABLE,
    EXPAND_TABLE,
    ROLE_ORDER,
    SHOW_ROWS_TABLE,
    SHOW_ROWS_COPY,
    COPIED_MSG_1
} from "./constants";
import copybuttonImg from "./images/copy.png";
import githublogo from "./images/github-mark.png"
import emailjs from "@emailjs/browser";
import CONFIG1 from "./config";

const CONFIG = CONFIG1;

export function CopyMessages() {
    const [isCopied, setIsCopied] = useState(false);
    
    return (
        <fieldset className="copymessage">
            <div>
                <img
                    alt="copy button"
                    className="copybuttonforcopymsg"
                    src={copybuttonImg}
                    onClick={(ev) => {

                        navigator.clipboard.writeText(COPIED_MSG_1);
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 1000);

                    }} />
                <span className={`copied-message ${isCopied ? 'visible' : ''}`}>Copied!</span>
                <p>{COPIED_MSG_1}</p>
            </div>

            {}
        </fieldset>
    )
}

export default CopyMessages;