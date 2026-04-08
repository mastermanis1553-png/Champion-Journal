import { useState } from "react";
import { auth, googleProvider } from "../../utils/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

export default function Signup() {
  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      alert("Account created");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Google signup success");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e5eaf5]">
      
      <div className="bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-lg w-[360px]">
        
        <h2 className="text-2xl font-semibold text-[#8458B3] mb-6 text-center">
          Create Account
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-3 rounded-lg bg-white/80 text-gray-800 border border-[#d0bdf4]"
          onChange={(e) =>
            setData({ ...data, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 rounded-lg bg-white/80 text-gray-800 border border-[#d0bdf4]"
          onChange={(e) =>
            setData({ ...data, password: e.target.value })
          }
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-[#8458B3] text-white py-3 rounded-xl hover:bg-[#6d4696] transition font-medium shadow-md"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <div className="my-4 text-center text-gray-500">OR</div>

        <button
          onClick={handleGoogleSignup}
          className="w-full border border-gray-300 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
}