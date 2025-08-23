const defaultMessage = <p className="H4" style={{textAlign: 'center'}}>Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>;
export default async function Page404({ customMessage }: { customMessage?: React.ReactNode }) {
  return <div className="SectionRoot" style={{height: '100vh'}}>
    <div className="SectionInner">
      <h1 className="Title">404</h1>
      <div>{customMessage || defaultMessage}</div>
    </div>
  </div>;
}