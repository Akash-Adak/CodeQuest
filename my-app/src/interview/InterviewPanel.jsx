import React from 'react';
import '../styles/InterviewPanel.css';

const InterviewPanel = () => {
  return (
    <div className="interview-container">
      <div className="left-info">
        <div className="action-wrapper disabled">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="1em"
            height="1em"
            fill="currentColor"
            className="icon"
          >
            <path
              fillRule="evenodd"
              d="M11.707 7.707L7.414 12l4.293 4.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414zM14.414 12l4.293 4.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L14.414 12z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="scroll-container">
          <div className="tab-container" draggable="true">
            <div className="tab-content">
              <div className="status-wrap">
                <div className="unactive-dot"></div>
                <div className="active-dot"></div>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="1em"
                height="1em"
                fill="currentColor"
                className="icon"
              >
                <path
                  fillRule="evenodd"
                  d="M18 7H6a1 1 0 00-1 1v8a1 1 0 001 1 1 1 0 011-1h3a1 1 0 011 1h7a1 1 0 001-1V8a1 1 0 00-1-1zm2.83 10c.11-.313.17-.65.17-1V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8c0 .35.06.687.17 1H3a1 1 0 100 2h18a1 1 0 100-2h-.17z"
                  clipRule="evenodd"
                />
              </svg>
              <span>WhiteBoard 1</span>
            </div>
          </div>
        </div>
        <div className="action-wrapper-right disabled">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="1em"
            height="1em"
            fill="currentColor"
            className="icon"
          >
            <path
              fillRule="evenodd"
              d="M12.293 16.293L16.586 12l-4.293-4.293a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414zM9.586 12L5.293 7.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L9.586 12z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      <div className="main-container">
        <div className="top-bar">
          <div className="duration">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="1em"
              height="1em"
              fill="currentColor"
              className="icon"
            >
              <path
                fillRule="evenodd"
                d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm1-13.4v4.782l3.047 1.524a1 1 0 11-.894 1.788l-3.6-1.8A1 1 0 0111 12V6.6a1 1 0 112 0z"
                clipRule="evenodd"
              />
            </svg>
            00:00:00
          </div>
          <div className="icon-wrap">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="1em"
              height="1em"
              fill="currentColor"
              className="icon"
            >
              <path
                fillRule="evenodd"
                d="M12 3a1 1 0 110 2H5.778A.778.778 0 005 5.778v12.444c0 .43.348.778.778.778h12.444c.43 0 .778-.348.778-.778V12a1 1 0 112 0v6.222A2.778 2.778 0 0118.222 21H5.778A2.778 2.778 0 013 18.222V5.778A2.778 2.778 0 015.778 3H12zm9.608-.608a2.803 2.803 0 010 3.964l-8.073 8.073a1 1 0 01-.465.263l-3.399.85a1 1 0 01-1.213-1.213l.85-3.4a1 1 0 01.263-.464l8.073-8.073a2.803 2.803 0 013.964 0zm-1.415 2.55a.803.803 0 00-1.135-1.135l-7.877 7.877-.378 1.513 1.513-.378 7.877-7.877z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="dropdown-trigger">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="1em"
              height="1em"
              fill="currentColor"
              className="icon"
            >
              <path
                fillRule="evenodd"
                d="M7.174 5.619a8.064 8.064 0 011.635-.946l.29-1.158A2 2 0 0111.039 2h1.922a2 2 0 011.94 1.515l.29 1.158c.584.252 1.132.57 1.635.946l1.15-.329a2 2 0 012.282.923l.961 1.665a2 2 0 01-.342 2.437l-.86.832a8.151 8.151 0 010 1.888l.86.83a2 2 0 01.342 2.438l-.96 1.665a2 2 0 01-2.283.923l-1.15-.329a8.063 8.063 0 01-1.635.946l-.29 1.158a2 2 0 01-1.94 1.515H11.04a2 2 0 01-1.94-1.515l-.29-1.158a8.064 8.064 0 01-1.635-.946l-1.15.329a2 2 0 01-2.282-.923l-.961-1.665a2 2 0 01.342-2.437l.86-.831a8.158 8.158 0 010-1.889l-.86-.83a2 2 0 01-.342-2.438l.96-1.665a2 2 0 012.283-.923l1.15.329zm-1.7 1.594l-.961 1.665 1.57 1.518-.114.982a6.157 6.157 0 000 1.425l.114.982-1.57 1.518.96 1.665 2.104-.601.794.593c.38.284.793.523 1.23.711l.908.392.53 2.118h1.922l.53-2.118.909-.392a6.07 6.07 0 001.23-.711l.793-.593 2.103.601.961-1.665-1.57-1.518.114-.982a6.172 6.172 0 000-1.425l-.114-.982 1.57-1.518-.96-1.665-2.104.601-.794-.593a6.067 6.067 0 00-1.23-.71l-.908-.392L12.96 4H11.04l-.53 2.119-.909.391a6.064 6.064 0 00-1.23.711l-.793.593-2.103-.601zM12 16a4 4 0 100-8 4 4 0 000 8zm0-2a2 2 0 110-4 2 2 0 010 4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="avatar-wrap">
            <div className="user-wrap" role="INTERVIEWER">
              <div className="avatar" style={{ color: 'rgba(0, 112, 255, 1)', fontSize: 24 }}>
                <span>A</span>
              </div>
            </div>
          </div>
          <div className="button-group">
            <button className="invite-button" style={{ width: 100 }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="1em"
                height="1em"
                fill="currentColor"
                className="icon"
              >
                <path
                  fillRule="evenodd"
                  d="M8 14h4a1 1 0 01.117 1.993L12 16H8a3 3 0 00-2.995 2.824L5 19v2a1 1 0 01-1.993.117L3 21v-2a5 5 0 014.783-4.995L8 14zm4-12a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6zm7.667 13.444H21a1.111 1.111 0 010 2.223h-1.333V21a1.111 1.111 0 01-2.223 0v-1.333h-1.333a1.111 1.111 0 010-2.223h1.333v-1.333a1.111 1.111 0 012.223 0v1.333z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Invite</span>
            </button>
          </div>
        </div>

        <div className="right-container">
          <div className="call-container">
            <div className="audio-wrapper">
              <div className="avatar-wrap-small">
                <div className="avatar" style={{ color: 'rgba(0, 112, 255, 1)' }}>
                  <span>A</span>
                </div>
              </div>
              <div className="text">Moderator Akash invite you to join the call</div>
              <div className="wrapper">
                <div className="icon-wrapper">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    color="rgba(136, 136, 136, 1)"
                    className="icon"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7 6a1 1 0 00-1-1H5l-.176.005A3 3 0 002 8v8l.005.176A3 3 0 005 19h9l.176-.005A3 3 0 0017 16v-1l-.007-.117A1 1 0 0015 15v1l-.007.117A1 1 0 0114 17H5l-.117-.007A1 1 0 014 16V8l.007-.117A1 1 0 015 7h1l.117-.007A1 1 0 007 6zm9.995 1.824A3 3 0 0014 5h-2.34l-.117.007A1 1 0 0011.66 7H14l.117.007A1 1 0 0115 8v1.34l.009.131a1 1 0 00.284.576l1 1 .094.083a1 1 0 00.93.158L20 10.39V15l.007.117A1 1 0 0022 15V9l-.007-.118a1 1 0 00-1.31-.83l-3.414 1.142-.27-.27L17 8l-.005-.176z"
                      clipRule="evenodd"
                    />
                    <path d="M2.253 2.336a1 1 0 011.312-.16l.1.077 18 16a1 1 0 01-1.23 1.572l-.1-.078-18-16a1 1 0 01-.082-1.411z" fill="#ef4743" />
                  </svg>
                </div>
                <div className="icon-wrapper">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    color="rgba(136, 136, 136, 1)"
                    className="icon"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2a3.999 3.999 0 00-3.464 2 1 1 0 101.731 1A2 2 0 0114 6v3.5a1 1 0 102 0V6a4 4 0 00-4-4zm-2 6.5a1 1 0 00-2 0V11a4 4 0 006 3.464 1 1 0 00-1-1.731A2 2 0 0110 11V8.5zM7 11a1 1 0 10-2 0 7.001 7.001 0 006 6.93V20H9a1 1 0 100 2h6a1 1 0 100-2h-2v-2.071a6.973 6.973 0 003.338-1.435 1 1 0 10-1.24-1.57A5 5 0 017 11zm12 0a1 1 0 10-2 0c0 .433-.055.852-.157 1.25a1 1 0 001.936.5A7.01 7.01 0 0019 11z"
                      clipRule="evenodd"
                    />
                    <path d="M3.253 3.336a1 1 0 011.312-.16l.1.077 17 15a1 1 0 01-1.23 1.572l-.1-.078-17-15a1 1 0 01-.082-1.411z" fill="#ef4743" />
                  </svg>
                </div>
              </div>
              <button className="join-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  className="icon"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.998 1h2.99A3.002 3.002 0 019.99 3.59c.116.885.333 1.754.644 2.588a3.002 3.002 0 01-.679 3.17l-.716.715.076.12a15 15 0 004.39 4.39l.12.075.72-.719a3 3 0 012.968-.741l.195.065c.836.313 1.706.53 2.6.647 1.508.213 2.618 1.522 2.58 3.02v2.996a3 3 0 01-3.288 2.998 20.78 20.78 0 01-9.058-3.22 20.489 20.489 0 01-6.303-6.3A20.804 20.804 0 011.012 4.27 3 3 0 013.998 1zm3.01 2H3.999a1 1 0 00-.996 1.075 18.8 18.8 0 002.92 8.239 18.51 18.51 0 005.7 5.697 18.775 18.775 0 008.175 2.913 1 1 0 001.09-1.004v-3.025a.998.998 0 00-.85-1.013 13.849 13.849 0 01-3.032-.756.998.998 0 00-1.05.221l-1.27 1.27a1 1 0 01-1.202.163 17 17 0 01-6.375-6.375 1 1 0 01.162-1.202l1.266-1.266a1 1 0 00.224-1.057 13.817 13.817 0 01-.753-3.02 1 1 0 00-1-.86z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Join</span>
              </button>
            </div>
          </div>

          <div className="evaluation-wrapper">
            <div className="evaluation-icons">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="1em"
                height="1em"
                fill="currentColor"
                className="icon"
              >
                <path
                  fillRule="evenodd"
                  d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2 2 6.477 2 12zm18 0a8 8 0 11-16 0 8 8 0 0116 0zM7.4 13.2a1 1 0 00-.2 1.4c.243.324.669.768 1.274 1.209C9.494 16.549 10.675 17 12 17c1.325 0 2.507-.45 3.526-1.191.605-.44 1.031-.885 1.274-1.209a1 1 0 00-1.6-1.2c-.132.176-.425.482-.85.791-.7.51-1.487.809-2.35.809s-1.65-.3-2.35-.809c-.425-.31-.718-.615-.85-.791a1 1 0 00-1.4-.2zm2.42-4.767l1.383.612a.497.497 0 010 .91l-1.383.612a.497.497 0 00-.253.253l-.612 1.383a.497.497 0 01-.91 0l-.612-1.383a.497.497 0 00-.253-.253l-1.383-.612a.497.497 0 010-.91l1.383-.612a.497.497 0 00.253-.253l.612-1.383a.497.497 0 01.91 0l.612 1.383c.05.113.14.203.253.253zm8.383.612l-1.383-.612a.497.497 0 01-.253-.253l-.612-1.383a.497.497 0 00-.91 0l-.612 1.383a.497.497 0 01-.253.253l-1.383.612a.498.498 0 000 .91l1.383.612c.113.05.203.14.253.253l.612 1.383a.498.498 0 00.91 0l.612-1.383a.497.497 0 01.253-.253l1.383-.612a.498.498 0 000-.91z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Excellent</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="1em"
                height="1em"
                fill="currentColor"
                className="icon"
              >
                <path
                  fillRule="evenodd"
                  d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm-4.8-5.4a1 1 0 011.6-1.2c.132.176.425.482.85.791.7.51 1.487.809 2.35.809s1.65-.3 2.35-.809c.425-.31.718-.615.85-.791a1 1 0 011.6 1.2c-.243.324-.669.768-1.274 1.209C14.506 16.549 13.325 17 12 17c-1.325 0-2.507-.45-3.526-1.191-.605-.44-1.031-.885-1.274-1.209zM9 10a1 1 0 010-2h.01a1 1 0 010 2H9zm6 0a1 1 0 110-2h.01a1 1 0 110 2H15z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Good</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="1em"
                height="1em"
                fill="currentColor"
                className="icon"
              >
                <path
                  fillRule="evenodd"
                  d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2 2 6.477 2 12zm18 0a8 8 0 11-16 0 8 8 0 0116 0zM8 9a1 1 0 001 1h.01a1 1 0 000-2H9a1 1 0 00-1 1zm6 0a1 1 0 001 1h.01a1 1 0 100-2H15a1 1 0 00-1 1zm-5 5a1 1 0 100 2h6a1 1 0 100-2H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Poor</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="1em"
                height="1em"
                fill="currentColor"
                className="icon"
              >
                <path
                  fillRule="evenodd"
                  d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2 2 6.477 2 12zm18 0a8 8 0 11-16 0 8 8 0 0116 0zM8 9a1 1 0 001 1h.01a1 1 0 000-2H9a1 1 0 00-1 1zm6 0a1 1 0 001 1h.01a1 1 0 100-2H15a1 1 0 00-1 1zm-6.6 7.8a1 1 0 01-.2-1.4c.243-.324.669-.769 1.274-1.209C9.494 13.451 10.675 13 12 13c1.325 0 2.507.45 3.526 1.191.605.44 1.031.885 1.274 1.209a1 1 0 11-1.6 1.2c-.132-.176-.425-.482-.85-.791-.7-.51-1.487-.81-2.35-.81s-1.65.3-2.35.81c-.425.31-.718.615-.85.79a1 1 0 01-1.4.2z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Very Bad</span>
            </div>
            <div className="evaluation-input">
              <textarea placeholder="Write your evaluation here..." />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPanel;
