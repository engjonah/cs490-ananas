export default function BackendStatus({ status }) {
  return (
    <>
      <p>Backend Status:</p>
      {!status && <p>API not working</p>}
      {status && status.map((item, index) => <p key={index}>{item.test}</p>)}
    </>
  );
}
