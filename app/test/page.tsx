export default function TestPage() {
  return (
    <>
      <head>
        <meta name="theme-color" content="#ff00ff" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#00ffff" media="(prefers-color-scheme: light)" />
      </head>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#ff00ff",
        }}
      />
    </>
  );
}
