import Button from "./_components/Button/Button";

const defaultMessage = (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'}}>
    <p className="H4" style={{ textAlign: "center" }}>
      Sorry, we couldn&apos;t find the page you&apos;re looking for.
    </p>
    <Button href="/" >Go back home</Button>
  </div>
);
export default async function Page404({
  customMessage,
}: {
  customMessage?: React.ReactNode;
}) {
  return (
    <div className="SectionRoot" style={{ height: "90vh" }}>
      <div className="SectionInner" style={{ gap: "1rem" }}>
        <h1 className="Title">404</h1>
        <div className="BodyLarge" style={{ textAlign: "center" }}>
          {customMessage || defaultMessage}
        </div>
      </div>
    </div>
  );
}
