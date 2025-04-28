import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import "../styles/global.css";
import { CreateUser } from "./CreateUser";

export default function UserList() {
  const [users, setUsers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);

  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const data: any[] = [];
    querySnapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-white mb-6 border-b pb-2">
        Astro - Firebase
      </h1>
  
      <div className="mb-6">
        {showForm ? (
          <CreateUser
            onUserAdded={() => {
              fetchUsers();
              setShowForm(false);
            }}
          />
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
          >
            Agregar Usuario
          </button>
        )}
      </div>
  
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Nombre</th>
              <th scope="col" className="px-6 py-3">Mail</th>
              <th scope="col" className="px-6 py-3">Teléfono</th>
              <th scope="col" className="px-6 py-3">Dirección</th>
            </tr>
          </thead>
          {users.map((user) => (
            <tbody key={user.id}>
              <tr className="border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {user.name}
                </th>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.phone}</td>
                <td className="px-6 py-4">{user.address}</td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
  
}
