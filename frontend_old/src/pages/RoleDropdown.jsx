function RoleDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = React.useRef(null);

  const roles = ["Contributor", "Lead", "Assistant", "Manager"];

  React.useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="role-dd">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="role-dd-trigger"
      >
        <span className="role-dd-chip">{value}</span>
        <img src="/Polygon.svg" className={`role-dd-arrow ${open ? "rot" : ""}`} />
      </button>

      {open && (
        <div className="role-dd-menu">
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => {
                onChange(r);
                setOpen(false);
              }}
              className={`role-dd-item ${value === r ? "active" : ""}`}
            >
              {r}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
