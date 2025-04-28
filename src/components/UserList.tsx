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
    <div className="max-w-6xl mx-auto p-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-white mb-6 border-b pb-2 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 351"
          className="w-8 h-8"
        >
          <path fill="#FFA000" d="M0 277L128 0l32 72-64 114-40-86z" />
          <path fill="#F57F17" d="M0 277l62-172 40 86z" />
          <path fill="#FFCA28" d="M0 277l186 74 70-42-128-309z" />
        </svg>
        Firebase firestore
      </h1>

      <div className="mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 cursor-pointer"
        >
          Agregar Usuario
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 p-4 rounded-lg max-w-lg w-full shadow-lg">
            <div className="flex justify-end">
              <button
                onClick={() => setShowForm(false)}
                className="text-white text-2xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>
            <CreateUser
              onUserAdded={() => {
                fetchUsers();
                setShowForm(false);
              }}
            />
          </div>
        </div>
      )}

      <form className="w-full mx-auto">
        <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
          Buscar
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-0 focus:border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-0 dark:focus:border-gray-600"
            placeholder="Buscar Usuario"
            required
          />
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Buscar
          </button>
        </div>
      </form>

      <br />

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 min-w-[120px]">
                Nombre
              </th>
              <th scope="col" className="px-6 py-3 min-w-[180px]">
                Mail
              </th>
              <th scope="col" className="px-6 py-3 min-w-[120px]">
                Teléfono
              </th>
              <th scope="col" className="px-6 py-3 min-w-[200px]">
                Dirección
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center min-w-[80px] w-[80px]"
              >
                Editar
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {user.name}
                </td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.phone}</td>
                <td className="px-6 py-4">{user.address}</td>
                <td className="px-6 py-4 text-center w-[80px]">
                  <button
                    onClick={() => console.log(`Edit user: ${user.id}`)}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    title="Editar"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 mx-auto"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 3.487a2.25 2.25 0 1 1 3.182 3.182L7.5 19.213l-4.5 1.5 1.5-4.5L16.862 3.487z"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
