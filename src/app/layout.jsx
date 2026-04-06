import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import Script from 'next/script';
import "./globals.css";

export const metadata = {
  title: "Courier Application",
  description: "Developed by A&A Technologies",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JE9W560T0Z"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JE9W560T0Z');
          `}
        </Script>

        <style>{`
  .wa-widget {
    position: fixed;
    bottom: 24px;
    right: 24px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
    z-index: 9999;
  }

  .wa-label {
    background: #ffffff;
    color: #111827;
    font-size: 13px;
    font-weight: 500;
    padding: 7px 13px;
    border-radius: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
    white-space: nowrap;
    pointer-events: none;
    animation: wa-fade-in 0.4s ease both, wa-fade-out 0.5s ease 60s forwards;
  }

  .wa-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    background: #25D366;
    border-radius: 50%;
    box-shadow: 0 4px 16px rgba(37, 211, 102, 0.45);
    text-decoration: none;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    animation: wa-pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  .wa-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 22px rgba(37, 211, 102, 0.55);
  }

  .wa-btn:active {
    transform: scale(0.96);
  }

  .wa-btn svg {
    width: 30px;
    height: 30px;
    fill: #ffffff;
  }

  @keyframes wa-pop-in {
    from { opacity: 0; transform: scale(0.5); }
    to   { opacity: 1; transform: scale(1); }
  }

  @keyframes wa-fade-in {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes wa-fade-out {
    from { opacity: 1; transform: translateY(0); }
    to   { opacity: 0; transform: translateY(6px); pointer-events: none; }
  }

  @media (max-width: 480px) {
    .wa-widget {
      bottom: 16px;
      right: 16px;
      gap: 8px;
    }
    .wa-btn {
      width: 50px;
      height: 50px;
    }
    .wa-btn svg {
      width: 26px;
      height: 26px;
    }
    .wa-label {
      font-size: 12px;
      padding: 6px 11px;
    }
  }
`}</style>
      </head>
      <body>
        {children}

        {/* WhatsApp Widget */}
        <div className="wa-widget">
          <span className="wa-label">Contact for Custom Rates!</span>
          <a
            href="https://wa.me/918419958646"
            target="_blank"
            rel="noopener noreferrer"
            className="wa-btn"
            aria-label="Chat on WhatsApp for custom rates"
          >
            {/* Official WhatsApp icon path */}
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.004 2.667C8.637 2.667 2.667 8.637 2.667 16c0 2.358.636 4.64 1.843 6.638L2.667 29.333l6.895-1.807A13.275 13.275 0 0 0 16.004 29.333C23.37 29.333 29.333 23.363 29.333 16S23.37 2.667 16.004 2.667zm0 24.267a11.04 11.04 0 0 1-5.635-1.543l-.403-.24-4.093 1.072 1.093-3.987-.263-.41A11.01 11.01 0 0 1 5 16c0-6.075 4.928-11.003 11.004-11.003C23.072 4.997 27.997 9.925 27.997 16S23.072 26.934 16.004 26.934zm6.04-8.237c-.33-.165-1.953-.963-2.256-1.073-.303-.11-.523-.165-.743.165-.22.33-.852 1.073-1.045 1.293-.192.22-.385.247-.715.082-.33-.165-1.394-.513-2.656-1.638-.981-.875-1.643-1.956-1.836-2.286-.192-.33-.02-.508.145-.673.15-.148.33-.385.495-.578.165-.192.22-.33.33-.55.11-.22.055-.413-.027-.578-.083-.165-.743-1.79-1.018-2.45-.268-.643-.54-.555-.743-.565l-.633-.011c-.22 0-.578.083-.88.413-.303.33-1.155 1.128-1.155 2.752 0 1.624 1.183 3.194 1.348 3.415.165.22 2.327 3.553 5.638 4.984.788.34 1.402.543 1.881.695.79.251 1.509.216 2.077.131.634-.094 1.953-.797 2.228-1.568.275-.77.275-1.43.193-1.568-.083-.138-.303-.22-.633-.385z" />
            </svg>
          </a>
        </div>
      </body>
    </html>
  );
}