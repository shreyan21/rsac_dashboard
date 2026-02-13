import logo from "../assests/logo.jpg";
export default function Header() {
  return (
    <header className="rsac-header">
      <img src={logo} className="rsac-logo" />
      <h1>Remote Sensing Applications Centre, Uttar Pradesh</h1>
    </header>
  );
}
