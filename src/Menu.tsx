import { Link } from "react-router-dom";
import "./index.css";

function Menu() {
  return (
    <div className="w-screen h-screen flex flex-col gap-8 justify-center items-center">
      <h1 className="text-2xl font-medium">Klasifikasi Jenis Sampah Secara Real-time</h1>
      <div className="flex gap-4 justify-center items-center">
        <Link
          to={"/stream"}
          className="rounded-lg border px-8 py-2 text-lg border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
        >
          Stream Video
        </Link>
        <Link
          to={"/photo"}
          className="rounded-lg border px-8 py-2 text-lg border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
        >
          Photo
        </Link>
      </div>
    </div>
  );
}

export default Menu;
