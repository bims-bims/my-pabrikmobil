import { useState } from "react";
import { ethers } from "ethers";

const contractABI = []//pastikan abi mu disini;
const contractAddress = "0x...."; // ganti dengan alamat kontrakmu

export default function App() {
  const [mobil, setMobil] = useState(null);
  const [account, setAccount] = useState("");
  const [warnaBaru, setWarnaBaru] = useState(""); 
  const [loading, setLoading] = useState(false);

  // Koneksi ke Metamask
  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
    } else {
      alert("Metamask tidak ditemukan!");
    }
  };

  // Ambil data mobil
  const getData = async () => {
    if (!account) {
      alert("⚠️ Harus konek wallet dulu!");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const data = await contract.getDataMobil();
      setMobil({
        nama: data[0],
        warna: data[1],
        tahun: data[2].toString(),
        pemilik: data[3],
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Update warna mobil
  const ubahWarna = async () => {
    if (!account) {
      alert("⚠️ Harus konek wallet dulu!");
      return;
    }
    if (!warnaBaru) {
      alert("Isi warna baru dulu!");
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.updateWarnaMobil(warnaBaru);
      await tx.wait();

      alert("✅ Warna mobil berhasil diubah!");
      setWarnaBaru("");
      getData();
    } catch (err) {
      console.error(err);
      alert("❌ Gagal ubah warna, cek console!");
    } finally {
      setLoading(false);
    }
  };

  // Jalankan fungsi kontrol mobil
  const jalankanFungsi = async (namaFungsi) => {
    if (!account) {
      alert("⚠️ Harus konek wallet dulu!");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      let hasil;
      if (namaFungsi === "maju") hasil = await contract.maju();
      if (namaFungsi === "mundur") hasil = await contract.mundur();
      if (namaFungsi === "belokKiri") hasil = await contract.belokKiri();
      if (namaFungsi === "belokKanan") hasil = await contract.belokKanan();

      alert("✅ " + hasil);
    } catch (err) {
      console.error(err);
      alert("❌ Gagal jalankan fungsi, cek console!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-[450px] text-center">
        <h1 className="text-2xl font-bold mb-6">🚗 MobilQu Dapps 🚗</h1>

        {!account ? (
          <button onClick={connectWallet} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg w-full mb-4">
            Connect Wallet
          </button>
        ) : (
          <p className="mb-4 text-gray-700">✅ Wallet: {account}</p>
        )}

        <button onClick={getData} className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg w-full mb-6">
        📑Lihat Data STNK Mobil📑
        </button>

        {mobil && (
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner text-left mb-6">
            <p><b>Nama Mobil:</b> {mobil.nama}</p>
            <p><b>Warna Mobil:</b> {mobil.warna}</p>
            <p><b>Tahun Pembuatan:</b> {mobil.tahun}</p>
            <p><b>Pemilik:</b> {mobil.pemilik}</p>
          </div>
        )}

        <div className="space-y-3 mb-6">
          <input
            type="text"
            placeholder="Warna baru"
            value={warnaBaru}
            onChange={(e) => setWarnaBaru(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            disabled={loading}
          />
          <button
            onClick={ubahWarna}
            disabled={loading}
            className={`px-5 py-2 rounded-lg w-full text-white 
              ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"}
            `}
          >
            {loading ? "⏳ Proses..." : "Ubah Warna Mobil"}
          </button>
        </div>

        <h2 className="text-xl font-bold mb-4">⚙️ Kontrol Mobil</h2>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => jalankanFungsi("maju")} className="bg-blue-600 text-white px-3 py-2 rounded-lg">
          Maju🚗⬆️
          </button>
          <button onClick={() => jalankanFungsi("mundur")} className="bg-red-600 text-white px-3 py-2 rounded-lg">
          Mundur🚗⬇️
          </button>
          <button onClick={() => jalankanFungsi("belokKiri")} className="bg-yellow-600 text-white px-3 py-2 rounded-lg">
          Belok Kiri🚗⬅️
          </button>
          <button onClick={() => jalankanFungsi("belokKanan")} className="bg-green-600 text-white px-3 py-2 rounded-lg">
          Belok Kanan🚗➡️
          </button>
        </div>
      </div>
    </div>
  );
}
