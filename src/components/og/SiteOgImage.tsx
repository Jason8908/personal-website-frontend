export type SiteOgImageProps = {
  name: string;
  role: string;
};

export function SiteOgImage({ name, role }: SiteOgImageProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        background: '#0F1413',
        color: '#EAFBFF',
        fontFamily:
          "'Geist', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        boxSizing: 'border-box',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
   >
        <h1
          style={{
            margin: 0,
            fontSize: 120,
            lineHeight: 1.05,
            letterSpacing: -2,
            fontWeight: 800,
          }}
        >
          {name}
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: 48,
            color: '#858AE3',
            fontWeight: 600,
          }}
        >
          {role}
        </p>
    </div>
  );
}

export default SiteOgImage;

