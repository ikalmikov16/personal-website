export function MobileNotSupported() {
  return (
    <div className="mns-root">
      <div className="mns-wallpaper" />
      <div className="mns-dialog">
        <div className="mns-icon">
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="4"
              y="6"
              width="56"
              height="40"
              rx="3"
              fill="#1a1a1a"
              stroke="#333"
              strokeWidth="2"
            />
            <rect x="8" y="10" width="48" height="32" rx="1" fill="#4a8fe7" />
            <path
              d="M32 12c-2.2 0-3.6 1.1-4.2 2.4-.1.3-.2.6-.2 1 0 1.8 1.5 3 2.8 3.8.3.2.5.5.5.9v.4c0 .3-.2.5-.5.5h-1.2c-.3 0-.5.2-.5.5v.8c0 .3.2.5.5.5h5.6c.3 0 .5-.2.5-.5v-.8c0-.3-.2-.5-.5-.5h-1.2c-.3 0-.5-.2-.5-.5v-.4c0-.4.2-.7.5-.9 1.3-.8 2.8-2 2.8-3.8 0-.4-.1-.7-.2-1C35.6 13.1 34.2 12 32 12z"
              fill="rgba(255,255,255,0.5)"
            />
            <rect x="22" y="46" width="20" height="6" rx="1" fill="#888" />
            <rect x="18" y="52" width="28" height="3" rx="1.5" fill="#777" />
          </svg>
        </div>
        <h1 className="mns-title">Mac OS X Snow Leopard</h1>
        <p className="mns-body">
          This website runs a Mac OS X Snow Leopard experience that requires a larger screen to
          enjoy.
        </p>
        <p className="mns-hint">Please visit from a computer for the full experience.</p>
      </div>
    </div>
  )
}
