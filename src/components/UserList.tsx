import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import "../styles/global.css";

export default function UserList() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const querySnapshot = await getDocs(collection(db, "users"));
      const data: any[] = [];
      querySnapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      setUsers(data);
    }

    fetchData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        Usuarios
      </h1>
      <div className="mb-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => alert("Agregar usuario")}
        >
          Agregar Usuario
        </button>
      </div>
      <ul className="space-y-4">
        {users.map((user) => (
          <li
            key={user.id}
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 border border-gray-200"
          >
            <div className="flex flex-wrap items-center gap-2">
              <strong className="text-lg font-semibold text-blue-600">
                {user.name}
              </strong>
              <span className="text-gray-600">-</span>
              <span className="text-gray-700">{user.email}</span>
              <span className="text-gray-600 hidden md:inline">-</span>
              <span className="text-gray-700">{user.phone}</span>
              <span className="text-gray-600 hidden md:inline">-</span>
              <span className="text-gray-700">{user.address}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
