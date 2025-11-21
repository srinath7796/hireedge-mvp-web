export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        padding: "2rem",
        textAlign: "center"
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
        HireEdge – AI Career Platform (MVP)
      </h1>
      <p style={{ maxWidth: "600px", marginBottom: "2rem" }}>
        This is the new Innovator MVP frontend. From here we will add:
        Resume Generator, AI Skills Matching, Career Roadmap, and Smart Talent
        Profile – all connected to our new backend.
      </p>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <a href="/resume" style={btnStyle}>Resume Generator</a>
        <a href="/skills" style={btnStyle}>Skills Matching</a>
        <a href="/roadmap" style={btnStyle}>Career Roadmap</a>
        <a href="/profile" style={btnStyle}>Talent Profile</a>
        <a href="/linkedin" style={btnStyle}>LinkedIn Optimiser</a>
        <a href="/visa" style={btnStyle}>Visa Sponsorship Pathway</a>  
      </div>
    </main>
  );
}

const btnStyle = {
  padding: "0.75rem 1.5rem",
  borderRadius: "999px",
  border: "1px solid #111",
  textDecoration: "none",
  fontWeight: 500
};
