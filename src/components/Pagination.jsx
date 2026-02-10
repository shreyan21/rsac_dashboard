export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      gap: "8px",
      marginTop: "20px"
    }}>
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        style={{
          padding: "6px 12px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          background: "#f5f5f5"
        }}
      >
        Prev
      </button>

      <span style={{
        padding: "6px 12px",
        background: "#0d3b66",
        color: "#fff",
        borderRadius: "6px"
      }}>
        {page}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        style={{
          padding: "6px 12px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          background: "#f5f5f5"
        }}
      >
        Next
      </button>
    </div>
  );
}
