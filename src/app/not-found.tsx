import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)",
        color: "#1e293b",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <Image
        src="/images/robofly_h.png"
        alt="Robofly Logo"
        width={120}
        height={120}
        style={{ marginBottom: "1.5rem" }}
      />
      <h1 style={{ fontSize: "3rem", fontWeight: 700, marginBottom: "1rem" }}>
        404
      </h1>
      <h2 style={{ fontSize: "2rem", fontWeight: 500, marginBottom: "1rem" }}>
        Page Not Found
      </h2>
      <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
        Sorry, the page you are looking for does not exist.
        <br />
        You may have mistyped the address or the page may have moved.
      </p>
      <Link
        href="/"
        style={{
          background: "#2563eb",
          color: "#fff",
          padding: "0.75rem 2rem",
          borderRadius: "0.5rem",
          textDecoration: "none",
          fontWeight: 600,
          boxShadow: "0 2px 8px rgba(37,99,235,0.15)",
          transition: "background 0.2s",
        }}
      >
        Go Home
      </Link>
    </div>
  );
}
