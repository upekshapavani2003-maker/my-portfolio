import './globals.css';

export const metadata = {
  title: 'Steve Milner — Portfolio',
  description: 'Web Designer & Developer',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        {/* reCAPTCHA v2 script */}
        <script
          src="https://www.google.com/recaptcha/api.js?render=explicit&onload=initCaptcha"
          async
          defer
        ></script>
        <script dangerouslySetInnerHTML={{ __html: `
          function initCaptcha() {
            var container = document.getElementById('recaptcha-container');
            if (container && container.childElementCount === 0) {
              grecaptcha.render('recaptcha-container', {
                sitekey: '6LfLl6QtAAAAAH9swtIZuM4o1qetPSXnAqTGn5HV',
                callback: function(token) {
                  window.onCaptchaSuccess && window.onCaptchaSuccess(token);
                },
                'expired-callback': function() {
                  window.onCaptchaExpired && window.onCaptchaExpired();
                }
              });
            }
          }
        `}} />
      </head>
      <body className="dark-theme">
        {children}
      </body>
    </html>
  );
}