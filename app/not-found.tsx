// This is a minimal not-found page that doesn't use any client components
// to avoid any potential issues with client-side rendering during build

export default function NotFound() {
  return (
    <html>
      <head>
        <title>404 - Page Not Found</title>
        <style>{
          `
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f8f9fa;
            color: #1a1a1a;
          }
          .container {
            text-align: center;
            max-width: 28rem;
            padding: 2rem;
          }
          h1 {
            font-size: 3rem;
            margin: 0 0 1rem;
            line-height: 1;
          }
          h2 {
            font-size: 1.5rem;
            margin: 0 0 1rem;
            font-weight: 500;
          }
          p {
            color: #4b5563;
            margin: 0 0 2rem;
            line-height: 1.5;
          }
          a {
            display: inline-block;
            background-color: #000;
            color: white;
            padding: 0.5rem 1.5rem;
            border-radius: 0.375rem;
            text-decoration: none;
            font-weight: 500;
            transition: background-color 0.2s;
          }
          a:hover {
            background-color: #1a1a1a;
          }
          `
        }</style>
      </head>
      <body>
        <div className="container">
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>The page you're looking for doesn't exist or has been moved.</p>
          <a href="/">← Go back home</a>
        </div>
      </body>
    </html>
  );
}

// This ensures this route is never cached and always rendered on the server
export const dynamic = 'force-dynamic';
