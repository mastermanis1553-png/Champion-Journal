import { useState } from "react";

export default function Login({ onLogin }) {
  const [data, setData] = useState({ email: "", password: "" });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e5eaf5]">
      <div className="bg-white/40 backdrop-blur-xl p-6 rounded-2xl shadow-md w-[350px]">

        <h2 className="text-xl font-semibold text-[#8458B3] mb-4">
          Login
        </h2>

        <input
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded-lg"
          onChange={(e) =>
            setData({ ...data, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded-lg"
          onChange={(e) =>
            setData({ ...data, password: e.target.value })
          }
        />

        <button
          onClick={() => onLogin(data)}
          className="w-full bg-[#8458B3] text-white py-2 rounded-xl"
        >
          Login
        </button>
      </div>
    </div>
  );
}