import React, { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import "../styles/global.css";
import { CreateUser } from "./CreateUser";
import { EditUser } from "./EditUser";

export default function UserList() {
  const [users, setUsers] = useState<any[]>([]); // Todos los usuarios
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]); // Usuarios filtrados
  const [showForm, setShowForm] = useState(false); // Mostrar/ocultar formulario
  const [searchTerm, setSearchTerm] = useState(""); // Texto de búsqueda
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  /**
   * Obtiene todos los usuarios de la colección 'users' en Firestore
   * y actualiza tanto el estado de usuarios como el de usuarios filtrados.
   *
   * @async
   * @function fetchUsers
   * @returns {Promise<void>} No retorna un valor directamente, pero actualiza los estados:
   * - users: Array completo de usuarios
   * - filteredUsers: Array inicial de usuarios (igual a users al cargar)
   */
  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const data: any[] = [];
    querySnapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
    setUsers(data);
    setFilteredUsers(data); // Inicialmente mostramos todos los usuarios
  };

  /**
   * Maneja la búsqueda de usuarios basada en el término de búsqueda.
   * Realiza búsqueda en Firestore y tiene fallback a búsqueda local.
   *
   * @async
   * @function searchUsers
   * @param {React.FormEvent} e - Evento del formulario
   * @returns {Promise<void>} No retorna valor directamente, pero actualiza:
   * - filteredUsers: Resultados de búsqueda o todos los usuarios si está vacío
   *
   * @behavior
   * - Si el campo de búsqueda está vacío, muestra todos los usuarios
   * - Intenta búsqueda en Firestore con consulta por rango de texto
   * - Si falla Firestore, hace búsqueda local en memoria
   */
  const searchUsers = async (e: React.FormEvent) => {
    e.preventDefault();

    // Si el input está vacío, mostrar todos los usuarios
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    try {
      // Búsqueda en Firestore (solo si hay término de búsqueda)
      const q = query(
        collection(db, "users"),
        where("name", ">=", searchTerm),
        where("name", "<=", searchTerm + "\uf8ff")
      );

      const querySnapshot = await getDocs(q);
      const results: any[] = [];
      querySnapshot.forEach((doc) =>
        results.push({ id: doc.id, ...doc.data() })
      );

      setFilteredUsers(results);
    } catch (error) {
      console.error("Error searching users:", error);
      // Fallback a búsqueda local
      const localResults = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(localResults);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteDoc(doc(db, "users", userId));
      // Actualización optimizada sin necesidad de fetchUsers
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setFilteredUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  /**
   * Efecto que sincroniza los usuarios filtrados cuando:
   * - Cambia la lista completa de usuarios
   * - Cambia el término de búsqueda (si está vacío)
   *
   * @hook
   * @dependencies users, searchTerm
   * @behavior Actualiza filteredUsers a la lista completa cuando no hay término de búsqueda
   */
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
    }
  }, [users, searchTerm]);

  /**
   * Efecto que carga los usuarios al montar el componente
   *
   * @hook
   * @dependencies [] (solo se ejecuta una vez al montar)
   * @behavior Ejecuta fetchUsers para cargar la lista inicial de usuarios
   */
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

      <form onSubmit={searchUsers} className="w-full mx-auto">
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
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-0 focus:border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-0 dark:focus:border-gray-600"
            placeholder="Buscar Usuario por nombre"
            required
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
              <th
                scope="col"
                className="px-6 py-3 text-center min-w-[80px] w-[80px]"
              >
                Eliminar
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
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
                      onClick={() => setEditingUserId(user.id)}
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
                  <td className="px-6 py-4 text-center w-[80px]">
                    <button
                      onClick={() => setUserToDelete(user.id)}
                      className="font-medium text-red-600 dark:text-red-500 hover:underline"
                      title="Eliminar"
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
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="bg-white dark:bg-gray-800">
                <td colSpan={5} className="px-6 py-4 text-center">
                  No se encontraron usuarios
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {editingUserId && (
        <EditUser
          userId={editingUserId}
          onUserUpdated={() => {
            fetchUsers();
            setEditingUserId(null);
          }}
          onClose={() => setEditingUserId(null)}
        />
      )}
      {userToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg max-w-md">
            <h3 className="text-lg font-bold mb-4">Confirmar eliminación</h3>
            <p>¿Estás seguro de eliminar este usuario?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setUserToDelete(null)}
                className={`px-4 py-2 bg-blue-500 rounded cursor-pointer ${
                  isDeleting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-600"
                }`}
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  setIsDeleting(true);
                  await handleDeleteUser(userToDelete);
                  setIsDeleting(false);
                  setUserToDelete(null);
                }}
                className={`px-4 py-2 bg-red-500 text-white rounded cursor-pointer flex items-center justify-center gap-2 ${
                  isDeleting ? "opacity-75" : "hover:bg-red-600"
                }`}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Eliminando...
                  </>
                ) : (
                  "Eliminar"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
